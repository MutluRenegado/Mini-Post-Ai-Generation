import { AIContext, ImagePrompt, StudioPlatform } from '../models/ai.types';
import { PostVisualBriefExtractor } from '../images/PostVisualBriefExtractor';
import { ImagePromptBuilder as CanonicalPromptBuilder } from '../images/ImagePromptBuilder';
import { ContentSummarizer } from '../images/ContentSummarizer';
import { VisualRelevanceAnalyzer } from '../images/VisualRelevanceAnalyzer';
import { PostVisualBrief } from '../images/image.types';

/**
 * ImagePromptBuilder — Generates image prompts EXCLUSIVELY from final approved post text & visual brief via VisualRelevanceAnalyzer.
 */
export class ImagePromptBuilder {
  static buildFromFinalText(finalText: string, platform: StudioPlatform, postType?: string): ImagePrompt {
    if (!finalText || !finalText.trim()) {
      throw new Error('IMAGE_PIPELINE_ERROR: ImagePromptBuilder requires non-empty final approved post text.');
    }

    const summary = ContentSummarizer.summarize({
      finalText,
      textStatus: 'approved',
      platform,
      postType,
    });

    const intent = VisualRelevanceAnalyzer.analyze({
      finalText,
      textStatus: 'approved',
      visualSummary: summary,
      platform,
      postType,
    });

    const brief: PostVisualBrief = PostVisualBriefExtractor.extractFromIntent(intent, summary, {
      platform,
      postType: postType || 'Feed Post',
      postContent: finalText,
    });

    const assembled = CanonicalPromptBuilder.buildFromIntent(intent, brief);

    return {
      platform,
      subject: brief.mainSubject,
      environment: brief.environment,
      composition: brief.composition,
      lighting: brief.lighting,
      camera: brief.cameraAngle || 'Sony A7R V with 35mm lens',
      lens: brief.framing || '35mm prime lens',
      mood: brief.visualMood,
      colorPalette: brief.colorDirection,
      style: brief.visualStyle as string,
      qualityTags: ['ultra-detailed', '8K resolution', 'photorealistic', 'sharp focus'],
      negativePrompt: brief.negativeConstraints.join(', '),
      assembled,
    };
  }

  /**
   * Builds an image prompt using the final approved post content from context.
   */
  static build(context: AIContext, platform: StudioPlatform, finalText?: string): ImagePrompt {
    const textToUse = finalText || (context.request as any).content || (context.blueprint as any)?.finalApprovedText;
    if (textToUse && textToUse.trim()) {
      return this.buildFromFinalText(textToUse, platform, context.topicProfile?.contentType);
    }
    return this.buildFromFinalText(context.topicProfile?.mainTopic || context.request.topic, platform, context.topicProfile?.contentType);
  }
}
