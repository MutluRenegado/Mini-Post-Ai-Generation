import { BaseAgent, AgentContext } from './BaseAgent';
import { RetrievalEngine } from '@/lib/ai-text-editor/retrieval/RetrievalEngine';
import { Logger } from '@/lib/ai-text-editor/logging/Logger';

export class ResearchAgent extends BaseAgent {
  name = 'ResearchAgent';
  description = 'Retrieves authoritative facts and domain information via RAG';

  async execute(context: AgentContext): Promise<any> {
    const start = Date.now();
    const topicProfile = context.payload?.topicProfile || {
      mainTopic: context.topic,
      industry: 'Business',
    };
    Logger.info('ResearchAgent', `Retrieving RAG facts for topic: "${topicProfile.mainTopic}"`);

    const result = RetrievalEngine.retrieve(topicProfile);
    Logger.info('ResearchAgent', `Retrieved ${result.facts.length} fact(s)`, { cached: result.cached }, undefined, Date.now() - start);
    return result;
  }
}
