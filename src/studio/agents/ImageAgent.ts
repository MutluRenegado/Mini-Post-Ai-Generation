import { BaseAgent, AgentContext } from './BaseAgent';
import { ImagePromptBuilder } from '@/lib/ai-image-generator/prompts/ImagePromptBuilder';
import { Logger } from '@/lib/ai-text-editor/logging/Logger';

export class ImageAgent extends BaseAgent {
  name = 'ImageAgent';
  description = 'Generates modern, colourful visual concepts and social-ready image prompts derived from final approved post text';

  async execute(context: AgentContext): Promise<any> {
    const start = Date.now();
    const platform = (context.platforms && context.platforms[0]) || 'LinkedIn';
    const finalText = (context as any).finalApprovedText || (context as any).content || context.topic;

    if (!finalText || !finalText.trim()) {
      throw new Error('IMAGE_PIPELINE_ERROR: ImageAgent requires non-empty final approved post text.');
    }

    Logger.info('ImageAgent', `Building visual summary & prompt from final approved text for platform: ${platform}`);

    const result = ImagePromptBuilder.buildFromFinalText(finalText, platform as any);

    Logger.info('ImageAgent', `Generated image prompt`, { lens: result.lens, camera: result.camera }, undefined, Date.now() - start);
    return result;
  }
}
