import { TopicFAQ, TopicProfile } from '../models/ai.types';

export class FAQBuilder {
  static build(topic: TopicProfile): TopicFAQ[] {
    const main = topic.mainTopic;

    return [
      {
        question: `What is the primary purpose of ${main}?`,
        answer: `The primary purpose of ${main} is to establish clarity, ensure quality, and optimize performance within ${topic.industry}.`,
        searchVolume: `high`
      },
      {
        question: `How long does it take to implement ${main} effectively?`,
        answer: `Implementation timelines vary by scale, but structured adoption typically yields initial results within 2 to 4 weeks.`,
        searchVolume: `high`
      },
      {
        question: `What are the most common mistakes people make with ${main}?`,
        answer: `The most common errors include skipping initial baseline planning, neglecting documentation, and failing to train key stakeholders.`,
        searchVolume: `medium`
      },
      {
        question: `How does ${main} impact ROI and efficiency?`,
        answer: `${main} directly improves ROI by cutting operational waste, accelerating turnaround, and reducing high-cost manual errors.`,
        searchVolume: `high`
      }
    ];
  }
}
