import { KnowledgeBase, TopicProfile, AudienceProfile } from '../models/ai.types';
import { DefinitionBuilder } from './DefinitionBuilder';
import { BenefitBuilder } from './BenefitBuilder';
import { ProblemBuilder } from './ProblemBuilder';
import { FAQBuilder } from './FAQBuilder';
import { StatisticsBuilder } from './StatisticsBuilder';
import { ExampleBuilder } from './ExampleBuilder';

export class KnowledgeEngine {
  static build(topic: TopicProfile, audience: AudienceProfile): KnowledgeBase {
    const main = topic.mainTopic;

    return {
      topic: main,
      definitions: DefinitionBuilder.build(topic),
      benefits: BenefitBuilder.build(topic, audience),
      problems: ProblemBuilder.build(topic, audience),
      faqs: FAQBuilder.build(topic),
      statistics: StatisticsBuilder.build(topic),
      examples: ExampleBuilder.build(topic),
      terminology: {
        [main]: `Core focus area of this content analysis.`,
        'Optimization': `Process of making a system or decision as fully perfect, functional, or effective as possible.`,
        'Compliance': `Adherence to rules, regulations, specifications, or standards.`
      },
      misconceptions: [
        `${main} is only relevant for large enterprise corporations.`,
        `Implementing ${main} takes months of disruption before seeing value.`,
        `${main} can be completely automated without human strategic oversight.`
      ],
      bestPractices: [
        `Audit current workflows before introducing structural changes.`,
        `Establish clear, measurable KPIs for tracking progress.`,
        `Maintain clear documentation and continuous training.`
      ],
      commonMistakes: [
        `Rushing execution without defining baseline metrics.`,
        `Over-complicating early stages with unnecessary tool sprawl.`,
        `Ignoring feedback from front-line execution teams.`
      ],
      relatedTopics: topic.relatedConcepts,
      expertPerspectives: [
        `Top performers treat ${main} as a continuous growth lever, not a one-time project.`,
        `Clarity of intent and consistency of execution beat complex strategies every time.`
      ],
      actionableInsights: [
        `Start with a targeted 3-step audit of your highest-friction process.`,
        `Standardize core documentation to align team execution immediately.`
      ]
    };
  }
}
