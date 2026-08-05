import { generateText } from 'ai';
import { geminiModel } from '@/lib/gemini';
import { executeWithCrashFallback } from '@/lib/crash-recovery';

export type TextActionType =
  | 'full_article'
  | 'multi_platform_adapt'
  | 'viral_hook'
  | 'summarize'
  | 'expand'
  | 'restyle'
  | 'auto_hashtags';

export interface TextEngineRequest {
  topic: string;
  action: TextActionType;
  currentText?: string;
  tone?: 'executive' | 'editorial' | 'viral' | 'academic';
  targetPlatforms?: string[];
}

export interface MultiPlatformAdaptations {
  masterPost: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  tiktok?: string;
  hashtags?: string[];
  viralHooks?: string[];
}

export interface TextEngineResult {
  success: boolean;
  providerUsed: 'gemini-ai-flash' | 'pollinations-text-ai' | 'rule-engine-v3' | 'fallback-v4';
  action: TextActionType;
  text: string;
  adaptations?: MultiPlatformAdaptations;
  hashtags?: string[];
  viralHooks?: string[];
  error?: string;
}

export class TextEngineService {
  /**
   * Main entry point via Gemini AI Flash engine
   */
  static async process(req: TextEngineRequest): Promise<TextEngineResult> {
    try {
      return await TextEngineService.runGeminiTier(req);
    } catch (err: any) {
      console.error('[TextEngineService] Generation error:', err);
      return {
        success: false,
        providerUsed: 'gemini-ai-flash',
        action: req.action,
        text: '',
        error: err?.message || 'Text generation engine encountered an error.',
      };
    }
  }

  /**
   * TIER 1: Primary Gemini AI Flash Engine
   */
  private static async runGeminiTier(req: TextEngineRequest): Promise<TextEngineResult> {
    const prompt = TextEngineService.buildPromptForAction(req);
    const { text } = await generateText({
      model: geminiModel,
      prompt,
      temperature: 0.7,
    });

    if (!text || text.trim().length === 0) {
      throw new Error('Gemini returned empty text response.');
    }

    const cleanText = text.trim();
    const adaptations = TextEngineService.extractAdaptationsFromText(cleanText, req.topic);

    return {
      success: true,
      providerUsed: 'gemini-ai-flash',
      action: req.action,
      text: cleanText,
      adaptations,
      hashtags: adaptations.hashtags,
      viralHooks: adaptations.viralHooks,
    };
  }

  /**
   * TIER 2: Pollinations Text AI Engine
   */
  private static async runPollinationsTier(req: TextEngineRequest): Promise<TextEngineResult> {
    const prompt = TextEngineService.buildPromptForAction(req);
    const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);

    if (!res.ok) {
      throw new Error(`Pollinations Text AI error ${res.status}`);
    }

    const rawText = await res.text();
    if (!rawText || rawText.trim().length === 0) {
      throw new Error('Pollinations returned empty response');
    }

    const cleanText = rawText.trim();
    const adaptations = TextEngineService.extractAdaptationsFromText(cleanText, req.topic);

    return {
      success: true,
      providerUsed: 'pollinations-text-ai',
      action: req.action,
      text: cleanText,
      adaptations,
      hashtags: adaptations.hashtags,
      viralHooks: adaptations.viralHooks,
    };
  }

  /**
   * TIER 3: Client-Side Rule-Based Format Engine (Zero Network Dependency)
   */
  private static runRuleBasedTier(req: TextEngineRequest): Promise<TextEngineResult> {
    const topic = req.topic || 'High Impact Executive Growth & AI Systems';
    const baseText = req.currentText || `Key strategic insights on ${topic}. Execution beats strategy when powered by scalable automated systems.`;

    let generatedText = '';
    const hashtags = ['#MiniPostApp', '#TechLeadership', '#ExecutiveStrategy', '#Automation', '#Innovation'];
    const viralHooks = [
      `😱 Stop scrolling! Here is the 1 framework for ${topic} you cannot ignore in 2026.`,
      `🚀 3 critical lessons we learned while scaling ${topic}.`,
      `💡 Why 90% of leaders fail at ${topic} (and how to fix it today).`,
    ];

    switch (req.action) {
      case 'summarize':
        generatedText = `📌 EXECUTIVE SUMMARY: ${topic}\n\n• Point 1: Systematic execution accelerates growth.\n• Point 2: Automated multi-channel distribution saves 15+ hours weekly.\n• Point 3: Data-driven decision making beats random effort.`;
        break;
      case 'viral_hook':
        generatedText = viralHooks.join('\n\n');
        break;
      case 'expand':
        generatedText = `🌌 [MINI POST APP EXECUTIVE INTEL] • DEEP DIVE: ${topic}\n\n${baseText}\n\nIn 2026, market leadership belongs to teams that turn single ideas into multi-channel distribution engines without sacrificing quality.\n\n✨ Strategic Takeaway: Build once, distribute everywhere.`;
        break;
      default:
        generatedText = `🌌 [MINI POST APP EXECUTIVE INTEL] • ${topic.toUpperCase()}\n\n${baseText}\n\nKey Principles:\n1. Precision over noise\n2. Sub-second distribution speed\n3. High-converting messaging across platforms\n\n✨ Save and share with your leadership network.`;
        break;
    }

    const adaptations: MultiPlatformAdaptations = {
      masterPost: generatedText,
      facebook: `🌌 [MINI POST APP EXECUTIVE INTEL]\n\n🚀 ${topic}\n\n${baseText}\n\n👉 Tag a founder scaling in public!\n\n${hashtags.join(' ')}`,
      instagram: `🌌 [MINI POST APP EXECUTIVE INTEL]\n\nTransforming ${topic} into multi-platform momentum ✨\n\nSwipe for full breakdown ➡️\n\n📌 Save this post!\n.\n.\n${hashtags.join(' ')}`,
      linkedin: `🌌 [MINI POST APP EXECUTIVE INTEL] • STRATEGY REPORT\n\nKey insights on ${topic}:\n\n${baseText}\n\nWhat tools do you rely on for execution?\n\n${hashtags.slice(0, 3).join(' ')}`,
      twitter: `⚡ ${topic}\n\n${baseText.slice(0, 180)}...\n\n#MiniPostApp #Automation`,
      tiktok: `[HOOK]: ${viralHooks[0]}\n\n[SCRIPT]: Here is how we scaled ${topic} using 1 master template.\n\n[CTA]: Comment link below! 🚀`,
      hashtags,
      viralHooks,
    };

    return Promise.resolve({
      success: true,
      providerUsed: 'rule-engine-v3',
      action: req.action,
      text: generatedText,
      adaptations,
      hashtags,
      viralHooks,
    });
  }

  /**
   * TIER 4: Ultimate Safe Fallback Tier
   */
  private static runSafeFallbackTier(req: TextEngineRequest): Promise<TextEngineResult> {
    const fallbackText = `🌌 [MINI POST APP INTEL] • ${req.topic || 'Executive Briefing'}\n\nHigh-impact post content generated via safe fallback state.`;
    return Promise.resolve({
      success: true,
      providerUsed: 'fallback-v4',
      action: req.action,
      text: fallbackText,
      adaptations: {
        masterPost: fallbackText,
        facebook: fallbackText,
        instagram: fallbackText,
        linkedin: fallbackText,
        twitter: fallbackText,
        tiktok: fallbackText,
      },
    });
  }

  /**
   * Helper to construct action-specific prompts
   */
  private static buildPromptForAction(req: TextEngineRequest): string {
    const topic = req.topic || 'Executive Tech Strategy';
    const text = req.currentText || '';

    switch (req.action) {
      case 'full_article':
        return `Write a comprehensive, professional, 500-word in-depth executive article about: "${topic}". Include key headings, actionable strategies, and high-impact takeaways.`;
      case 'multi_platform_adapt':
        return `Take this master concept: "${topic}". Generate a master post and tailored adaptations for Facebook, Instagram, LinkedIn, Twitter/X, and TikTok scripts. Include hashtags.`;
      case 'viral_hook':
        return `Generate 5 viral 3-second hook statements for video reels and TikToks about: "${topic}". Make them highly engaging and curiosity-inducing.`;
      case 'summarize':
        return `Condense the following text into 3 sharp, high-impact executive bullet points:\n\n"${text || topic}"`;
      case 'expand':
        return `Expand this short concept into a detailed, high-impact executive LinkedIn post with bullet points and takeaways:\n\n"${text || topic}"`;
      case 'restyle':
        return `Restyle the following content into an ultra-premium executive intel tone (${req.tone || 'executive'}):\n\n"${text || topic}"`;
      case 'auto_hashtags':
        return `Generate 15 trending, high-conversion hashtags and 3 call-to-action options for content about: "${topic}".`;
      default:
        return `Write a high-converting social media post about: "${topic}".`;
    }
  }

  /**
   * Helper to extract platform adaptations from generated text
   */
  private static extractAdaptationsFromText(rawText: string, topic: string): MultiPlatformAdaptations {
    const hashtags = Array.from(rawText.match(/#[A-Za-z0-9_]+/g) || ['#MiniPostApp', '#TechLeadership', '#Growth']);
    const viralHooks = [
      `😱 Stop scrolling! Here is the breakdown on ${topic.slice(0, 30)}.`,
      `🚀 3 lessons on ${topic.slice(0, 30)} you cannot ignore.`,
    ];

    return {
      masterPost: rawText,
      facebook: `🌌 [MINI POST APP]\n\n${rawText}\n\n${hashtags.join(' ')}`,
      instagram: `🌌 [MINI POST APP]\n\n${rawText}\n\nSwipe ➡️\n.\n.\n${hashtags.join(' ')}`,
      linkedin: `🌌 [MINI POST APP EXECUTIVE INTEL]\n\n${rawText}\n\n${hashtags.slice(0, 4).join(' ')}`,
      twitter: `${rawText.slice(0, 240)}...\n\n${hashtags.slice(0, 2).join(' ')}`,
      tiktok: `[HOOK]: ${viralHooks[0]}\n\n[SCRIPT]: ${rawText.slice(0, 150)}...\n\n[CTA]: Drop a comment below! 🚀`,
      hashtags,
      viralHooks,
    };
  }
}
