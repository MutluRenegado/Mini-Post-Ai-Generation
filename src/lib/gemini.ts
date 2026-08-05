import { createGoogleGenerativeAI } from '@ai-sdk/google';

/**
 * Centralized production Gemini model identifier.
 * Standard expected value: "gemini-3.6-flash"
 */
export const GEMINI_TEXT_MODEL =
  process.env.GEMINI_TEXT_MODEL?.trim() || 'gemini-3.6-flash';

/**
 * Centralized API Key Resolver.
 * Checks server-side environment variables in priority order.
 */
export function getGeminiApiKey(): string {
  const key =
    process.env.GEMINI_SECRET_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    '';
  return key.trim();
}

/**
 * Single Authoritative Google Generative AI Provider Instance.
 * Validates API Key before making calls to avoid 403 unregistered caller failures.
 */
export const googleAI = createGoogleGenerativeAI({
  get apiKey() {
    const key = getGeminiApiKey();
    if (!key) {
      throw new Error(
        'GEMINI_API_KEY_MISSING: Gemini API key is missing from environment variables (GEMINI_SECRET_KEY / GOOGLE_GENERATIVE_AI_API_KEY / GEMINI_API_KEY / GOOGLE_API_KEY).'
      );
    }
    return key;
  },
});

/**
 * Primary server-side model instance for text & multi-platform generation.
 */
export const geminiModel = googleAI(GEMINI_TEXT_MODEL);
export const geminiProModel = googleAI(GEMINI_TEXT_MODEL);
