import { AIContext, ImagePrompt, StudioPlatform } from '../models/ai.types';

/**
 * ImagePromptBuilder — Text Editor stub for generating prompt data structures without tight coupling to image pipeline.
 */
export class ImagePromptBuilder {
  static buildFromFinalText(finalText: string, platform: StudioPlatform, postType?: string): ImagePrompt {
    const topic = finalText.slice(0, 80).trim() || 'Modern business topic';
    return {
      platform,
      subject: topic,
      environment: 'Modern studio office environment',
      composition: 'Rule of thirds centered framing',
      lighting: 'Soft diffused natural daylight',
      camera: 'Sony A7R V with 35mm lens',
      lens: '35mm prime lens',
      mood: 'Clean, professional, confident',
      colorPalette: 'Daylight neutral blue and slate',
      style: 'modern-editorial',
      qualityTags: ['ultra-detailed', '8K resolution', 'photorealistic', 'sharp focus'],
      negativePrompt: 'blurry, dark, low quality, malformed',
      assembled: `High quality commercial visual representing ${topic} for ${platform}`,
    };
  }

  static build(context: AIContext, platform: StudioPlatform, finalText?: string): ImagePrompt {
    const textToUse = finalText || (context.request as any)?.content || (context.blueprint as any)?.finalApprovedText;
    if (textToUse && textToUse.trim()) {
      return this.buildFromFinalText(textToUse, platform, context.topicProfile?.contentType);
    }
    return this.buildFromFinalText(context.topicProfile?.mainTopic || context.request.topic, platform, context.topicProfile?.contentType);
  }
}
