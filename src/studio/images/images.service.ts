import { ContentSummarizer } from '@/lib/ai-image-generator/images/ContentSummarizer';
import { PostVisualBriefExtractor } from '@/lib/ai-image-generator/images/PostVisualBriefExtractor';
import { ImagePromptBuilder } from '@/lib/ai-image-generator/images/ImagePromptBuilder';

export class ImageEngineService {
  /**
   * Generates a photorealistic, modern editorial image prompt derived strictly from the final approved post content.
   */
  static async generateImagePrompt(finalText: string, style: string = 'colourful-professional'): Promise<string> {
    if (!finalText || !finalText.trim()) {
      throw new Error('IMAGE_PIPELINE_ERROR: ImageEngineService requires non-empty final approved post text.');
    }

    const summary = ContentSummarizer.summarize({
      finalText,
      textStatus: 'approved',
      platform: 'LinkedIn',
    });

    const brief = PostVisualBriefExtractor.extractFromSummary(summary, {
      platform: 'LinkedIn',
      visualStyle: style,
      postContent: finalText,
    });

    return ImagePromptBuilder.buildPromptFromBrief(brief);
  }

  static getSampleImages() {
    return [
      { id: 'img_1', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop', title: 'Modern Editorial Daylight' },
      { id: 'img_2', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop', title: 'Colourful Professional Workspace' },
      { id: 'img_3', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop', title: 'Vibrant Strategy Leadership' },
    ];
  }
}
