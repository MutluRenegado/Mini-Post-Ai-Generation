import { AIProvider, AIProviderResponse, AIProviderType } from '../models/ai.types';
import { generateText } from 'ai';
import { geminiModel, GEMINI_TEXT_MODEL, getGeminiApiKey } from '@/lib/gemini';

export class GeminiProvider implements AIProvider {
  name: AIProviderType = 'gemini';

  constructor(private callFn?: (prompt: string, systemPrompt?: string) => Promise<string>) {}

  async generate(
    prompt: string,
    systemPrompt?: string,
    options?: { temperature?: number }
  ): Promise<AIProviderResponse> {
    const start = Date.now();
    let text = '';

    if (this.callFn) {
      text = await this.callFn(prompt, systemPrompt);
    } else {
      const apiKey = getGeminiApiKey();
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY_MISSING: Gemini API key is not configured in server environment.');
      }

      const response = await generateText({
        model: geminiModel,
        ...(systemPrompt ? { system: systemPrompt } : {}),
        prompt,
        temperature: options?.temperature ?? 0.7,
      });

      text = response.text;
    }

    if (!text || !text.trim()) {
      throw new Error('EMPTY_PROVIDER_RESPONSE: Gemini returned an empty response.');
    }

    const latencyMs = Date.now() - start;
    return {
      text: text.trim(),
      provider: 'gemini',
      model: GEMINI_TEXT_MODEL,
      latencyMs,
      estimatedTokens: Math.ceil((prompt.length + text.length) / 4),
    };
  }

  async isHealthy(): Promise<boolean> {
    const apiKey = getGeminiApiKey();
    return Boolean(apiKey && apiKey.trim().length > 0);
  }
}
