import { BaseAgent, AgentContext } from './BaseAgent';
import { KnowledgeEngine } from '@/lib/ai-text-editor/knowledge/KnowledgeEngine';
import { Logger } from '@/lib/ai-text-editor/logging/Logger';

export class KnowledgeAgent extends BaseAgent {
  name = 'KnowledgeAgent';
  description = 'Builds structured domain knowledge, FAQs, stats and definitions';

  async execute(context: AgentContext): Promise<any> {
    const start = Date.now();
    const topicProfile = context.payload?.topicProfile || {
      mainTopic: context.topic,
      industry: 'Business',
      primaryKeywords: [context.topic],
      secondaryKeywords: [],
      lsiKeywords: [],
      relatedConcepts: [],
      entities: [],
    };
    const audienceProfile = {
      segment: context.audience || 'Professionals',
      vocabularyLevel: 'professional' as const,
      formality: 'semi-formal' as const,
      painPoints: ['operational efficiency'],
      motivations: ['growth'],
      preferredCTA: 'Share thoughts',
      emojiUsage: 'moderate' as const,
      sentenceLength: 'medium' as const,
    };

    Logger.info('KnowledgeAgent', `Building knowledge base for: "${topicProfile.mainTopic}"`);
    const result = KnowledgeEngine.build(topicProfile as any, audienceProfile);
    Logger.info('KnowledgeAgent', `Built knowledge base with ${result.statistics.length} stat(s) and ${result.faqs.length} FAQ(s)`, null, undefined, Date.now() - start);
    return result;
  }
}
