import { NextResponse } from "next/server";
import { generateText } from "ai";
import { geminiModel } from "@/lib/gemini";
import { PromptOrchestrator } from "@/lib/ai-text-editor/orchestrator/PromptOrchestrator";
import { StudioRequest, StudioPlatform, StudioGoal, StudioTone } from "@/lib/ai-text-editor/models/ai.types";
import { OutputValidator } from "@/lib/ai-text-editor/validation/OutputValidator";

// ── Gemini caller (injected into orchestrator) ────────────────────────────────

async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  const { text } = await generateText({
    model: geminiModel,
    ...(systemPrompt ? { system: systemPrompt } : {}),
    prompt,
    temperature: 0.75,
  });
  if (!text || !text.trim()) {
    throw new Error('EMPTY_PROVIDER_RESPONSE: Gemini returned empty output.');
  }
  return text;
}

// ── Platform name normalizer ──────────────────────────────────────────────────

function normalizePlatform(p: string): StudioPlatform {
  const map: Record<string, StudioPlatform> = {
    'linkedin': 'LinkedIn',
    'twitter': 'Twitter (X)',
    'twitter (x)': 'Twitter (X)',
    'x': 'Twitter (X)',
    'instagram': 'Instagram Feed',
    'instagram feed': 'Instagram Feed',
    'instagram story': 'Instagram Story',
    'facebook': 'Facebook',
    'tiktok': 'TikTok',
    'youtube': 'YouTube',
    'threads': 'Threads',
    'bluesky': 'Bluesky',
    'telegram': 'Telegram',
    'google business': 'Google Business',
    'google_business': 'Google Business',
    'pinterest': 'Pinterest',
  };
  return map[p.toLowerCase()] || 'LinkedIn';
}

function normalizeGoal(g: string): StudioGoal {
  const valid: StudioGoal[] = ['Brand Awareness', 'Promote Product', 'Promote Service', 'Blog Article', 'Educational', 'Event', 'Announcement', 'Discount', 'Testimonial', 'Quote', 'Thought Leadership'];
  return valid.find((v) => v.toLowerCase() === g.toLowerCase()) || 'Brand Awareness';
}

function normalizeTone(t: string): StudioTone {
  const valid: StudioTone[] = ['Professional', 'Friendly', 'Corporate', 'Luxury', 'Casual', 'Educational', 'Funny', 'Bold', 'Inspirational', 'Technical', 'Minimal'];
  return valid.find((v) => v.toLowerCase() === t.toLowerCase()) || 'Professional';
}

// ── API Route ─────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      style,
      currentText,
      platforms: rawPlatforms,
      goal: rawGoal,
      audience: rawAudience,
      tone: rawTone,
      cta,
      brandName,
      industry,
      keywords,
    } = body;

    // Build a StudioRequest from whatever the caller provides
    const topic = currentText || title || 'Social media content strategy for modern businesses';
    const platforms: StudioPlatform[] = rawPlatforms && rawPlatforms.length > 0
      ? rawPlatforms.map(normalizePlatform)
      : ['LinkedIn', 'Twitter (X)', 'Instagram Feed', 'Facebook', 'TikTok', 'Threads'];

    const studioRequest: StudioRequest = {
      topic,
      goal: normalizeGoal(rawGoal || 'Brand Awareness'),
      audience: rawAudience || 'Professional business leaders and entrepreneurs',
      tone: normalizeTone(rawTone || style || 'Professional'),
      platforms,
      cta: cta || undefined,
      brandName: brandName || undefined,
      industry: industry || undefined,
      keywords: keywords || [],
    };

    // Run full orchestration pipeline
    const result = await PromptOrchestrator.orchestrate(studioRequest, callGemini);

    if (!result.success || !result.output) {
      return NextResponse.json({ success: false, error: result.error || 'Generation failed' }, { status: 500 });
    }

    // Map StudioOutput → legacy result shape expected by ai-content.service.ts
    // This ensures backward compatibility without breaking existing UI components
    const output = result.output;
    const byPlatform = (key: string) =>
      output.platforms.find((p) => p.platform.toLowerCase().includes(key.toLowerCase()))?.body || '';

    const globalHashtags = output.platforms[0]?.hashtags || [];
    const primaryImagePrompt = output.platforms[0]?.imagePrompt?.assembled || '';

    const legacyResult = {
      masterPost: byPlatform('linkedin') || output.platforms[0]?.body || '',
      linkedin: OutputValidator.clampText(byPlatform('linkedin'), 3000),
      twitter: OutputValidator.clampText(byPlatform('twitter'), 280),
      instagram: OutputValidator.clampText(byPlatform('instagram'), 2000),
      facebook: OutputValidator.clampText(byPlatform('facebook'), 2000),
      tiktok: OutputValidator.clampText(byPlatform('tiktok'), 600),
      threads: OutputValidator.clampText(byPlatform('threads'), 500),
      youtube: OutputValidator.clampText(byPlatform('youtube'), 5000),
      telegram: OutputValidator.clampText(byPlatform('telegram'), 4096),
      bluesky: OutputValidator.clampText(byPlatform('bluesky'), 300),
      googleBusiness: OutputValidator.clampText(byPlatform('google'), 1500),
      hashtags: globalHashtags,
      imagePrompt: primaryImagePrompt,
      // Expose full structured output for consumers that want it
      _studioOutput: output,
    };

    return NextResponse.json({ success: true, result: legacyResult });

  } catch (error: any) {
    console.error('[fast-post route] Error:', error);
    return NextResponse.json(
      { success: false, error: 'AI pipeline error. Please try again.' },
      { status: 500 }
    );
  }
}