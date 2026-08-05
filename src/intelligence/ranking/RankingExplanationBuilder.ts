import type { DetailedComponentScores } from './ranking.types';

export class RankingExplanationBuilder {
  static buildExplanation(title: string, finalScore: number, scores: DetailedComponentScores): string {
    const highlights: string[] = [];

    if (scores.topicMatch.rawScore > 0) highlights.push(`Topic: ${scores.topicMatch.evidence}`);
    if (scores.industryMatch.rawScore > 0) highlights.push(`Industry: ${scores.industryMatch.evidence}`);
    if (scores.sceneMatch.rawScore > 0) highlights.push(`Scene: ${scores.sceneMatch.evidence}`);
    if (scores.roleMatch.rawScore > 0) highlights.push(`Roles: ${scores.roleMatch.evidence}`);
    if (scores.objectMatch.rawScore > 0) highlights.push(`Objects: ${scores.objectMatch.evidence}`);

    const penalties: string[] = [];
    if (scores.recentUsagePenalty.rawScore > 0) penalties.push(`Recent Usage (-${scores.recentUsagePenalty.rawScore})`);
    if (scores.repeatedScenePenalty.rawScore > 0) penalties.push(`Repeated Scene (-${scores.repeatedScenePenalty.rawScore})`);

    let summary = `Ranked candidate "${title}" with Final Score: ${finalScore}/100. `;
    if (highlights.length > 0) summary += `Matches: [${highlights.join(' | ')}]. `;
    if (penalties.length > 0) summary += `Penalties Applied: [${penalties.join(' | ')}].`;

    return summary;
  }
}
