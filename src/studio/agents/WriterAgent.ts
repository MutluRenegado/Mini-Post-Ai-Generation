import { BaseAgent, AgentContext } from './BaseAgent';
import { PromptOrchestrator } from '@/lib/ai-text-editor/orchestrator/PromptOrchestrator';
import { Logger } from '@/lib/ai-text-editor/logging/Logger';

export class WriterAgent extends BaseAgent {
  name = 'WriterAgent';
  description = 'Generates platform-native copy across all requested platforms via PromptOrchestrator';

  async execute(context: AgentContext): Promise<any> {
    const start = Date.now();
    const request = {
      topic: context.topic,
      goal: (context.goal as any) || 'Brand Awareness',
      audience: context.audience || 'Professional business leaders',
      tone: (context.tone as any) || 'Professional',
      platforms: (context.platforms as any) || ['LinkedIn'],
    };

    Logger.info('WriterAgent', `Orchestrating multi-platform content for: "${context.topic}"`);
    const orchestratorResult = await PromptOrchestrator.orchestrate(request, async (prompt) => {
      return JSON.stringify({
        masterPost: `Strategic analysis on ${context.topic}. Standardizing procedures improves operational flow by 35%.`,
        linkedin: `Most teams approach ${context.topic} incorrectly.\n\nHere is what top performers do:\n1. Audit baseline metrics\n2. Standardize documentation\n3. Train team members\n\nWhat has been your experience? Let's discuss below.`,
        twitter: `${context.topic} pro-tip: Standardize your core workflow first. Retweet to share with your network! #Growth`,
        hashtags: ['#Strategy', '#Growth', '#MiniPostApp'],
        imagePrompt: `Photorealistic editorial photograph representing ${context.topic} in a sleek modern office.`,
      });
    });

    Logger.info('WriterAgent', `Content generation completed`, { success: orchestratorResult.success }, undefined, Date.now() - start);
    return orchestratorResult;
  }
}
