import { BaseAgent, AgentContext } from './BaseAgent';
import { TopicAnalyzer } from '@/lib/ai-text-editor/intelligence/TopicAnalyzer';
import { InputSanitizer } from '@/lib/ai-text-editor/security/InputSanitizer';
import { Logger } from '@/lib/ai-text-editor/logging/Logger';

export class TopicAgent extends BaseAgent {
  name = 'TopicAgent';
  description = 'Analyzes topics, categories, industries and user search intent';

  async execute(context: AgentContext): Promise<any> {
    const start = Date.now();
    const cleanTopic = InputSanitizer.sanitizeTopic(context.topic);
    Logger.info('TopicAgent', `Executing topic analysis for: "${cleanTopic}"`);

    const result = TopicAnalyzer.analyze({
      topic: cleanTopic,
      goal: (context.goal as any) || 'Brand Awareness',
      audience: context.audience || 'Business Leaders',
      tone: (context.tone as any) || 'Professional',
      platforms: (context.platforms as any) || ['LinkedIn'],
    });

    Logger.info('TopicAgent', `Completed topic analysis in ${Date.now() - start}ms`, { category: result.category, industry: result.industry });
    return result;
  }
}
