import { NextRequest, NextResponse } from 'next/server';
import { generateMultiPlatformPostsAction } from '@/modules/ai/actions/generate-post.action';
import { checkAndEnforceDailyQuota, SubscriptionTier } from '@/modules/billing/services/quota.service';
import { publishMultiPlatformPost, createProfileGroup, getConnectAuthUrl, getUnifiedInteractions, replyToInteraction } from '@/lib/postproxy';
import { TextEngineService } from '@/modules/ai/services/text-engine.service';
import { HashtagEngineService } from '@/modules/ai/services/hashtag-engine.service';
import { CalendarManagerService } from '@/modules/posts/services/calendar-manager.service';
import { Logger } from '@/lib/ai-text-editor/logging/Logger';
import { ImageGenerationProvider } from '@/lib/ai-image-generator/images/ImageGenerationProvider';
import { ImageResponseNormalizer } from '@/lib/ai-image-generator/images/ImageResponseNormalizer';
import { ImageStorageService } from '@/lib/ai-image-generator/images/ImageStorageService';
import { ImagePromptBuilder } from '@/lib/ai-image-generator/images/ImagePromptBuilder';
import { CanonicalImageService } from '@/lib/ai-image-generator/images/CanonicalImageService';
import { ImageGenerationContract, ImageRecreationRequest } from '@/lib/ai-image-generator/images/image.types';

export type OrchestrationAction =
  | 'generate_post'
  | 'generate_text'
  | 'generate_hashtags'
  | 'recreate_image'
  | 'regenerate_image'
  | 'calendar_manage'
  | 'publish_post'
  | 'social_connect'
  | 'social_inbox'
  | 'social_reply'
  | 'video_render'
  | 'on_signup';

export type GenerationResponse = {
  success: boolean;
  requestId: string;
  data?: {
    title?: string;
    content: string;
    imagePrompt?: string;
    imageUrl?: string;
    imageMimeType?: string;
    imageSource?: string;
    imageStatus?: 'generated' | 'stored' | 'failed';
    storagePath?: string;
    imageError?: string;
    hashtags?: string[];
    seo?: {
      keywords?: string[];
      description?: string;
    };
    metadata?: Record<string, unknown>;
  };
  error?: {
    code: string;
    message: string;
  };
};

export async function POST(req: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  try {
    const body = await req.json().catch(() => ({}));
    const action: OrchestrationAction = body.action || req.nextUrl.searchParams.get('action') || 'generate_post';

    Logger.info('OrchestrateRoute', 'studio_request_received', { requestId, action, bodyKeys: Object.keys(body) }, requestId);

    switch (action) {
      case 'recreate_image':
      case 'regenerate_image': {
        const {
          operation = action === 'recreate_image' ? 'recreate' : 'regenerate',
          sourceImageId,
          sourceImageUrl,
          originalImagePrompt,
          topic,
          postTopic,
          postContent,
          platform,
          postType,
          templateId,
          width,
          height,
          aspectRatio,
          brandKitId,
          visualStyle,
          recreationInstructions,
          userId,
          userTier,
        } = body;

        const isImageToImage = body.isImageToImage === true || operation === 'edit';
        if (isImageToImage && (!sourceImageUrl || typeof sourceImageUrl !== 'string' || !sourceImageUrl.trim())) {
          return NextResponse.json(
            { success: false, requestId, error: { code: 'SOURCE_IMAGE_REQUIRED', message: 'Image-to-image recreation requires a valid source image URL.' } },
            { status: 400 }
          );
        }

        const inputTopic = postTopic || topic || body.basePrompt || body.content || body.masterText;
        if (!inputTopic || typeof inputTopic !== 'string' || !inputTopic.trim()) {
          return NextResponse.json(
            { success: false, requestId, error: { code: 'INVALID_INPUT', message: 'Missing post topic or prompt for image recreation.' } },
            { status: 400 }
          );
        }

        const uid = userId || 'guest-user';
        const tier: SubscriptionTier = userTier || 'starter';

        const quotaCheck = await checkAndEnforceDailyQuota(uid, tier);
        if (!quotaCheck.allowed) {
          return NextResponse.json(
            { success: false, requestId, error: { code: 'QUOTA_EXCEEDED', message: quotaCheck.error || 'Quota exceeded.' } },
            { status: 429 }
          );
        }

        const imageReq: ImageRecreationRequest = {
          operation,
          sourceImageId,
          sourceImageUrl,
          originalImagePrompt,
          postTopic: inputTopic,
          postContent,
          platform,
          postType,
          templateId,
          width: Number(width) || undefined,
          height: Number(height) || undefined,
          aspectRatio,
          brandKitId,
          visualStyle,
          recreationInstructions,
          versionId: `v_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        };

        const storedContract = await CanonicalImageService.generateImageForPost(imageReq, uid);

        return NextResponse.json({
          success: storedContract.imageStatus !== 'failed',
          requestId,
          data: {
            title: `Image for ${inputTopic.slice(0, 40)}`,
            content: postContent || inputTopic,
            imagePrompt: storedContract.promptUsed,
            imageUrl: storedContract.imageUrl,
            imageMimeType: storedContract.imageMimeType,
            imageSource: storedContract.imageSource,
            imageStatus: storedContract.imageStatus,
            storagePath: storedContract.storagePath,
            imageError: storedContract.imageError,
            metadata: { imageContract: storedContract, recreationRequest: imageReq, versionId: imageReq.versionId },
          },
          quotaRemaining: quotaCheck.remaining,
        });
      }

      case 'calendar_manage': {
        const { subAction, postId, newDate, newTime, platforms } = body;
        if (subAction === 'reschedule') {
          const res = await CalendarManagerService.rescheduleEvent(postId, newDate, newTime || '10:00');
          return NextResponse.json({ requestId, ...res });
        }
        const times = CalendarManagerService.getOptimalTimeForPlatforms(Array.isArray(platforms) ? platforms : ['linkedin']);
        return NextResponse.json({ success: true, requestId, optimalTimes: times });
      }

      case 'generate_hashtags': {
        const { topic, platform, category, customBrandTag, maxTags, userId, userTier } = body;
        const inputTopic = topic || body.basePrompt || body.content || body.masterText;
        if (!inputTopic || typeof inputTopic !== 'string' || !inputTopic.trim()) {
          Logger.error('OrchestrateRoute', 'generation_failed', { requestId, error: 'MISSING_TOPIC' }, requestId);
          return NextResponse.json(
            {
              success: false,
              requestId,
              error: { code: 'INVALID_INPUT', message: 'Missing topic or prompt.' },
            },
            { status: 400 }
          );
        }

        const uid = userId || 'guest-user';
        const tier: SubscriptionTier = userTier || 'starter';

        Logger.info('OrchestrateRoute', 'authentication_passed', { requestId, uid }, requestId);

        const quotaCheck = await checkAndEnforceDailyQuota(uid, tier);
        if (!quotaCheck.allowed) {
          Logger.warn('OrchestrateRoute', 'quota_exceeded', { requestId, uid }, requestId);
          return NextResponse.json(
            {
              success: false,
              requestId,
              error: { code: 'QUOTA_EXCEEDED', message: quotaCheck.error || 'Daily generation quota exceeded.' },
            },
            { status: 429 }
          );
        }

        Logger.info('OrchestrateRoute', 'quota_passed', { requestId, remaining: quotaCheck.remaining }, requestId);

        const tagResult = await HashtagEngineService.process({
          topic: inputTopic,
          platform,
          category,
          customBrandTag,
          maxTags: Number(maxTags) || 20,
        });

        const allTags = tagResult.allHashtags || tagResult.tags?.map((t) => t.tag) || [];

        Logger.info('OrchestrateRoute', 'generation_completed', { requestId, count: allTags.length }, requestId);

        return NextResponse.json({
          success: true,
          requestId,
          data: {
            title: `Hashtags for ${inputTopic}`,
            content: allTags.join(' '),
            hashtags: allTags,
            metadata: { tagResult, quotaRemaining: quotaCheck.remaining },
          },
          hashtags: allTags,
          quotaRemaining: quotaCheck.remaining,
        });
      }

      case 'generate_text': {
        const { topic, action: textAction, currentText, tone, targetPlatforms, userId, userTier } = body;
        const inputTopic = topic || body.basePrompt || body.content || body.masterText;
        if (!inputTopic || typeof inputTopic !== 'string' || !inputTopic.trim()) {
          Logger.error('OrchestrateRoute', 'generation_failed', { requestId, error: 'MISSING_TOPIC' }, requestId);
          return NextResponse.json(
            {
              success: false,
              requestId,
              error: { code: 'INVALID_INPUT', message: 'Missing topic or prompt.' },
            },
            { status: 400 }
          );
        }

        const uid = userId || 'guest-user';
        const tier: SubscriptionTier = userTier || 'starter';

        Logger.info('OrchestrateRoute', 'authentication_passed', { requestId, uid }, requestId);

        const quotaCheck = await checkAndEnforceDailyQuota(uid, tier);
        if (!quotaCheck.allowed) {
          Logger.warn('OrchestrateRoute', 'quota_exceeded', { requestId, uid }, requestId);
          return NextResponse.json(
            {
              success: false,
              requestId,
              error: { code: 'QUOTA_EXCEEDED', message: quotaCheck.error || 'Daily quota exceeded.' },
            },
            { status: 429 }
          );
        }

        Logger.info('OrchestrateRoute', 'quota_passed', { requestId, remaining: quotaCheck.remaining }, requestId);

        const textResult = await TextEngineService.process({
          topic: inputTopic,
          action: textAction || 'full_article',
          currentText,
          tone: tone || 'executive',
          targetPlatforms,
        });

        if (!textResult.success || !textResult.text) {
          Logger.error('OrchestrateRoute', 'generation_failed', { requestId, error: textResult.error }, requestId);
          return NextResponse.json(
            {
              success: false,
              requestId,
              error: { code: 'GENERATION_FAILED', message: textResult.error || 'Text generation failed.' },
            },
            { status: 500 }
          );
        }

        Logger.info('OrchestrateRoute', 'generation_completed', { requestId }, requestId);

        return NextResponse.json({
          success: true,
          requestId,
          data: {
            title: `Content: ${inputTopic.slice(0, 40)}`,
            content: textResult.text,
            hashtags: textResult.hashtags || [],
            metadata: { ...textResult, quotaRemaining: quotaCheck.remaining },
          },
          text: textResult.text,
          adaptations: textResult.adaptations,
          quotaRemaining: quotaCheck.remaining,
        });
      }

      case 'generate_post':
      default: {
        const { basePrompt, content, masterText, topic, targetPlatforms, userId, userTier } = body;
        const inputPrompt = basePrompt || content || masterText || topic;
        if (!inputPrompt || typeof inputPrompt !== 'string' || !inputPrompt.trim()) {
          Logger.error('OrchestrateRoute', 'generation_failed', { requestId, error: 'MISSING_PROMPT' }, requestId);
          return NextResponse.json(
            {
              success: false,
              requestId,
              error: { code: 'INVALID_INPUT', message: 'Missing prompt ("topic", "basePrompt", "content", or "masterText").' },
            },
            { status: 400 }
          );
        }

        const tier: SubscriptionTier = userTier || 'starter';
        const uid: string = userId || 'guest-api-user';

        Logger.info('OrchestrateRoute', 'authentication_passed', { requestId, uid }, requestId);

        const quotaCheck = await checkAndEnforceDailyQuota(uid, tier);
        if (!quotaCheck.allowed) {
          Logger.warn('OrchestrateRoute', 'quota_exceeded', { requestId, uid }, requestId);
          return NextResponse.json(
            {
              success: false,
              requestId,
              error: { code: 'QUOTA_EXCEEDED', message: quotaCheck.error || 'Daily generation quota exceeded.' },
            },
            { status: 429 }
          );
        }

        Logger.info('OrchestrateRoute', 'quota_passed', { requestId, remaining: quotaCheck.remaining }, requestId);

        const result = await generateMultiPlatformPostsAction(inputPrompt, uid, tier, requestId);

        if (!result.success || !result.data) {
          const status = result.error?.includes('quota') ? 429 : 500;
          Logger.error('OrchestrateRoute', 'generation_failed', { requestId, error: result.error }, requestId);
          return NextResponse.json(
            {
              success: false,
              requestId,
              error: { code: status === 429 ? 'QUOTA_EXCEEDED' : 'GENERATION_FAILED', message: result.error || 'Post generation failed.' },
            },
            { status }
          );
        }

        let templates = result.data;
        if (Array.isArray(targetPlatforms) && targetPlatforms.length > 0) {
          const filtered: Record<string, string | undefined> = {};
          targetPlatforms.forEach((p: string) => {
            const k = p.toLowerCase();
            if (k in templates) filtered[k] = templates[k as keyof typeof templates];
          });
          if (templates.master_post) filtered.master_post = templates.master_post;
          templates = filtered as typeof result.data;
        }

        const primaryContent = templates.master_post || templates.linkedin || templates.facebook || inputPrompt;
        const targetPlatform = Array.isArray(targetPlatforms) && targetPlatforms[0] ? targetPlatforms[0] : 'LinkedIn';

        const imageContract = await CanonicalImageService.generateImageForPost(
          {
            operation: 'generate',
            postTopic: inputPrompt,
            postContent: primaryContent,
            platform: targetPlatform,
          },
          uid
        );

        Logger.info('OrchestrateRoute', 'generation_completed', { requestId, imageStatus: imageContract.imageStatus }, requestId);

        return NextResponse.json({
          success: true,
          requestId,
          data: {
            title: `Post for ${inputPrompt.slice(0, 40)}`,
            content: primaryContent,
            imagePrompt: imageContract.promptUsed,
            imageUrl: imageContract.imageUrl,
            imageMimeType: imageContract.imageMimeType,
            imageSource: imageContract.imageSource,
            imageStatus: imageContract.imageStatus,
            storagePath: imageContract.storagePath,
            imageError: imageContract.imageError,
            hashtags: ['#ContentStrategy', '#MiniPostApp', '#AIStudio'],
            seo: {
              keywords: [inputPrompt.slice(0, 30)],
              description: primaryContent.slice(0, 150),
            },
            metadata: { templates, providerUsed: 'gemini-3.6-flash', quotaRemaining: result.quotaRemaining, imageContract },
          },
          providerUsed: 'gemini-3.6-flash',
          quotaRemaining: result.quotaRemaining,
          templates,
          result: {
            ...templates,
            imagePrompt: imageContract.promptUsed,
            imageUrl: imageContract.imageUrl,
            imageStatus: imageContract.imageStatus,
            storagePath: imageContract.storagePath,
            imageError: imageContract.imageError,
          },
        });
      }

      case 'publish_post': {
        const { userId, profileGroupId, content, mediaUrls, targetPlatforms, userTier, scheduledAt } = body;
        if (!profileGroupId || !content) {
          return NextResponse.json(
            { success: false, requestId, error: { code: 'INVALID_INPUT', message: 'Missing profileGroupId or content.' } },
            { status: 400 }
          );
        }

        const platforms = Array.isArray(targetPlatforms) && targetPlatforms.length > 0
          ? targetPlatforms
          : ['facebook', 'instagram', 'linkedin', 'twitter'];
        const uid = userId || 'guest-user';
        const tier: SubscriptionTier = userTier || 'starter';

        const quotaCheck = await checkAndEnforceDailyQuota(uid, tier);
        if (!quotaCheck.allowed) {
          return NextResponse.json(
            { success: false, requestId, error: { code: 'QUOTA_EXCEEDED', message: quotaCheck.error || 'Quota exceeded.' } },
            { status: 429 }
          );
        }

        const publishResult = await publishMultiPlatformPost({
          profileGroupId,
          text: content,
          media: Array.isArray(mediaUrls) ? mediaUrls : [],
          platforms,
          scheduledAt,
        });

        return NextResponse.json({
          success: true,
          requestId,
          post: publishResult,
          quotaRemaining: quotaCheck.remaining,
        });
      }

      case 'social_connect': {
        const { profileGroupId, platform, redirectUrl } = body;
        if (!profileGroupId || !platform) {
          return NextResponse.json(
            { success: false, requestId, error: { code: 'INVALID_INPUT', message: 'Missing profileGroupId or platform.' } },
            { status: 400 }
          );
        }

        const authUrlRes = await getConnectAuthUrl(profileGroupId, platform, redirectUrl);
        return NextResponse.json({ success: true, requestId, url: authUrlRes.url, platform, profileGroupId });
      }

      case 'social_reply': {
        const { profileGroupId, interactionId, replyText, text } = body;
        if (!profileGroupId || !interactionId) {
          return NextResponse.json(
            { success: false, requestId, error: { code: 'INVALID_INPUT', message: 'Missing profileGroupId or interactionId.' } },
            { status: 400 }
          );
        }

        const res = await replyToInteraction(profileGroupId, interactionId, replyText || text);
        return NextResponse.json({ success: true, requestId, result: res });
      }

      case 'on_signup': {
        const { userId, userEmail } = body;
        const uid = userId || `user_${Date.now()}`;
        const email = userEmail || 'user@minipost.app';

        const profileGroup = await createProfileGroup(uid);
        return NextResponse.json({
          success: true,
          requestId,
          userId: uid,
          userEmail: email,
          profileGroupId: profileGroup.id,
        });
      }
    }
  } catch (error: any) {
    const isAbort = error?.name === 'AbortError' || error?.message?.includes('aborted');
    console.error('[POST /api/orchestrate] Exception caught:', {
      requestId,
      operation: 'POST /api/orchestrate',
      isAbort,
      abortReason: error?.message || 'Operation aborted',
      stackTrace: error?.stack,
    });
    Logger.error('OrchestrateRoute', isAbort ? 'operation_aborted' : 'generation_failed', { requestId, error: error?.message, stackTrace: error?.stack }, requestId);
    return NextResponse.json(
      {
        success: false,
        requestId,
        error: { code: isAbort ? 'OPERATION_ABORTED' : 'INTERNAL_ERROR', message: error?.message || 'Internal Server Error' },
      },
      { status: isAbort ? 504 : 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const requestId = `req_get_${Date.now()}`;
  try {
    const action = req.nextUrl.searchParams.get('action');

    if (action === 'social_inbox') {
      const profileGroupId = req.nextUrl.searchParams.get('profileGroupId') || '';
      const interactions = await getUnifiedInteractions(profileGroupId);
      return NextResponse.json({ success: true, requestId, profileGroupId, count: interactions.length, interactions });
    }

    return NextResponse.json(
      { success: false, requestId, error: { code: 'NOT_SUPPORTED', message: `Action "${action}" not supported on GET.` } },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[GET /api/orchestrate] Exception:', error);
    return NextResponse.json(
      { success: false, requestId, error: { code: 'INTERNAL_ERROR', message: error?.message || 'Internal Server Error' } },
      { status: 500 }
    );
  }
}
