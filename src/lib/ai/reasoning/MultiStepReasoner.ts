import { StudioRequest, TopicProfile, AudienceProfile, KnowledgeBase, ContentReasoning } from '../models/ai.types';

export class MultiStepReasoner {
  static planSteps(request: StudioRequest, topic: TopicProfile, audience: AudienceProfile, kb: KnowledgeBase): ContentReasoning {
    return {
      userIntent: `Deliver actionable expertise on ${topic.mainTopic} tailored for ${audience.segment}.`,
      contentValue: `Solve ${audience.painPoints[0] || 'operational friction'} with proven industry methods.`,
      questionsAnswered: kb.faqs.map((f) => f.question),
      missingInformation: ['Vague generalizations without data'],
      neverInclude: [
        'Master Topic', 'Strategic Insight', 'Executive Intel',
        'As an AI language model', 'In today\'s fast-paced digital world',
      ],
      expertPerspective: `Practical, data-backed execution strategies for ${topic.industry}.`,
      differentiator: `Specific stats, step-by-step framework, clear call-to-action.`,
      multiStepPlan: [
        '1. Identify the core audience bottleneck.',
        '2. Frame the solution using domain terminology.',
        '3. Present proof statistic or case study.',
        '4. Provide 3 actionable takeaways.',
        '5. End with platform-native engagement CTA.',
      ],
    };
  }
}
