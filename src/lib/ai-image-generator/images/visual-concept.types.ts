export type VisualConceptType = 'literal' | 'editorial' | 'symbolic';

export interface ConceptPlatformFit {
  platform: string;
  aspectRatio: string;
  safeAreaCompatibility: number;
}

export interface ConceptScores {
  semanticRelevance: number;
  brandCompatibility: number;
  platformCompatibility: number;
  productionFeasibility: number;
  originality: number;
  overall: number;
}

export interface VisualConceptCandidate {
  id: string;
  briefId: string;
  type: VisualConceptType;

  title: string;
  sceneDescription: string;

  primarySubject: string;
  supportingSubjects: string[];

  setting: string;
  action: string;
  visualMetaphor?: string;

  emotionalEffect: string;
  compositionDirection: string;
  colorDirection: string[];
  lightingDirection?: string;

  platformFit: ConceptPlatformFit;

  scores: ConceptScores;

  riskFlags: string[];
  conciseSelectionRationale: string;

  status: 'candidate' | 'selected' | 'rejected';
  createdAt: string;
}

export interface ConceptGenerationResult {
  briefId: string;
  candidates: VisualConceptCandidate[];
  selectedConcept: VisualConceptCandidate;
  generationTimestamp: string;
}
