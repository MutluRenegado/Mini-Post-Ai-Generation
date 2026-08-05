export interface RankingWeightsConfig {
  version: string;
  effectiveDate: string;
  calibrationStatus: 'UNVALIDATED' | 'CALIBRATED' | 'VALIDATED';
  weights: {
    topicMatch: number;
    industryMatch: number;
    categoryMatch: number;
    sceneMatch: number;
    subjectMatch: number;
    peopleMatch: number;
    roleMatch: number;
    actionMatch: number;
    objectMatch: number;
    environmentMatch: number;
    styleMatch: number;
    lightingMatch: number;
    compositionMatch: number;
    cameraAngleMatch: number;
    moodMatch: number;
    colorMatch: number;
    orientationMatch: number;
    aspectRatioMatch: number;
    technicalQualityScore: number;
    curationQualityScore: number;
  };
}

export class RankingWeights {
  static DEFAULT_CONFIG: RankingWeightsConfig = {
    version: '2.0.0-metadata-transparent',
    effectiveDate: '2026-08-02',
    calibrationStatus: 'UNVALIDATED',
    weights: {
      topicMatch: 0.20,
      industryMatch: 0.15,
      categoryMatch: 0.05,
      sceneMatch: 0.15,
      subjectMatch: 0.05,
      peopleMatch: 0.05,
      roleMatch: 0.10,
      actionMatch: 0.025,
      objectMatch: 0.10,
      environmentMatch: 0.05,
      styleMatch: 0.05,
      lightingMatch: 0.025,
      compositionMatch: 0.025,
      cameraAngleMatch: 0.025,
      moodMatch: 0.025,
      colorMatch: 0.025,
      orientationMatch: 0.025,
      aspectRatioMatch: 0.05,
      technicalQualityScore: 0.05,
      curationQualityScore: 0.05,
    },
  };
}
