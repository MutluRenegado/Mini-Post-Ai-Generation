import type { VisualReference } from '../../library/domain/visual-reference.model';

export interface ComponentScoreDetail {
  componentName: string;
  rawScore: number; // 0 to 100
  weight: number;   // 0 to 1.0
  weightedScore: number;
  evidence: string;
  explanation: string;
}

export interface DetailedComponentScores {
  topicMatch: ComponentScoreDetail;
  industryMatch: ComponentScoreDetail;
  categoryMatch: ComponentScoreDetail;
  sceneMatch: ComponentScoreDetail;
  subjectMatch: ComponentScoreDetail;
  peopleMatch: ComponentScoreDetail;
  roleMatch: ComponentScoreDetail;
  actionMatch: ComponentScoreDetail;
  objectMatch: ComponentScoreDetail;
  environmentMatch: ComponentScoreDetail;
  styleMatch: ComponentScoreDetail;
  lightingMatch: ComponentScoreDetail;
  compositionMatch: ComponentScoreDetail;
  cameraAngleMatch: ComponentScoreDetail;
  moodMatch: ComponentScoreDetail;
  colorMatch: ComponentScoreDetail;
  orientationMatch: ComponentScoreDetail;
  aspectRatioMatch: ComponentScoreDetail;
  technicalQualityScore: ComponentScoreDetail;
  curationQualityScore: ComponentScoreDetail;
  approvalHistoryScore: ComponentScoreDetail;
  rejectionPenalty: ComponentScoreDetail;
  recentUsagePenalty: ComponentScoreDetail;
  repeatedAssetPenalty: ComponentScoreDetail;
  repeatedScenePenalty: ComponentScoreDetail;
  campaignDiversityPenalty: ComponentScoreDetail;
  sourceAvailabilityPenalty: ComponentScoreDetail;
}

export interface TransparentRankingResult {
  candidateId: string;
  title: string;
  rawScore: number;
  finalScore: number;
  rankPosition: number;
  rankingVersion: string;
  selectionStatus: 'TOP_MATCH' | 'QUALIFIED' | 'DISQUALIFIED';
  componentScores: DetailedComponentScores;
  humanReadableExplanation: string;
  reference: VisualReference;
}
