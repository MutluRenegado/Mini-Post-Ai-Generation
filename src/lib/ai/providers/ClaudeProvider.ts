import { AIProvider, AIProviderResponse, AIProviderType } from '../models/ai.types';

export class ClaudeProvider implements AIProvider {
  name: AIProviderType = 'claude';

  async generate(prompt: string, systemPrompt?: string, options?: { temperature?: number }): Promise<AIProviderResponse> {
    const start = Date.now();
    const latencyMs = Date.now() - start;
    return {
      text: '',
      provider: 'claude',
      model: 'claude-3-5-sonnet',
      latencyMs,
      estimatedTokens: Math.ceil(prompt.length / 4),
    };
  }

  async isHealthy(): Promise<boolean> {
    return false; // Standby until API key configured
  }
}
