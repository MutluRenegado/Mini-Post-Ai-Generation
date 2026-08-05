import { AIContext, PlatformRules, StudioPlatform, KnowledgeBase, ContentBlueprint } from '../models/ai.types';
import { ContentStrategy } from '../strategy/ContentStrategyEngine';
import { Intent } from '../intelligence/IntentDetector';

/**
 * PlatformPromptBuilder v2.0 — Generates platform-specialized prompts.
 * Directs Gemini to produce platform-native structures based on the blueprint and knowledge base.
 */
export class PlatformPromptBuilder {
  static build(
    platform: StudioPlatform,
    context: AIContext,
    strategy: ContentStrategy,
    intent: Intent,
    kb?: KnowledgeBase,
    blueprint?: ContentBlueprint
  ): { systemPrompt: string; userPrompt: string } {
    const rules = context.platformRules[platform];
    return {
      systemPrompt: this.buildSystemPrompt(platform, context, rules, strategy),
      userPrompt: this.buildUserPrompt(platform, context, strategy, intent, kb, blueprint),
    };
  }

  private static buildSystemPrompt(
    platform: StudioPlatform,
    context: AIContext,
    rules: PlatformRules | undefined,
    strategy: ContentStrategy
  ): string {
    const { audienceProfile, toneConfig } = context;
    const platformRules = rules || {
      maxChars: 1000,
      hashtagMin: 3,
      hashtagMax: 5,
      ctaStyle: 'Engage with a question',
      writingStyle: 'Professional',
      postStructure: ['Hook', 'Body', 'CTA'],
      uniqueFeatures: [] as string[],
      platform: platform,
      hookRequired: true,
      hashtagPosition: 'end' as const,
      emojiAllowed: true,
      preferredLength: 'medium' as const,
      contentPersonality: 'Professional, engaging content for your audience.',
    };

    return `You are an elite ${platform} content specialist and copywriter.

PLATFORM: ${platform}
MAX CHARACTER LIMIT: ${platformRules.maxChars} characters maximum.
HASHTAG RULE: ${platformRules.hashtagMin}–${platformRules.hashtagMax} hashtags only.
PERSONALITY: ${platformRules.contentPersonality}
WRITING STYLE: ${platformRules.writingStyle}

AUDIENCE: ${audienceProfile.segment} (${audienceProfile.vocabularyLevel} level, ${audienceProfile.formality} formality)
TONE: ${toneConfig.tone} (${toneConfig.vocabularyStyle})

STRICT CONTENT RULES:
1. NEVER output developer metadata labels (Goal:, Audience:, Platform:, Tone:, Topic:, Master Topic:, Strategic Insight:, Executive Intel:).
2. NEVER include template placeholders or generic text.
3. Hook must immediately hook the reader.
4. Output ONLY the final publication-ready text for ${platform}.`;
  }

  private static buildUserPrompt(
    platform: StudioPlatform,
    context: AIContext,
    strategy: ContentStrategy,
    intent: Intent,
    kb?: KnowledgeBase,
    blueprint?: ContentBlueprint
  ): string {
    const { topicProfile, audienceProfile, toneConfig } = context;
    const platformBp = blueprint?.platforms.find(p => p.platform === platform);

    return `Write a publication-ready ${platform} post on ${topicProfile.mainTopic}.

KEY DEFINITION: ${kb?.definitions.concise || topicProfile.mainTopic}
KEY STATISTIC / PROOF: "${kb?.statistics[0]?.claim || ''}"
BEST PRACTICE TO EMBED: ${kb?.bestPractices[0] || ''}

STRUCTURE TO FOLLOW:
${platformBp?.sections.map((s, i) => `${i + 1}. [${s.type.toUpperCase()}] ${s.instruction}`).join('\n') || strategy.structureTemplate.join('\n')}

TARGET AUDIENCE: ${audienceProfile.segment}
HOOK STYLE: ${toneConfig.hookStyle}
CTA TO USE: ${platformBp?.cta.text || audienceProfile.preferredCTA}

Write the post content now. Return ONLY the final post body.`;
  }
}
