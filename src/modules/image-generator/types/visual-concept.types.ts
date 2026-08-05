export type ConceptCategory = 'literal' | 'editorial' | 'symbolic';

export interface VisualConceptCandidate {
  id: string;
  category: ConceptCategory;
  title: string;
  description: string;
  primarySubject: string;
  visualMetaphor?: string;
  mood: string;
  score: number;
}

export interface ConceptGenerationResult {
  briefId: string;
  candidates: VisualConceptCandidate[];
  selectedConcept: VisualConceptCandidate;
  selectedReason: string;
  manualOverride: boolean;
}
