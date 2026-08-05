export interface GeneratedImageProblem {
  id: string;
  code: string;
  category:
    | 'semantic_relevance'
    | 'concept_fidelity'
    | 'composition'
    | 'lighting'
    | 'color_harmony'
    | 'brand_alignment'
    | 'platform_fit'
    | 'technical_quality';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impactScore: number;
}

export interface ImageCorrectionRecommendation {
  id: string;
  problemCode: string;
  targetSection:
    | 'subject'
    | 'environment'
    | 'composition'
    | 'lighting'
    | 'color'
    | 'style'
    | 'platform'
    | 'constraints'
    | 'userRefinement';
  action: 'modify' | 'add' | 'remove' | 'rebalance';
  recommendedInstruction: string;
  expectedScoreImprovement: number;
}

export interface GeneratedImageQualityResult {
  id: string;
  assetId: string;

  briefId: string;
  conceptId: string;
  compositionPlanId: string;
  promptId: string;
  promptVersion: number;

  overallScore: number;
  passThreshold: number;
  pass: boolean;

  scores: {
    semanticRelevance: number;
    conceptFidelity: number;
    subjectCorrectness: number;
    settingCorrectness: number;
    actionCorrectness: number;

    composition: number;
    focalClarity: number;
    visualHierarchy: number;

    lighting: number;
    colorHarmony: number;
    brandSuitability: number;

    platformSuitability: number;
    cropResilience: number;
    safeZoneCompliance: number;

    technicalQuality: number;
    sharpness: number;
    resolution: number;
    artifactControl: number;
    accessibility: number;
  };

  detectedProblems: GeneratedImageProblem[];
  correctionRecommendations: ImageCorrectionRecommendation[];

  semanticFidelity?: {
    primarySubjectFidelity: number;
    occupationFidelity: number;
    actionFidelity: number;
    objectFidelity: number;
    environmentFidelity: number;
    domainFidelity: number;
    conceptFidelity: number;
    overallSemanticFidelity: number;
  };

  analysisMethods: string[];
  unavailableChecks: string[];

  auditedAt: string;
}

