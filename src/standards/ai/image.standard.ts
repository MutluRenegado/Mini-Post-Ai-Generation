/**
 * Mini Post App - AI Image Standard
 * Informed by NIST AI RMF (Validity & Fairness) and ISO/IEC 25010 (Functional Correctness).
 * Enforces the mandatory 95% overall semantic acceptance threshold.
 */

export interface ImageStandardSpec {
  minimumOverallSemanticScore: number;
  categoryThresholds: Record<string, number>;
  mandatoryPipelineSequence: string[];
  blockedFallbacks: string[];
  hardFailureRules: string[];
  frameworkAlignment: {
    nistAiRmf: {
      validityThreshold: string;
      fairnessAndAccuracy: string;
    };
    iso25010: {
      functionalCorrectness: string;
    };
  };
}

export const ImageStandard: ImageStandardSpec = {
  minimumOverallSemanticScore: 95,
  categoryThresholds: {
    domainConsistency: 98,
    primarySubjectAccuracy: 98,
    sceneConsistency: 97,
    keyObjectAccuracy: 95,
    visualNarrativeAccuracy: 95,
    environmentAccuracy: 95,
    peopleRoleAccuracy: 95,
    abstractConceptAccuracy: 95,
    platformAdaptationAccuracy: 95,
    promptCompletenessScore: 95,
  },
  mandatoryPipelineSequence: [
    'Complete Final Post Text',
    'Quality & Standards Validation',
    'Final Approved Text',
    'ContentSummarizer',
    'VisualRelevanceAnalyzer',
    'VisualIntent',
    'PostVisualBriefExtractor',
    'ImagePromptBuilder',
    'ImagePromptValidator',
    'Image Provider Execution',
  ],
  blockedFallbacks: [
    'Generic corporate team background',
    'Generic technology circuit board',
    'Dark default ungrounded prompt',
  ],
  hardFailureRules: [
    'DOMAIN_MISMATCH',
    'UNSUPPORTED_PRIMARY_SUBJECT',
    'HALLUCINATED_MAJOR_OBJECT',
    'HALLUCINATED_PERSON',
    'GENERIC_FALLBACK_SCENE',
    'PREVIOUS_REQUEST_STATE_LEAK',
  ],
  frameworkAlignment: {
    nistAiRmf: {
      validityThreshold: 'Overall semantic score < 95% automatically fails prompt validation before execution',
      fairnessAndAccuracy: 'Enforces domain consistency and primary subject accuracy at >= 98%',
    },
    iso25010: {
      functionalCorrectness: 'Guarantees generated image prompt matches approved final post text',
    },
  },
};
