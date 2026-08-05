import { TopicExample, TopicProfile } from '../models/ai.types';

export class ExampleBuilder {
  static build(topic: TopicProfile): TopicExample[] {
    const main = topic.mainTopic;
    const ind = topic.industry;

    return [
      {
        scenario: `A mid-sized company struggling with manual bottlenecks in ${main}.`,
        application: `Transitioned to a standardized digital workflow with real-time tracking and automated compliance checks.`,
        outcome: `Cut cycle times by 45% and eliminated compliance penalties within the first quarter.`,
        industry: ind
      },
      {
        scenario: `An enterprise team scaling operations across multi-region markets.`,
        application: `Implemented a unified ${main} playbook across all regional teams.`,
        outcome: `Achieved 100% operational audit pass rates and seamless cross-border coordination.`,
        industry: ind
      }
    ];
  }
}
