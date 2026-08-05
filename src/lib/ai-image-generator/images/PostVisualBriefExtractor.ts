import {
  ContentVisualSummary,
  ImageRecreationRequest,
  PostVisualBrief,
  VisualIntent,
  VisualShareabilityProfile,
} from './image.types';
import { ContentSummarizer } from './ContentSummarizer';
import { VisualRelevanceAnalyzer } from './VisualRelevanceAnalyzer';
import { BrandManagerService } from '@/studio/brand/brand.service';
import { ImageGenerationProvider } from './ImageGenerationProvider';
import { ColorIntelligence } from './ColorIntelligence';
import { VisualDiversityTracker } from './VisualDiversityTracker';

export class PostVisualBriefExtractor {
  /**
   * Extracts a structured PostVisualBrief derived strictly from final approved post text
   * via ContentSummarizer -> VisualRelevanceAnalyzer -> VisualIntent.
   */
  static extract(request: ImageRecreationRequest): PostVisualBrief {
    const fullContent = (request.postContent || '').trim();
    const topic = (request.postTopic || request.postTitle || '').trim();

    if (!fullContent && !topic) {
      throw new Error('IMAGE_PIPELINE_ERROR: PostVisualBriefExtractor requires final approved post content (postContent).');
    }

    const textToSummarize = fullContent || topic;
    const summary = ContentSummarizer.summarize({
      finalText: textToSummarize,
      textStatus: 'approved',
      platform: request.platform,
      postType: request.postType,
    });

    const intent = VisualRelevanceAnalyzer.analyze({
      finalText: textToSummarize,
      textStatus: 'approved',
      visualSummary: summary,
      platform: request.platform || 'LinkedIn',
      postType: request.postType,
    });

    return this.extractFromIntent(intent, summary, request);
  }

  /**
   * Directly constructs a PostVisualBrief from a pre-computed ContentVisualSummary.
   */
  static extractFromSummary(
    summary: ContentVisualSummary,
    request: Partial<ImageRecreationRequest>
  ): PostVisualBrief {
    const text = request.postContent || summary.coreMessage;
    const intent = VisualRelevanceAnalyzer.analyze({
      finalText: text,
      textStatus: 'approved',
      visualSummary: summary,
      platform: request.platform || 'LinkedIn',
      postType: request.postType,
    });

    return this.extractFromIntent(intent, summary, request);
  }

  /**
   * Primary entry point: converts a canonical VisualIntent model into a PostVisualBrief.
   * Does NOT independently invent visual scenes.
   */
  static extractFromIntent(
    intent: VisualIntent,
    summary?: ContentVisualSummary,
    request?: Partial<ImageRecreationRequest>
  ): PostVisualBrief {
    const req = request || {};
    const platform = req.platform || 'LinkedIn';
    const postType = req.postType || 'Feed Post';
    const aspectRatio = req.aspectRatio || (this.isVerticalPlatform(platform) ? '9:16' : '1:1');
    const { width, height } = ImageGenerationProvider.getDimensionsFromAspectRatio(aspectRatio);

    // Fetch active brand kit profile if available
    let brandColors = ['#08C9FF', '#FFB020', '#FFFFFF'];
    let brandTone = intent.mood || 'Modern Editorial';
    try {
      const brand = BrandManagerService.getActiveBrandProfile();
      if (brand) {
        if (brand.primaryColor) brandColors[0] = brand.primaryColor;
        if (brand.accentColor) brandColors[1] = brand.accentColor;
        if (brand.defaultTone) brandTone = brand.defaultTone;
      }
    } catch (_) {
      // Fallback in headless environment
    }

    const colorInfo = ColorIntelligence.getColorDirection(intent.primarySubject, platform, brandColors);

    let visualStyle: string = req.visualStyle || intent.visualFormat || 'colourful-professional';
    if (visualStyle === 'Cinematic Modern Render' || visualStyle === 'Cinematic Modern Editorial Render') {
      visualStyle = 'colourful-professional';
    }

    const shareabilityProfile: VisualShareabilityProfile = {
      attentionStrength: 94,
      clarity: 96,
      colourEnergy: 90,
      subjectProminence: 95,
      mobileReadability: 93,
      platformSuitability: 97,
      brandRecognition: 88,
      emotionalAppeal: 91,
    };

    const prohibitedList = Array.from(new Set([...(intent.prohibitedElements || []), ...(intent.excludedObjects || [])]));

    return {
      postId: req.postId,
      platform,
      postType,

      primaryTopic: intent.primarySubject,
      centralMessage: intent.visualNarrative.slice(0, 160),
      communicationGoal: `Communicate visual narrative: ${intent.visualNarrative.slice(0, 80)}`,
      readerIntent: `Instant visual comprehension of ${intent.primarySubject}`,
      targetAudience: summary?.audience || 'Professional decision makers and modern creators',

      mainSubject: intent.primarySubject,
      supportingSubjects: intent.secondarySubjects,
      environment: intent.environment,
      actionOrSituation: intent.sceneDescription,
      visualStory: intent.visualNarrative,

      emotionalTone: brandTone,
      visualMood: intent.mood,
      visualStyle,

      keyObjects: intent.keyObjects,
      keyConcepts: intent.visualPriorities,
      prohibitedObjects: prohibitedList,

      composition: intent.composition,
      cameraAngle: intent.cameraAngle,
      framing: intent.composition,
      lighting: intent.lighting,
      colorDirection: colorInfo.colorDirection,
      shareabilityProfile,

      templateId: req.templateId,
      brandKitId: req.brandKitId || 'brand_default',
      brandColors,
      brandTone,

      width,
      height,
      aspectRatio,

      textInImagePolicy: 'none',
      negativeConstraints: prohibitedList.map((item) => (item.startsWith('no ') ? item : `no ${item}`)),
    };
  }

  private static isVerticalPlatform(platform: string): boolean {
    const p = platform.toLowerCase();
    return p.includes('story') || p.includes('tiktok') || p.includes('reel') || p.includes('shorts');
  }
}
