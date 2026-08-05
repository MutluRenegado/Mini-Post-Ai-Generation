import { VisualIntelligenceBrief } from '../types/visual-intelligence.types';
import { VisualConceptCandidate } from '../types/visual-concept.types';
import { CompositionPlan, CompositionGenerationResult } from '../types/composition.types';
import { CompositionPlanSchema } from '../schemas/composition.schema';

export class CompositionPlanner {
  public static planComposition(
    brief: VisualIntelligenceBrief,
    concept: VisualConceptCandidate,
    manualCompositionId?: string
  ): CompositionGenerationResult {
    const primaryCandidate: CompositionPlan = {
      id: `cp_cinematic_${brief.fingerprint.slice(0, 8)}`,
      briefId: brief.id,
      conceptId: concept.id,
      status: 'selected',
      camera: {
        distance: 'medium-shot',
        height: 'eye-level',
        angle: 'straight-on',
        lens: '85mm f/1.4 prime lens',
        perspective: 'cinematic 35mm perspective with natural depth of field',
      },
      style: {
        style: 'Modern Editorial Commercial',
        ruleOfThirds: true,
        symmetry: false,
        negativeSpace: '30% left-side negative space for text placement',
        eyeFlow: 'Left to right diagonal sweep',
        balance: 'Asymmetrical balanced weighting',
      },
      layers: {
        foreground: ['Subtle ambient bokeh particles'],
        midground: [concept.primarySubject],
        background: [brief.setting],
      },
      lighting: {
        direction: 'Side key lighting from 45-degree angle',
        quality: 'Soft diffused natural light with subtle rim accent',
        intensity: 'Moderate high-key balance',
        timeOfDay: 'Golden hour twilight',
        colorTemperature: '5500K daylight neutral',
      },
      colors: {
        primary: brief.brandPalette,
        secondary: ['#0F172A', '#F8FAFC'],
        contrastLevel: 'High contrast with deep rich blacks and vibrant highlights',
      },
      depth: {
        depthOfField: 'Shallow depth of field (f/1.8) isolating subject',
        focusTarget: concept.primarySubject,
      },
      safeAreas: brief.safeAreas,
      platformFit: [
        { name: brief.platform, aspectRatio: brief.aspectRatio, cropTolerance: 'High' },
        { name: 'Instagram Story', aspectRatio: '9:16', cropTolerance: 'Medium' },
        { name: 'LinkedIn Feed', aspectRatio: '1.91:1', cropTolerance: 'High' },
      ],
      cropResilience: {
        focalPointX: 0.5,
        focalPointY: 0.4,
        safeCrop: true,
      },
      composition: {
        cameraPerspective: 'cinematic 35mm perspective with natural depth of field',
        cameraLens: '85mm f/1.4 prime lens',
        lighting: 'Soft diffused natural light with subtle rim accent',
        colorPalette: brief.brandPalette,
        eyeFlow: 'Left to right diagonal sweep',
        safeZonePadding: `top:${brief.safeAreas.top}px, bottom:${brief.safeAreas.bottom}px`,
      },
      score: 95,
      plannedAt: new Date().toISOString(),
    };

    const secondaryCandidate: CompositionPlan = {
      ...primaryCandidate,
      id: `cp_minimal_${brief.fingerprint.slice(0, 8)}`,
      status: 'candidate',
      camera: {
        ...primaryCandidate.camera,
        lens: '50mm standard prime',
        perspective: 'Centered symmetry top-down perspective',
      },
      score: 87,
    };

    const candidates = [primaryCandidate, secondaryCandidate];
    let selectedComposition = primaryCandidate;
    let selectedReason = 'Automatically selected highest-scoring cinematic composition plan.';

    if (manualCompositionId) {
      const manual = candidates.find((c) => c.id === manualCompositionId);
      if (manual) {
        selectedComposition = { ...manual, status: 'selected' };
        selectedReason = `User selected composition ${manual.id}.`;
      }
    }

    CompositionPlanSchema.parse(selectedComposition);

    return {
      candidates,
      selectedComposition,
      selectedReason,
    };
  }
}
