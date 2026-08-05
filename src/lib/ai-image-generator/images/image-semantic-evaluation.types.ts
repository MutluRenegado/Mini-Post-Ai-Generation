export type EvaluationStatus = 'VERIFIED' | 'UNVERIFIED' | 'UNAVAILABLE' | 'FAILED';

export interface SemanticRelevanceScore {
  score: number; // 0 to 100
  confidence: number; // 0.0 to 1.0
  status: EvaluationStatus;
  evidenceExcerpt: string;
  calculationMethod: string;
  thresholdSource: string;
  limitationsNote?: string;
}

export interface ImageSemanticEvaluationResult {
  overallStatus: EvaluationStatus;
  textToBriefScore: SemanticRelevanceScore;
  briefToPromptScore: SemanticRelevanceScore;
  imageContentVisionScore: SemanticRelevanceScore;
  isPassed: boolean;
  deterministicFingerprint: string;
}
