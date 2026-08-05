import { AIProvider, AIProviderType, ProviderRoutingStrategy, AIProviderResponse } from '../models/ai.types';
import { GeminiProvider } from './GeminiProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { ClaudeProvider } from './ClaudeProvider';
import { ProviderHealthMonitor } from './ProviderHealthMonitor';

export class AIProviderRouter {
  private static providers: Map<AIProviderType, AIProvider> = new Map();

  static registerProvider(provider: AIProvider): void {
    this.providers.set(provider.name, provider);
  }

  static getProvider(strategy: ProviderRoutingStrategy = 'quality', preferred?: AIProviderType): AIProvider {
    if (preferred && this.providers.has(preferred) && ProviderHealthMonitor.isProviderHealthy(preferred)) {
      return this.providers.get(preferred)!;
    }

    // Default & primary active provider is Gemini 2.5 Flash
    return this.providers.get('gemini') || new GeminiProvider();
  }

  static async routeAndGenerate(
    prompt: string,
    systemPrompt?: string,
    strategy: ProviderRoutingStrategy = 'quality',
    preferred?: AIProviderType
  ): Promise<AIProviderResponse> {
    const provider = this.getProvider(strategy, preferred);
    return await provider.generate(prompt, systemPrompt);
  }
}
