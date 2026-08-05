import { MasterImagePrompt } from './master-image-prompt.types';

export type PromptValidationSeverity = 'info' | 'warning' | 'error' | 'blocking';

export interface PromptValidationFinding {
  id: string;
  code: string;
  section:
    | 'subject'
    | 'environment'
    | 'composition'
    | 'lighting'
    | 'color'
    | 'style'
    | 'platform'
    | 'constraints'
    | 'userRefinement'
    | 'promptText'
    | 'negativePromptText';

  severity: PromptValidationSeverity;
  message: string;
  repairable: boolean;
  suggestedAction?: string;
}

export interface PromptValidationResult {
  valid: boolean;
  providerReady: boolean;
  findings: PromptValidationFinding[];
  blockingFindings: number;
  warningFindings: number;
  validatedAt: string;

  // Non-optional script & legacy pipeline compatibility properties
  relevanceScore: number;
  specificityScore: number;
  platformScore: number;
  brandScore: number;
  modernityScore: number;
  colourScore: number;
  shareabilityScore: number;
  subjectClarityScore: number;
  topicAccuracyScore: number;
  communicationClarityScore: number;
  primarySubjectProminenceScore: number;
  domainConsistencyScore: number;
  primarySubjectCoverageScore: number;
  overallSemanticScore: number;
  failedThresholds: string[];
  categoryScores: {
    domainConsistency: number;
    primarySubjectAccuracy: number;
    sceneConsistency: number;
    keyObjectAccuracy: number;
    visualNarrativeAccuracy: number;
    environmentAccuracy: number;
    peopleRoleAccuracy: number;
    abstractConceptTranslation: number;
    platformAdaptation: number;
    promptCompleteness: number;
  };
  hardFailures: any[];
  errors: any[];
  problems: any[];
}

export interface PromptRepairResult {
  repaired: boolean;
  originalPrompt: MasterImagePrompt;
  repairedPrompt: MasterImagePrompt;
  repairsApplied: string[];
  validationAfterRepair: PromptValidationResult;
  repairedAt: string;
}
