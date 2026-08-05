import { AIContext, KnowledgeBase, ContentBlueprint, ContentReasoning, StudioPlatform } from '../models/ai.types';
import { ContentStrategy } from '../strategy/ContentStrategyEngine';

/**
 * MasterPromptBuilder v2.0 — Knowledge-Driven Prompt Generation.
 *
 * Consumes KnowledgeBase, ContentBlueprint, and ContentReasoning to construct
 * a deep, domain-expert prompt for Gemini.
 */
export class MasterPromptBuilder {
  static build(
    context: AIContext,
    strategy: ContentStrategy,
    kb: KnowledgeBase,
    blueprint: ContentBlueprint,
    reasoning: ContentReasoning
  ): string {
    const { request, topicProfile, audienceProfile, toneConfig } = context;
    const platforms = request.platforms;

    const knowledgeSummary = this.buildKnowledgeBlock(kb);
    const reasoningBlock = this.buildReasoningBlock(reasoning);
    const platformInstructions = this.buildPlatformBlueprints(blueprint, context);

    return `You are a recognized subject-matter expert, senior editor, and platform specialist in ${topicProfile.industry}.

${reasoningBlock}

═══ DOMAIN KNOWLEDGE BASE ═══
TOPIC: ${topicProfile.mainTopic}
DEFINITION: ${kb.definitions.expanded}
KEY BENEFIT: ${kb.benefits[0]?.headline} — ${kb.benefits[0]?.description}
CORE PROBLEM: ${kb.problems[0]?.problem} → ${kb.problems[0]?.solution}
KEY STATISTIC: "${kb.statistics[0]?.claim || ''}" (${kb.statistics[0]?.source || ''})
BEST PRACTICES:
${kb.bestPractices.map(b => `• ${b}`).join('\n')}
COMMON MISTAKES TO HIGHLIGHT:
${kb.commonMistakes.map(m => `• ${m}`).join('\n')}
MISCONCEPTIONS TO DEBUNK:
${kb.misconceptions.map(m => `• ${m}`).join('\n')}
ACTIONABLE TAKEAWAYS:
${kb.actionableInsights.map(a => `• ${a}`).join('\n')}
═════════════════════════════

═══ AUDIENCE & VOICE SPECIFICATION ═══
TARGET READER: ${audienceProfile.segment}
PAIN POINTS: ${audienceProfile.painPoints.join(', ')}
MOTIVATIONS: ${audienceProfile.motivations.join(', ')}
VOCABULARY LEVEL: ${audienceProfile.vocabularyLevel}
TONE: ${toneConfig.tone} (${toneConfig.vocabularyStyle})
POWER WORDS TO WEAVE IN: ${toneConfig.powerWords.slice(0, 5).join(', ')}
WORDS TO NEVER USE: ${toneConfig.forbiddenWords.join(', ')}
PREFERRED CTA: ${audienceProfile.preferredCTA}
══════════════════════════════════════

${platformInstructions}

ABSOLUTE CONTENT STANDARDS & CONSTRAINTS:
1. Return ONLY valid JSON matching the exact schema below. No markdown wrappers outside JSON. No \`\`\`json block syntax.
2. NEVER output developer metadata or internal labels such as "Goal:", "Audience:", "Platform:", "Tone:", "Topic:", "Master Topic:", "Strategic Insight:", or "Executive Intel:".
3. Write as an authentic, seasoned industry practitioner — NEVER sound like an AI assistant or a generic prompt template.
4. Each platform field MUST contain independent, complete, publication-ready text specifically tailored to that platform's culture and character limits.
5. Do NOT copy-paste content across platforms. Every platform must have a distinct angle and structure.
6. Opening hooks MUST immediately grab attention (data point, provocative question, or bold industry claim).
7. Ensure all imagePrompt values are detailed photographic/cinematic instructions for AI image generators — NEVER summaries of the topic.

JSON OUTPUT SCHEMA:
{
  "masterPost": "Comprehensive long-form anchor content (400-700 words) defining the core strategy, insights, and actionable steps.",
  "linkedin": "LinkedIn post text (1500-2800 chars). High authority, clean line breaks, discussion question at end.",
  "twitter": "X/Twitter tweet (STRICTLY under 280 chars). Ultra-sharp hook + core takeaway + 1-2 hashtags.",
  "instagram": "Instagram caption (800-1800 chars). Story-driven, engaging tone + hashtag block at end.",
  "facebook": "Facebook post (600-1500 chars). Community discussion format with an open question.",
  "tiktok": "TikTok video script/caption (300-600 chars). First 3-second hook + snappy breakdown.",
  "threads": "Threads post (under 500 chars). Sharp opinion or hot take.",
  "youtube": "YouTube video description (400-1500 chars). Chapter overview + key takeaways.",
  "telegram": "Telegram channel dispatch (300-1000 chars). High value-density dispatch.",
  "bluesky": "Bluesky post (under 300 chars). Authentic community thought.",
  "googleBusiness": "Google Business update (150-450 chars). Professional, clear, no hashtags, no emojis.",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4"],
  "imagePrompt": "Photorealistic [subject] in [environment]. [Scene details]. [Lighting] lighting. Shot on [camera] with [lens] lens. [Mood] mood. [Color palette] color palette. [Quality tags]. No watermark, no text, no logo."
}`;
  }

  private static buildKnowledgeBlock(kb: KnowledgeBase): string {
    return `DEFINITIONS & TERMINOLOGY:\n${Object.entries(kb.terminology).map(([t, d]) => `- ${t}: ${d}`).join('\n')}`;
  }

  private static buildReasoningBlock(reasoning: ContentReasoning): string {
    return `═══ CREATIVE REASONING & INTENT ═══
USER INTENT: ${reasoning.userIntent}
VALUE TO DELIVER: ${reasoning.contentValue}
EXPERT PERSPECTIVE: ${reasoning.expertPerspective}
DIFFERENTIATOR: ${reasoning.differentiator}
MUST NEVER CONTAIN: ${reasoning.neverInclude.join(', ')}
══════════════════════════════════`;
  }

  private static buildPlatformBlueprints(blueprint: ContentBlueprint, context: AIContext): string {
    const lines: string[] = ['═══ PLATFORM BLUEPRINTS ═══'];

    for (const pb of blueprint.platforms) {
      const rules = context.platformRules[pb.platform];
      lines.push(`\n[${pb.platform.toUpperCase()}]`);
      lines.push(`Target Length: Max ${rules?.maxChars || 1000} chars`);
      lines.push(`Structure: ${pb.sections.map(s => s.type.toUpperCase()).join(' → ')}`);
      lines.push(`Hook Angle: ${pb.hookVariants[0]?.text || ''}`);
      lines.push(`CTA Goal: ${pb.cta.text}`);
    }

    lines.push('═══════════════════════════');
    return lines.join('\n');
  }
}
