'use server';

import { generateText } from 'ai';
import { geminiModel, GEMINI_TEXT_MODEL, getGeminiApiKey } from '@/lib/gemini';
import { PlatformAdaptations } from '@/modules/posts/types/post.types';
import { checkAndEnforceDailyQuota, SubscriptionTier } from '@/modules/billing/services/quota.service';

export type AIModelChoice = 'gemini';

export interface GenerateMultiPlatformResult {
  success: boolean;
  data?: PlatformAdaptations;
  providerUsed?: 'gemini';
  quotaRemaining?: number;
  error?: string;
}

const SYSTEM_PROMPT = `You are an elite social media content strategist, executive editor, and multi-platform copywriter. Your task is to process the user's core topic and adapt it into platform-specific posts according to the EXACT structured character limits defined below.

### OFFICIAL PLATFORM CHARACTER LIMIT MATRIX:
1. Facebook:
   - Normal Standard Article: 1,000 – 2,000 characters (3 to 5 structured paragraphs with headings).
   - Shortened / Summary: 250 – 400 characters (Quick punchy takeaway).
   - Lengthened Version: 3,000 – 5,000 characters (Deep-dive community post).

2. Instagram:
   - Normal Standard Creation: 800 – 1,500 characters (Engaging story arc + hashtag block max 30 tags).
   - Shortened / Summary: 150 – 300 characters (Short caption hook).
   - Lengthened Version: Up to 2,000 characters max limit (Rich narrative content).

3. LinkedIn:
   - Normal Standard Creation: 1,500 – 3,000 characters (Professional thought leadership article/post).
   - Shortened / Summary: 300 – 500 characters (Brief industry insight update).
   - Lengthened Version: Up to 3,000 characters max limit (Dense analytical sections).

4. X (Twitter):
   - Normal Standard Creation: EXACTLY or UNDER 280 characters (Standard free account limit).
   - Shortened / Summary: 100 – 140 characters (Micro-summary or punchy hook).
   - Lengthened Version: Thread format (Multiple connected 280-character posts, e.g. 1/3, 2/3, 3/3).

5. TikTok:
   - Normal Standard Creation: 300 – 600 characters (Engaging video description + tags).
   - Shortened / Summary: 100 – 150 characters (One-liner hook).
   - Lengthened Version: Up to 2,100 characters max limit (Detailed context story).

### OUTPUT CONSTRAINT:
- You MUST enforce these character boundaries strictly.
- Return ONLY a valid JSON object matching the schema below. Do NOT include markdown backticks (\`\`\`json).

### JSON OUTPUT SCHEMA:
{
  "master_post": "Full long-form article (Title + 3-5 structured paragraphs)...",
  "facebook": "Facebook post matching 1,000 - 2,000 characters (3-5 structured paragraphs)...",
  "instagram": "Instagram caption matching 800 - 1,500 characters (Engaging story arc + hashtag block)...",
  "linkedin": "LinkedIn post matching 1,500 - 3,000 characters (Professional thought leadership article)...",
  "twitter": "X/Twitter post strictly under 280 characters...",
  "threads": "Threads post strictly under 500 characters...",
  "tiktok": "TikTok video description matching 300 - 600 characters + tags..."
}`;

function clampText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}

async function attemptGeminiSinglePromptGeneration(prompt: string, requestId?: string): Promise<PlatformAdaptations> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING: Gemini API key is missing from environment variables.');
  }

  const reqId = requestId || `req_text_${Date.now()}`;
  const startTime = Date.now();

  // 60-second isolated timeout for Gemini text generation
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    const elapsed = Date.now() - startTime;
    console.warn(`[attemptGeminiSinglePromptGeneration] [${reqId}] Operation aborted after ${elapsed}ms: Gemini text generation exceeded 60s timeout.`);
    abortController.abort(new Error('GEMINI_TEXT_GEN_TIMEOUT: Gemini model generation exceeded 60s limit.'));
  }, 60_000);

  try {
    console.log(`[attemptGeminiSinglePromptGeneration] [${reqId}] Operation started for topic: "${prompt.slice(0, 40)}"`);

    const { text } = await generateText({
      model: geminiModel,
      system: SYSTEM_PROMPT,
      prompt: `### Input Core Topic:\n"${prompt}"`,
      temperature: 0.7,
      abortSignal: abortController.signal,
    });

    const elapsed = Date.now() - startTime;
    console.log(`[attemptGeminiSinglePromptGeneration] [${reqId}] Operation completed successfully in ${elapsed}ms`);

    const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    const parsed = JSON.parse(cleaned) as PlatformAdaptations;

    // Apply hard limits per PDF matrix to prevent any accidental prompt overflow
    if (parsed.facebook) parsed.facebook = clampText(parsed.facebook, 2000);
    if (parsed.instagram) parsed.instagram = clampText(parsed.instagram, 1500);
    if (parsed.linkedin) parsed.linkedin = clampText(parsed.linkedin, 3000);
    if (parsed.twitter) parsed.twitter = clampText(parsed.twitter, 280);
    if (parsed.tiktok) parsed.tiktok = clampText(parsed.tiktok, 600);
    if (parsed.threads) parsed.threads = clampText(parsed.threads, 500);

    return parsed;
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    if (err?.name === 'AbortError' || abortController.signal.aborted) {
      console.error(`[attemptGeminiSinglePromptGeneration] [${reqId}] Operation aborted at stage "text_generation" after ${elapsed}ms`, {
        requestId: reqId,
        abortReason: abortController.signal.reason || err?.message || 'Timeout exceeded',
        stackTrace: err?.stack,
      });
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function generateMultiPlatformPostsAction(
  masterText: string,
  userId: string = 'guest-user',
  userTier: SubscriptionTier = 'starter',
  requestId?: string
): Promise<GenerateMultiPlatformResult> {
  try {
    if (!masterText || masterText.trim().length < 3) {
      return { success: false, error: 'Please enter valid content.' };
    }

    const quotaCheck = await checkAndEnforceDailyQuota(userId, userTier);
    if (!quotaCheck.allowed) {
      return {
        success: false,
        error: quotaCheck.error || 'Daily generation quota exceeded.',
      };
    }

    const trimmedInput = masterText.trim();

    try {
      const data = await attemptGeminiSinglePromptGeneration(trimmedInput, requestId);
      return {
        success: true,
        data,
        providerUsed: 'gemini',
        quotaRemaining: quotaCheck.remaining,
      };
    } catch (geminiError: any) {
      console.error('[generateMultiPlatformPostsAction] Gemini API execution failed:', geminiError);
      return {
        success: false,
        error: geminiError?.message || 'Gemini API execution failed.',
      };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate multi-platform posts.';
    console.error('[generateMultiPlatformPostsAction] Exception:', error);
    return {
      success: false,
      error: errorMsg,
    };
  }
}