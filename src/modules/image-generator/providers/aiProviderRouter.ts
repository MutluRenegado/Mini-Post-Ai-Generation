import { MasterImagePrompt } from '../types/master-image-prompt.types';
import { AIImageProviderRequest, AIImageProviderResponse } from '../types/ai-provider-adapter.types';
import { AIProviderAdapter } from './aiProviderAdapter';

export class AIProviderRouter {
  public static async generate(prompt: MasterImagePrompt, options?: Partial<AIImageProviderRequest>): Promise<AIImageProviderResponse> {
    if (!prompt.providerReady) {
      throw new Error('PROVIDER_NOT_READY: MasterImagePrompt must be validated and repaired before passing to provider router.');
    }

    return await AIProviderAdapter.executeGeneration(prompt, options);
  }
}
