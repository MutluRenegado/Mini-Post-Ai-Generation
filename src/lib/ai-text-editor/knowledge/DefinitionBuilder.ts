import { TopicDefinition, TopicProfile } from '../models/ai.types';

export class DefinitionBuilder {
  static build(topicProfile: TopicProfile): TopicDefinition {
    const topic = topicProfile.mainTopic;
    const industry = topicProfile.industry;
    const lower = topic.toLowerCase();

    return {
      concise: `${topic} is a core operational concept in ${industry} focused on optimizing outcomes and compliance.`,
      expanded: `${topic} encompasses the systematic procedures, framework, and strategy applied within ${industry} to streamline operations, reduce risk, and maximize efficiency.`,
      professional: `In enterprise ${industry}, ${topic} defines the technical standards, protocols, and regulatory mechanisms governing performance and integration.`,
      layperson: `Simply put, ${topic} is how people and businesses in ${industry} get things done smoothly without unnecessary headaches or delays.`,
      etymology: `Derived from industry standard terminology and operational practices.`
    };
  }
}
