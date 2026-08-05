export type ImageRejectionCode =
  | 'EMPTY_OFFICE_SCENE_FORBIDDEN'
  | 'EMPTY_ENVIRONMENT_DETECTED'
  | 'ENVIRONMENT_DOMINANCE_DETECTED'
  | 'HUMAN_SUBJECT_REQUIRED'
  | 'PRIMARY_SUBJECT_TOO_WEAK'
  | 'VISIBLE_ACTION_MISSING'
  | 'GENERIC_CORPORATE_SCENE'
  | 'PASSIVE_HUMAN_SUBJECT'
  | 'UNRELATED_OBJECT_ASSOCIATION'
  | 'VISUAL_CLICHE_DETECTED'
  | 'TOPIC_ACCURACY_TOO_LOW'
  | 'COMMUNICATION_CLARITY_TOO_LOW'
  | 'PLATFORM_COMPOSITION_INVALID'
  | 'IMAGE_RULE_OVERRIDE_ATTEMPT';

export interface ImageValidationFailure {
  readonly code: ImageRejectionCode;
  readonly reason: string;
  readonly offendingElements: readonly string[];
  readonly requiredCorrection: string;
}

export interface ImageValidationScores {
  readonly topicAccuracyScore: number;
  readonly communicationClarityScore: number;
  readonly primarySubjectProminenceScore: number;
  readonly visibleActionScore: number;
  readonly supportingObjectRelevanceScore: number;
  readonly backgroundSubordinationScore: number;
  readonly compositionQualityScore: number;
  readonly platformCompatibilityScore: number;
}

export interface ImageValidationResult {
  readonly valid: boolean;
  readonly scores: ImageValidationScores;
  readonly failures: readonly ImageValidationFailure[];
}
