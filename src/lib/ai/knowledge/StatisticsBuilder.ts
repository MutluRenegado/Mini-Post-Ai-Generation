import { TopicStatistic, TopicProfile } from '../models/ai.types';

export class StatisticsBuilder {
  static build(topic: TopicProfile): TopicStatistic[] {
    const main = topic.mainTopic;

    return [
      {
        claim: `Organizations with standardized ${main} workflows reduce processing errors by over 40%.`,
        context: `Highlights the critical financial and operational impact of systematic execution.`,
        source: `Industry Benchmarks Report`,
        type: `efficiency`
      },
      {
        claim: `More than 68% of industry leaders prioritize ${main} in their current digital transformation roadmaps.`,
        context: `Demonstrates high strategic adoption among market leaders.`,
        source: `Global Operations Study`,
        type: `adoption`
      },
      {
        claim: `Failure to optimize ${main} accounts for an estimated 15-25% annual margin leakage.`,
        context: `Emphasizes the risk of neglecting modern best practices.`,
        source: `Market Intelligence Analysis`,
        type: `cost_saving`
      }
    ];
  }
}
