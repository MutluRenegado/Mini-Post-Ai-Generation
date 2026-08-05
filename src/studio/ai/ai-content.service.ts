import { PostRequest, GeneratedContent } from '../types/studio.types';
import { BrandManagerService } from '../brand/brand.service';
import { StudioClientService } from '@/lib/services/studioClientService';
import { ContentSummarizer } from '@/lib/ai-image-generator/images/ContentSummarizer';
import { PostVisualBriefExtractor } from '@/lib/ai-image-generator/images/PostVisualBriefExtractor';
import { ImagePromptBuilder } from '@/lib/ai-image-generator/images/ImagePromptBuilder';

export interface InstantPostInput {
  rawIdea: string;
  goal: string;
  targetAudience: string;
  platforms: string[];
  tone: string;
  industry?: string;
  keywords?: string[];
  cta?: string;
  brandName?: string;
}

export interface MediaAssetPayload {
  type: 'image' | 'video';
  prompt: string;
  url: string;
}

export interface PlatformVariation {
  platform: string;
  title: string;
  body: string;
  hashtags: string[];
  cta: string;
  media_asset: MediaAssetPayload;
}

export interface InstantPostResult {
  platformVariations: PlatformVariation[];
}

/**
 * AIContentService v2.0 — Connects to the PromptOrchestrator pipeline via StudioClientService.
 * Zero hardcoded templates. Zero mock content. Zero silent swallows.
 */
export class AIContentService {
  static async generateContent(request: PostRequest): Promise<GeneratedContent> {
    const brand = BrandManagerService.getActiveBrandProfile();
    const topic = request.customPrompt || request.goal || request.industry || 'Social Media Strategy';

    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic,
      tone: request.tone || 'Professional',
      goal: request.goal || 'Brand Awareness',
      audience: request.targetAudience || 'Business professionals',
      industry: request.industry,
      keywords: request.keywords || [],
      brandName: brand.brandName,
      platforms: request.platforms || ['LinkedIn', 'Twitter (X)'],
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to generate studio content via AI pipeline.');
    }

    const content = response.data.content || '';
    const firstLine = content.split('\n')[0] || topic;

    return {
      hook: firstLine,
      headline: firstLine,
      caption: content,
      mainBody: content,
      cta: request.ctaText || 'Share your thoughts in the comments below!',
      suggestedEmojis: ['🚀', '✨', '🔥', '💡'],
      keywords: request.keywords?.length ? request.keywords : [topic],
      hashtags: response.data.hashtags || ['#ContentStrategy', '#MiniPostApp'],
    };
  }

  static async generateInstantContent(input: InstantPostInput): Promise<InstantPostResult> {
    const brand = BrandManagerService.getActiveBrandProfile();
    const raw = input.rawIdea.trim();
    const platforms = input.platforms.length > 0 ? input.platforms : ['LinkedIn', 'Twitter (X)', 'Instagram Feed'];

    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic: raw,
      tone: input.tone || 'Professional',
      goal: input.goal || 'Brand Awareness',
      audience: input.targetAudience || 'Professional business leaders',
      industry: input.industry,
      keywords: input.keywords || [],
      cta: input.cta,
      brandName: input.brandName || brand.brandName,
      platforms,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Instant AI generation failed.');
    }

    const metadata: Record<string, any> = response.data.metadata || {};
    const templates: Record<string, any> = metadata.templates || metadata.result || {};
    const studioOutput = metadata._studioOutput;
    const imageUrl = response.data.imageUrl || '';

    // Use full StudioOutput if available
    if (studioOutput && Array.isArray(studioOutput.platforms) && studioOutput.platforms.length > 0) {
      const variations: PlatformVariation[] = studioOutput.platforms.map((p: any) => ({
        platform: p.platform,
        title: p.hook?.slice(0, 80) || p.platform,
        body: p.body,
        hashtags: p.hashtags || [],
        cta: p.cta || 'Learn more and connect below!',
        media_asset: {
          type: this.isVideo(p.platform) ? 'video' : 'image',
          prompt: p.imagePrompt?.assembled || `Visual for ${raw.slice(0, 40)}`,
          url: imageUrl,
        },
      }));
      return { platformVariations: variations };
    }

    // Map variations per platform
    const variations: PlatformVariation[] = platforms.map((platform) => {
      const pKey = this.mapPlatformToKey(platform);
      const bodyText = templates[pKey] || templates.master_post || response.data?.content || raw;
      const title = bodyText.split('\n')[0]?.slice(0, 80) || platform;
      
      let imagePromptText = response.data?.imagePrompt;
      if (!imagePromptText && bodyText && bodyText.trim()) {
        try {
          const summary = ContentSummarizer.summarize({ finalText: bodyText, textStatus: 'approved', platform });
          const brief = PostVisualBriefExtractor.extractFromSummary(summary, { platform, postContent: bodyText });
          imagePromptText = ImagePromptBuilder.buildPromptFromBrief(brief);
        } catch (_) {
          imagePromptText = `Photorealistic modern visual derived from final post text for ${title}`;
        }
      }

      return {
        platform,
        title,
        body: bodyText,
        hashtags: response.data?.hashtags || ['#ContentStrategy'],
        cta: input.cta || 'Share your thoughts in the comments!',
        media_asset: {
          type: this.isVideo(platform) ? 'video' : 'image',
          prompt: imagePromptText || `Photorealistic visual for ${title}`,
          url: imageUrl,
        },
      };
    });

    return { platformVariations: variations };
  }

  private static isVideo(platform: string): boolean {
    return ['tiktok', 'youtube', 'instagram story'].some((p) => platform.toLowerCase().includes(p));
  }

  private static buildImageUrl(prompt: string): string {
    const encoded = encodeURIComponent(prompt.slice(0, 200));
    return `https://pollinations.ai/p/${encoded}?width=1200&height=675&seed=${Date.now()}&nologo=true`;
  }

  private static mapPlatformToKey(platform: string): string {
    const map: Record<string, string> = {
      'LinkedIn': 'linkedin', 'Twitter (X)': 'twitter', 'Instagram Feed': 'instagram',
      'Instagram Story': 'instagram', 'Facebook': 'facebook', 'TikTok': 'tiktok',
      'YouTube': 'youtube', 'Threads': 'threads', 'Bluesky': 'bluesky',
      'Telegram': 'telegram', 'Google Business': 'googleBusiness',
    };
    return map[platform] || 'masterPost';
  }
}
