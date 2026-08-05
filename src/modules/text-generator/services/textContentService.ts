import { TextGenerationRequest, TextGenerationResponse } from '../types/text-generator.types';
import { TextPromptOrchestrator } from '../prompts/textPromptOrchestrator';

export class TextContentService {
  public static async generate(request: TextGenerationRequest): Promise<TextGenerationResponse> {
    const platform = request.platform || 'LinkedIn';
    const { masterPost, adaptedCaption } = await TextPromptOrchestrator.orchestrate(request.topic, platform);

    return {
      masterPost,
      platformOutputs: [
        {
          platform,
          caption: adaptedCaption,
          hashtags: ['#Innovation', '#BusinessGrowth', '#Tech'],
          callToAction: 'Share your thoughts in the comments below!',
        },
      ],
      seoTitle: `${request.topic} - Mini Post Guide`,
      seoMetaDescription: masterPost.slice(0, 150),
      generatedAt: new Date().toISOString(),
    };
  }
}
