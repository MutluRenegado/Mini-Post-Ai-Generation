export interface CalibrationThresholds {
  candidateEligibilityMinimum: number; // Default 0
  enrichmentRecommendationMinimum: number; // Default 50
  existingAssetSelectionMinimum: number; // Default 80 (Auto-selection DISABLED)
  finalAssetAutoSelectionEnabled: boolean; // MUST BE FALSE
}

export class RankingCalibrationService {
  static DEFAULT_THRESHOLDS: CalibrationThresholds = {
    candidateEligibilityMinimum: 0,
    enrichmentRecommendationMinimum: 50,
    existingAssetSelectionMinimum: 80,
    finalAssetAutoSelectionEnabled: false, // FINAL ASSET AUTO-SELECTION: DISABLED
  };
}
