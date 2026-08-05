import { StudioRequest, TopicProfile, AudienceProfile, KnowledgeBase, ContentReasoning } from '../models/ai.types';

export class ContentReasoner {
  static analyze(request: StudioRequest, topic: TopicProfile, audience: AudienceProfile, kb: KnowledgeBase): ContentReasoning {
    return {
      userIntent: `The user wants to communicate actionable value about ${topic.mainTopic} to ${audience.segment} with the goal of ${request.goal}.`,
      contentValue: `Provide deep, practical insights on ${topic.mainTopic}, resolving key pain points like ${audience.painPoints[0] || 'operational delays'}.`,
      questionsAnswered: kb.faqs.map(f => f.question),
      missingInformation: [
        `Surface-level generalizations without actionable steps`,
        `Outdated practices in ${topic.industry}`
      ],
      neverInclude: [
        `Master Topic`, `Strategic Insight`, `Executive Intel`,
        `As an AI language model`, `In today's fast-paced digital world`,
        `Here is a post for you`
      ],
      expertPerspective: `A senior subject-matter expert emphasizes practical execution, measurable ROI, and avoiding common pitfalls in ${topic.mainTopic}.`,
      differentiator: `Focus on concrete real-world application, specific industry statistics, and clear step-by-step guidance rather than generic advice.`
    };
  }
}
