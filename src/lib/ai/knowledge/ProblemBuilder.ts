import { TopicProblem, TopicProfile, AudienceProfile } from '../models/ai.types';

export class ProblemBuilder {
  static build(topic: TopicProfile, audience: AudienceProfile): TopicProblem[] {
    const main = topic.mainTopic;
    const seg = audience.segment;

    return [
      {
        problem: `Lack of standardized procedures for ${main}`,
        consequence: `Leads to inconsistent results, execution delays, and increased error rates.`,
        solution: `Establish a structured framework with clear checklists and automated verification.`,
        severity: `high`
      },
      {
        problem: `Misalignment between team roles and ${main} execution`,
        consequence: `Creates communication breakdowns, duplicate effort, and missed deadlines.`,
        solution: `Define explicit responsibilities and transparent handoff protocols.`,
        severity: `medium`
      },
      {
        problem: `Ignoring updated regulations and industry standards regarding ${main}`,
        consequence: `Exposes the organization to unexpected compliance penalties or audit failures.`,
        solution: `Implement continuous updates and automated compliance monitoring.`,
        severity: `critical`
      }
    ];
  }
}
