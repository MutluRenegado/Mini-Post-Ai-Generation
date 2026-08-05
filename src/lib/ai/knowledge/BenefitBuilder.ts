import { TopicBenefit, TopicProfile, AudienceProfile } from '../models/ai.types';

export class BenefitBuilder {
  static build(topic: TopicProfile, audience: AudienceProfile): TopicBenefit[] {
    const main = topic.mainTopic;
    const seg = audience.segment;

    return [
      {
        headline: `Operational Efficiency & Velocity`,
        description: `Implementing ${main} eliminates bottlenecks, reducing turnaround times for ${seg}.`,
        audience: seg,
        measurable: `Up to 35% improvement in process throughput`
      },
      {
        headline: `Risk Reduction & Compliance Safety`,
        description: `Adhering to standard ${main} practices protects operations from costly errors and regulatory penalties.`,
        audience: seg,
        measurable: `99% compliance accuracy rating`
      },
      {
        headline: `Cost Optimization & Resource Allocation`,
        description: `Streamlining ${main} eliminates redundant overhead and optimizes resource usage.`,
        audience: seg,
        measurable: `Average 20-30% reduction in operational friction`
      },
      {
        headline: `Competitive Market Advantage`,
        description: `Mastering ${main} enables faster execution and higher service quality than market peers.`,
        audience: seg,
        measurable: `Measurable gain in audience trust and retention`
      }
    ];
  }
}
