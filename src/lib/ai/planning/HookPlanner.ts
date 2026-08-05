import { TopicProfile, AudienceProfile, KnowledgeBase, HookVariant, StudioPlatform } from '../models/ai.types';

export class HookPlanner {
  static plan(topic: TopicProfile, audience: AudienceProfile, kb: KnowledgeBase): HookVariant[] {
    const main = topic.mainTopic;
    const stat = kb.statistics[0]?.claim || `40% of operations struggle with ${main}`;

    return [
      {
        style: 'bold_statement',
        text: `Most teams handle ${main} completely wrong — and it's costing them time and money.`,
        platform: 'universal'
      },
      {
        style: 'statistic',
        text: `${stat} Here is how to stay ahead.`,
        platform: 'LinkedIn'
      },
      {
        style: 'question',
        text: `Are you making these 3 critical mistakes with ${main}?`,
        platform: 'Twitter (X)'
      },
      {
        style: 'secret',
        text: `The unwritten rule of ${main} that nobody talks about:`,
        platform: 'Instagram Feed'
      },
      {
        style: 'how_to',
        text: `How to master ${main} in 3 actionable steps (without the headaches):`,
        platform: 'universal'
      }
    ];
  }
}
