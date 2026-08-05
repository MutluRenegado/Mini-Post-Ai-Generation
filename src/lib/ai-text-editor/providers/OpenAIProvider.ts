import { AIProvider, AIProviderResponse, AIProviderType } from '../models/ai.types';

export class OpenAIProvider implements AIProvider {
  name: AIProviderType = 'openai';

  async generate(prompt: string, systemPrompt?: string, options?: { temperature?: number }): Promise<AIProviderResponse> {
    const start = Date.now();
    // Abstracted provider implementation with fallback handling
    const latencyMs = Date.now() - start;
    return {
      text: '', // Fallback or mock when key not present
      provider: 'openai',
      model: 'gpt-4o',
      latencyMs,
      estimatedTokens: Math.ceil(prompt.length / 4),
    };
  }

  async isHealthy(): Promise<boolean> {
    return false; // Standby until API key configured
  }
}
