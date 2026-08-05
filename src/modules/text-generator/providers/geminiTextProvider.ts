export class GeminiTextProvider {
  public static async generateText(prompt: string): Promise<string> {
    if (!prompt) throw new Error('GEMINI_PROMPT_EMPTY');
    return `[Gemini Text Generated Output]: ${prompt.slice(0, 100)}...`;
  }
}
