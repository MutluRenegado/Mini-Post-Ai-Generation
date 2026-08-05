import { VisualIntelligenceBrief } from './visual-intelligence.types';
import { VisualConceptCandidate, ConceptGenerationResult } from './visual-concept.types';
import { VisualConceptCandidateSchema } from './visual-concept.schema';
import { SemanticSubjectIntelligence } from './semanticSubjectIntelligence';

export class VisualConceptGenerator {
  /**
   * Generates at least 3 distinct visual concept candidates (literal, editorial, symbolic)
   * grounded in canonical SemanticSubjectIntelligence concrete entities.
   */
  public static generateConcepts(brief: VisualIntelligenceBrief): ConceptGenerationResult {
    if (!brief || !brief.id) {
      throw new Error('INVALID_BRIEF_INPUT: VisualIntelligenceBrief is required for concept generation.');
    }

    const timestamp = new Date().toISOString();
    const briefId = brief.id;

    // Use attached semantic subject or extract fresh from brief content
    const semantic = brief.semanticSubject || SemanticSubjectIntelligence.extract(brief.sanitizedSourceSummary || brief.centralMessage, brief.id);

    const primaryOccupations = semantic.occupations.slice(0, 2).join(' and ');
    const primaryObjects = semantic.physicalObjects.slice(0, 2).join(' and ');
    const mainAction = semantic.visibleActions[0] || brief.action;
    const environmentSetting = semantic.environment || brief.setting;

    // 1. Literal Concept Candidate (Direct Concrete Representation)
    const literalConcept: VisualConceptCandidate = {
      id: `vc_${briefId}_literal`,
      briefId,
      type: 'literal',
      title: `Direct Representation: ${semantic.primarySubject}`,
      sceneDescription: `Clear, direct photorealistic visual showing ${primaryOccupations} actively ${mainAction} in a ${environmentSetting} using ${primaryObjects}.`,
      primarySubject: semantic.primarySubject,
      supportingSubjects: Array.from(new Set([...semantic.occupations, ...semantic.physicalObjects])),
      setting: environmentSetting,
      action: mainAction,
      emotionalEffect: semantic.emotionalEffect,
      compositionDirection: 'Balanced center-focused framing with clean focal subject, visible physical tools, and soft depth-of-field background.',
      colorDirection: brief.colorDirection,
      lightingDirection: 'Bright, balanced natural daylight with soft fill illumination.',
      platformFit: {
        platform: brief.platform,
        aspectRatio: brief.aspectRatio,
        safeAreaCompatibility: 95,
      },
      scores: {
        semanticRelevance: 98,
        brandCompatibility: 92,
        platformCompatibility: 95,
        productionFeasibility: 94,
        originality: 75,
        overall: 94,
      },
      riskFlags: [],
      conciseSelectionRationale: 'High semantic grounding and direct representation of article occupations, environment, and physical tools.',
      status: 'candidate',
      createdAt: timestamp,
    };

    // 2. Editorial Concept Candidate (Narrative Scene Grounded in Article)
    const editorialConcept: VisualConceptCandidate = {
      id: `vc_${briefId}_editorial`,
      briefId,
      type: 'editorial',
      title: `Storytelling Scene: ${primaryOccupations} in Action`,
      sceneDescription: `Dynamic editorial narrative snapshot featuring ${primaryOccupations} collaborating on ${mainAction} inside ${environmentSetting} surrounded by ${semantic.physicalObjects.join(', ')}.`,
      primarySubject: `${primaryOccupations} collaborating in workplace`,
      supportingSubjects: Array.from(new Set([...semantic.physicalObjects, ...semantic.secondarySubjects, 'contextual environment'])),
      setting: environmentSetting,
      action: mainAction,
      emotionalEffect: semantic.emotionalEffect,
      compositionDirection: 'Rule of thirds composition with leading lines guiding attention across the frame to active professionals.',
      colorDirection: brief.colorDirection,
      lightingDirection: 'Cinematic side-key lighting with natural ambient highlights.',
      platformFit: {
        platform: brief.platform,
        aspectRatio: brief.aspectRatio,
        safeAreaCompatibility: 92,
      },
      scores: {
        semanticRelevance: 95,
        brandCompatibility: 94,
        platformCompatibility: 92,
        productionFeasibility: 88,
        originality: 88,
        overall: 93,
      },
      riskFlags: [],
      conciseSelectionRationale: 'Engaging narrative depth featuring realistic professionals in action with specialized equipment.',
      status: 'candidate',
      createdAt: timestamp,
    };

    // 3. Symbolic Concept Candidate (Grounded Metaphor - NO Abstract Clutter)
    const visualMetaphor = semantic.visualMetaphors[0] || `${primaryOccupations} demonstrating ${semantic.domain} excellence`;
    const symbolicConcept: VisualConceptCandidate = {
      id: `vc_${briefId}_symbolic`,
      briefId,
      type: 'symbolic',
      title: `Visual Metaphor: ${visualMetaphor}`,
      sceneDescription: `Conceptual, artistic visual using ${visualMetaphor} grounded in identifiable ${primaryOccupations} and ${primaryObjects} situated in ${environmentSetting}.`,
      primarySubject: `${primaryOccupations} representing ${semantic.domain}`,
      supportingSubjects: semantic.physicalObjects,
      setting: environmentSetting,
      action: mainAction,
      visualMetaphor,
      emotionalEffect: semantic.emotionalEffect,
      compositionDirection: 'Minimalist asymmetrical layout with strong focal subject and clear negative space for text overlay.',
      colorDirection: brief.colorDirection,
      lightingDirection: 'Focused directional key light highlighting core subjects and physical tools.',
      platformFit: {
        platform: brief.platform,
        aspectRatio: brief.aspectRatio,
        safeAreaCompatibility: 90,
      },
      scores: {
        semanticRelevance: 88,
        brandCompatibility: 90,
        platformCompatibility: 90,
        productionFeasibility: 90,
        originality: 92,
        overall: 90,
      },
      riskFlags: [],
      conciseSelectionRationale: 'Creative visual metaphor grounded in concrete article entities without abstract floating clutter.',
      status: 'candidate',
      createdAt: timestamp,
    };

    const candidates = [literalConcept, editorialConcept, symbolicConcept];

    // Compute overall scores deterministically
    candidates.forEach((c) => {
      const overall = Math.round(
        c.scores.semanticRelevance * 0.40 +
        c.scores.brandCompatibility * 0.20 +
        c.scores.platformCompatibility * 0.20 +
        c.scores.productionFeasibility * 0.10 +
        c.scores.originality * 0.10
      );
      c.scores.overall = overall;
      VisualConceptCandidateSchema.parse(c);
    });

    // Sort descending by overall score
    candidates.sort((a, b) => b.scores.overall - a.scores.overall);

    // Automatically mark the highest-scoring candidate as selected
    candidates[0].status = 'selected';
    candidates.slice(1).forEach((c) => (c.status = 'candidate'));

    return {
      briefId,
      candidates,
      selectedConcept: candidates[0],
      generationTimestamp: timestamp,
    };
  }

  /**
   * Manually selects a specific concept candidate by ID.
   */
  public static selectConcept(
    result: ConceptGenerationResult,
    targetConceptId: string
  ): ConceptGenerationResult {
    const updatedCandidates = result.candidates.map((c) => ({
      ...c,
      status: c.id === targetConceptId ? ('selected' as const) : ('candidate' as const),
    }));

    const selected = updatedCandidates.find((c) => c.id === targetConceptId);
    if (!selected) {
      throw new Error(`CONCEPT_NOT_FOUND: Concept candidate with ID "${targetConceptId}" not found.`);
    }

    return {
      ...result,
      candidates: updatedCandidates,
      selectedConcept: selected,
    };
  }
}

