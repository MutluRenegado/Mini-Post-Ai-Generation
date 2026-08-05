import { RetrievalResult, TopicProfile } from '../models/ai.types';
import { SourceCollector } from './SourceCollector';
import { KnowledgeCache } from './KnowledgeCache';

export class RetrievalEngine {
  static retrieve(topic: TopicProfile): RetrievalResult {
    const cached = KnowledgeCache.get(topic.mainTopic);
    if (cached) {
      return { ...cached, cached: true };
    }

    const facts = SourceCollector.collect(topic.mainTopic, topic.industry);
    const result: RetrievalResult = {
      topic: topic.mainTopic,
      facts,
      sources: facts.map((f) => f.source),
      cached: false,
      retrievedAt: new Date().toISOString(),
    };

    KnowledgeCache.set(topic.mainTopic, result);
    return result;
  }
}
