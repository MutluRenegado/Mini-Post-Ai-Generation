import { BaseAgent, AgentContext } from './BaseAgent';
import { SEOOptimizer } from '@/lib/ai-text-editor/optimization/SEOOptimizer';
import { Logger } from '@/lib/ai-text-editor/logging/Logger';

export class SEOAgent extends BaseAgent {
  name = 'SEOAgent';
  description = 'Optimizes keyword density, hashtags and search intent';

  async execute(context: AgentContext): Promise<any> {
    const start = Date.now();
    const body = context.payload?.body || context.topic;
    const keywords = context.payload?.keywords || [context.topic];

    Logger.info('SEOAgent', `Optimizing SEO for text of length ${body.length}`);
    const optimized = SEOOptimizer.optimize(body, keywords);
    Logger.info('SEOAgent', `SEO optimization complete`, null, undefined, Date.now() - start);
    return optimized;
  }
}
