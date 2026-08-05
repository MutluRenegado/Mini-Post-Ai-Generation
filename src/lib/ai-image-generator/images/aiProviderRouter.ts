import { AIImageGenerationRequest, AIImageGenerationResponse } from './ai-provider-adapter.types';
import { AIProviderAdapter } from './aiProviderAdapter';

export class AIProviderRouter {
  private static supportedProviders = ['pollinations_ai', 'gemini_imagen', 'flux_ai'];

  /**
   * Routes AI image generation request to active provider with automatic fallback capability.
   */
  public static async generate(request: AIImageGenerationRequest): Promise<AIImageGenerationResponse> {
    if (!request || !request.prompt) {
      throw new Error('INVALID_ROUTER_REQUEST: AIImageGenerationRequest is required.');
    }

    const preferredProvider = request.providerPreference || 'pollinations_ai';
    const providersToTry = [preferredProvider, ...this.supportedProviders.filter((p) => p !== preferredProvider)];

    let lastError: any = null;

    for (const provider of providersToTry) {
      try {
        const reqWithProvider: AIImageGenerationRequest = {
          ...request,
          providerPreference: provider,
        };
        return await AIProviderAdapter.executeGeneration(reqWithProvider);
      } catch (err: any) {
        lastError = err;
        // Continue to fallback provider
      }
    }

    throw lastError || new Error('ALL_AI_PROVIDERS_FAILED: Failed to generate image across all AI providers.');
  }
}
