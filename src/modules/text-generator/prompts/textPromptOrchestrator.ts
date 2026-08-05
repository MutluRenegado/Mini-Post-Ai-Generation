import { MasterTextPromptBuilder } from './masterTextPromptBuilder';
import { PlatformTextPromptBuilder } from './platformTextPromptBuilder';
import { TextAIProviderRouter } from '../providers/textAIProviderRouter';

export class TextPromptOrchestrator {
  public static async orchestrate(topic: string, platform = 'LinkedIn'): Promise<{ masterPost: string; adaptedCaption: string }> {
    const masterPrompt = MasterTextPromptBuilder.buildMasterPrompt(topic);
    const masterPost = await TextAIProviderRouter.generateText(masterPrompt);

    const platformPrompt = PlatformTextPromptBuilder.buildPlatformPrompt(masterPost, platform);
    const adaptedCaption = await TextAIProviderRouter.generateText(platformPrompt);

    return { masterPost, adaptedCaption };
  }
}
