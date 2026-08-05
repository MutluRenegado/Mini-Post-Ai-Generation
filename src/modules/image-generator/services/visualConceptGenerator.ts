import { VisualIntelligenceBrief } from '../types/visual-intelligence.types';
import { VisualConceptCandidate, ConceptGenerationResult } from '../types/visual-concept.types';
import { ConceptGenerationResultSchema } from '../schemas/visual-concept.schema';

export class VisualConceptGenerator {
  public static generateConcepts(brief: VisualIntelligenceBrief, manualCandidateId?: string): ConceptGenerationResult {
    const literalCandidate: VisualConceptCandidate = {
      id: `vcc_lit_${brief.fingerprint.slice(0, 8)}`,
      category: 'literal',
      title: 'Literal Subject Representation',
      description: `A direct high-fidelity visual of ${brief.primarySubject} in a ${brief.setting}.`,
      primarySubject: brief.primarySubject,
      mood: 'Clean, direct, realistic',
      score: 85,
    };

    const editorialCandidate: VisualConceptCandidate = {
      id: `vcc_edt_${brief.fingerprint.slice(0, 8)}`,
      category: 'editorial',
      title: 'Editorial Creative Narrative',
      description: `A stylized commercial scene highlighting ${brief.actionOrState} in a dynamic corporate environment.`,
      primarySubject: brief.primarySubject,
      visualMetaphor: brief.visualMeaning,
      mood: 'Sophisticated, narrative, editorial',
      score: 92,
    };

    const symbolicCandidate: VisualConceptCandidate = {
      id: `vcc_sym_${brief.fingerprint.slice(0, 8)}`,
      category: 'symbolic',
      title: 'Symbolic & Abstract Translation',
      description: `A conceptual artwork translating ${brief.visualMeaning} into minimalist geometric lighting pathways.`,
      primarySubject: `Abstract conceptualization of ${brief.primarySubject}`,
      visualMetaphor: `Illuminated network lines representing ${brief.keywords.join(', ')}`,
      mood: 'Futuristic, minimalist, inspiring',
      score: 88,
    };

    const candidates = [editorialCandidate, symbolicCandidate, literalCandidate];

    let selectedConcept = candidates[0];
    let selectedReason = 'Automatically selected highest-scoring candidate (Editorial Narrative).';
    let manualOverride = false;

    if (manualCandidateId) {
      const manual = candidates.find((c) => c.id === manualCandidateId);
      if (manual) {
        selectedConcept = manual;
        selectedReason = `User explicitly selected candidate ${manual.title}.`;
        manualOverride = true;
      }
    }

    const result: ConceptGenerationResult = {
      briefId: brief.id,
      candidates,
      selectedConcept,
      selectedReason,
      manualOverride,
    };

    ConceptGenerationResultSchema.parse(result);
    return result;
  }
}
