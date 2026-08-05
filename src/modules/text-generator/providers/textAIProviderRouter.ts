import { GeminiTextProvider } from './geminiTextProvider';

export class TextAIProviderRouter {
  public static async generateText(promptText: string, modelPreference = 'gemini-1.5-flash'): Promise<string> {
    return await GeminiTextProvider.generateText(promptText);
  }
}
