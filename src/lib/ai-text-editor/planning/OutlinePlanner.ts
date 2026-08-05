import { StudioPlatform, ContentType, ContentSection, KnowledgeBase, AudienceProfile } from '../models/ai.types';

export class OutlinePlanner {
  static buildSections(platform: StudioPlatform, contentType: ContentType, kb: KnowledgeBase, audience: AudienceProfile): ContentSection[] {
    const main = kb.topic;

    if (platform === 'LinkedIn') {
      return [
        { type: 'hook', instruction: 'Scroll-stopping opening line highlighting a common challenge or stat.' },
        { type: 'context', instruction: `Explain why ${main} is critical right now in ${audience.segment} circles.` },
        { type: 'value', instruction: 'Break down 3 core insights or best practices.', keyPoints: kb.bestPractices },
        { type: 'proof', instruction: 'Reference a concrete statistic or real-world example.', keyPoints: [kb.statistics[0]?.claim || ''] },
        { type: 'cta', instruction: 'Engaging discussion question for high comment interaction.' }
      ];
    }

    if (platform === 'Twitter (X)') {
      return [
        { type: 'hook', instruction: 'Punchy 1-sentence hook statement.' },
        { type: 'value', instruction: 'Micro-breakdown of the key point with clear spacing.' },
        { type: 'cta', instruction: 'Short retweet/reply prompt.' }
      ];
    }

    if (platform === 'TikTok' || platform === 'Instagram Story') {
      return [
        { type: 'hook', instruction: 'Visual/Audio hook for first 3 seconds.' },
        { type: 'context', instruction: 'Problem breakdown with dynamic delivery.' },
        { type: 'value', instruction: 'Quick solution tip.' },
        { type: 'cta', instruction: 'Call to follow or comment.' }
      ];
    }

    return [
      { type: 'hook', instruction: 'Strong curiosity or benefit hook.' },
      { type: 'context', instruction: `Brief setup of ${main}.` },
      { type: 'value', instruction: 'Core actionable takeaways.', keyPoints: kb.actionableInsights },
      { type: 'cta', instruction: 'Call to action.' }
    ];
  }
}
