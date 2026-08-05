import { VisualIntelligenceBrief } from './visual-intelligence.types';
import { VisualConceptCandidate } from './visual-concept.types';
import { CompositionPlan, CompositionPlanningResult } from './composition.types';
import { CompositionPlanSchema } from './composition.schema';
import { SemanticSubjectIntelligence } from './semanticSubjectIntelligence';

export class CompositionPlanner {
  /**
   * Generates 3 distinct composition plans (editorial, minimal, cinematic), scores them, and selects the strongest.
   */
  public static planComposition(
    brief: VisualIntelligenceBrief,
    concept: VisualConceptCandidate
  ): CompositionPlanningResult {
    if (!brief || !brief.id || !concept || !concept.id) {
      throw new Error('INVALID_PLANNER_INPUT: VisualIntelligenceBrief and VisualConceptCandidate are required.');
    }

    const timestamp = new Date().toISOString();
    const briefId = brief.id;
    const conceptId = concept.id;

    const brandColors = brief.brandDirection?.palette || brief.colorDirection || ['#00F0FF', '#0F172A', '#38BDF8'];

    const semantic = brief.semanticSubject || SemanticSubjectIntelligence.extract(brief.sanitizedSourceSummary || brief.centralMessage, brief.id);

    const primaryTools = semantic.physicalObjects.slice(0, 2);
    const mainAction = concept.action || semantic.visibleActions[0] || brief.action;
    const environmentSetting = concept.setting || semantic.environment || brief.setting;

    // 1. Editorial Composition Candidate
    const editorialPlan: CompositionPlan = {
      id: `cp_${conceptId}_editorial`,
      briefId,
      conceptId,
      compositionType: 'editorial',
      sceneType: `${semantic.domain.toUpperCase()} Professional Workspace Narrative`,
      focalSubject: concept.primarySubject,
      supportingSubjects: concept.supportingSubjects,

      camera: {
        distance: 'Medium Shot (3-5 meters)',
        height: 'Eye-level (1.5 meters)',
        angle: 'Straight-on 0 degrees',
        lens: '50mm prime portrait lens',
        perspective: 'Natural eye-level perspective',
      },

      composition: {
        style: 'Rule of Thirds',
        ruleOfThirds: true,
        symmetry: false,
        negativeSpace: 'Balanced 30% upper-left negative space',
        eyeFlow: `${concept.primarySubject} -> ${primaryTools[0] || 'workstation tools'} -> Upper-left caption area`,
        balance: 'Asymmetrical dynamic balance',
      },

      layers: {
        foreground: [`Foreground ${primaryTools[0] || 'workstation edge'} soft depth blur`],
        midground: [concept.primarySubject, `actively engaged in ${mainAction}`],
        background: [environmentSetting, 'soft natural studio backdrop'],
      },


      lighting: {
        direction: '45-degree key light from left',
        quality: 'Soft diffused natural light',
        intensity: 'Medium balanced exposure',
        timeOfDay: 'Daylight 10:00 AM',
        colorTemperature: '5500K Daylight White',
      },

      colors: {
        primary: brandColors.slice(0, 2),
        secondary: [brandColors[2] || '#38BDF8', '#FFFFFF'],
        contrastLevel: 'Medium contrast',
      },

      depth: {
        depthOfField: 'Shallow f/2.8 depth of field',
        focusTarget: concept.primarySubject,
      },

      safeAreas: {
        top: brief.safeAreas.top || 20,
        bottom: brief.safeAreas.bottom || 20,
        left: brief.safeAreas.left || 20,
        right: brief.safeAreas.right || 20,
      },

      platform: {
        name: brief.platform,
        aspectRatio: brief.aspectRatio,
        cropTolerance: 'High resilience (+/- 15% crop margin)',
      },

      cropPlan: {
        focalPointX: 0.5,
        focalPointY: 0.45,
        safeCrop: true,
      },

      scores: {
        semanticRelevance: 92,
        visualClarity: 94,
        brandCompatibility: 90,
        platformCompatibility: 95,
        productionFeasibility: 92,
        cropResilience: 90,
        typographyFriendliness: 88,
        visualHierarchy: 92,
        overall: 91,
      },

      qualityNotes: ['Strong eye flow and natural subject separation'],
      riskFlags: [],
      status: 'candidate',
      createdAt: timestamp,
    };

    // 2. Minimal Composition Candidate
    const minimalPlan: CompositionPlan = {
      id: `cp_${conceptId}_minimal`,
      briefId,
      conceptId,
      compositionType: 'minimal',
      sceneType: 'Symmetrical Minimalist Studio',
      focalSubject: concept.primarySubject,
      supportingSubjects: concept.supportingSubjects,

      camera: {
        distance: 'Medium-Full Shot (4 meters)',
        height: 'Center-level (1.4 meters)',
        angle: 'Direct centered alignment',
        lens: '85mm focal lens',
        perspective: 'Orthographic clean perspective',
      },

      composition: {
        style: 'Centered Minimalist',
        ruleOfThirds: false,
        symmetry: true,
        negativeSpace: 'Generous 50% surrounding negative space for text overlay',
        eyeFlow: `Central ${concept.primarySubject} -> Surrounding clean negative space`,
        balance: 'Symmetrical central balance',
      },

      layers: {
        foreground: [],
        midground: [concept.primarySubject],
        background: ['Seamless solid studio gradient backdrop'],
      },

      lighting: {
        direction: 'Top-down overhead softbox',
        quality: 'Ultra-soft shadowless lighting',
        intensity: 'Even studio illumination',
        timeOfDay: 'Indoor Studio',
        colorTemperature: '6000K Cool Studio White',
      },

      colors: {
        primary: [brandColors[0] || '#00F0FF'],
        secondary: ['#0F172A', '#1E293B'],
        contrastLevel: 'High crisp contrast',
      },

      depth: {
        depthOfField: 'Deep f/8.0 crisp focus',
        focusTarget: concept.primarySubject,
      },

      safeAreas: {
        top: brief.safeAreas.top || 30,
        bottom: brief.safeAreas.bottom || 30,
        left: brief.safeAreas.left || 30,
        right: brief.safeAreas.right || 30,
      },

      platform: {
        name: brief.platform,
        aspectRatio: brief.aspectRatio,
        cropTolerance: 'Maximum resilience (+/- 25% crop margin)',
      },

      cropPlan: {
        focalPointX: 0.5,
        focalPointY: 0.5,
        safeCrop: true,
      },

      scores: {
        semanticRelevance: 88,
        visualClarity: 96,
        brandCompatibility: 94,
        platformCompatibility: 96,
        productionFeasibility: 95,
        cropResilience: 96,
        typographyFriendliness: 98,
        visualHierarchy: 95,
        overall: 94,
      },

      qualityNotes: ['Outstanding typography space and crop resilience'],
      riskFlags: [],
      status: 'candidate',
      createdAt: timestamp,
    };

    // 3. Cinematic Composition Candidate
    const cinematicPlan: CompositionPlan = {
      id: `cp_${conceptId}_cinematic`,
      briefId,
      conceptId,
      compositionType: 'cinematic',
      sceneType: 'Low-Angle Hero Shot',
      focalSubject: concept.primarySubject,
      supportingSubjects: concept.supportingSubjects,

      camera: {
        distance: 'Close-Up Hero Shot (1.5 meters)',
        height: 'Low-angle (0.8 meters)',
        angle: '15-degree low upward tilt',
        lens: '35mm wide-angle anamorphic lens',
        perspective: 'Dynamic wide perspective',
      },

      composition: {
        style: 'Dynamic Cinematic',
        ruleOfThirds: true,
        symmetry: false,
        negativeSpace: '25% upper dark sky/ceiling negative space',
        eyeFlow: `Low-angle ${concept.primarySubject} -> Anamorphic light streak -> Upper space`,
        balance: 'Dynamic diagonal balance',
      },

      layers: {
        foreground: ['Foreground light streak flare'],
        midground: [concept.primarySubject],
        background: ['Deep blurred architectural backdrop with neon accents'],
      },

      lighting: {
        direction: 'Low side rim light with cyan fill',
        quality: 'Dramatic high-key cinematic contrast',
        intensity: 'Strong rim & key contrast',
        timeOfDay: 'Twilight / Golden Hour',
        colorTemperature: '3200K Warm Tungsten & 6500K Cool Rim',
      },

      colors: {
        primary: brandColors,
        secondary: ['#0284C7', '#0F172A'],
        contrastLevel: 'High dramatic contrast',
      },

      depth: {
        depthOfField: 'Ultra-shallow f/1.4 anamorphic bokeh',
        focusTarget: concept.primarySubject,
      },

      safeAreas: {
        top: brief.safeAreas.top || 20,
        bottom: brief.safeAreas.bottom || 20,
        left: brief.safeAreas.left || 20,
        right: brief.safeAreas.right || 20,
      },

      platform: {
        name: brief.platform,
        aspectRatio: brief.aspectRatio,
        cropTolerance: 'Moderate crop resilience (+/- 10%)',
      },

      cropPlan: {
        focalPointX: 0.5,
        focalPointY: 0.4,
        safeCrop: true,
      },

      scores: {
        semanticRelevance: 86,
        visualClarity: 90,
        brandCompatibility: 90,
        platformCompatibility: 88,
        productionFeasibility: 85,
        cropResilience: 82,
        typographyFriendliness: 84,
        visualHierarchy: 90,
        overall: 87,
      },

      qualityNotes: ['Dramatic visual impact and cinematic depth'],
      riskFlags: ['Tighter crop margin'],
      status: 'candidate',
      createdAt: timestamp,
    };

    const candidates = [editorialPlan, minimalPlan, cinematicPlan];

    // Compute overall scores deterministically & validate Zod schemas
    candidates.forEach((c) => {
      const overall = Math.round(
        c.scores.semanticRelevance * 0.25 +
        c.scores.visualClarity * 0.15 +
        c.scores.brandCompatibility * 0.15 +
        c.scores.platformCompatibility * 0.15 +
        c.scores.productionFeasibility * 0.10 +
        c.scores.cropResilience * 0.10 +
        c.scores.typographyFriendliness * 0.10
      );
      c.scores.overall = overall;
      CompositionPlanSchema.parse(c);
    });

    // Sort candidates descending by overall score
    candidates.sort((a, b) => b.scores.overall - a.scores.overall);

    // Automatically mark the highest-scoring composition as selected
    candidates[0].status = 'selected';
    candidates.slice(1).forEach((c) => (c.status = 'candidate'));

    return {
      briefId,
      conceptId,
      candidates,
      selectedComposition: candidates[0],
      generationTimestamp: timestamp,
    };
  }

  /**
   * Manually selects a specific composition candidate by ID.
   */
  public static selectComposition(
    result: CompositionPlanningResult,
    targetCompositionId: string
  ): CompositionPlanningResult {
    const updatedCandidates = result.candidates.map((c) => ({
      ...c,
      status: c.id === targetCompositionId ? ('selected' as const) : ('candidate' as const),
    }));

    const selected = updatedCandidates.find((c) => c.id === targetCompositionId);
    if (!selected) {
      throw new Error(`COMPOSITION_NOT_FOUND: Composition candidate with ID "${targetCompositionId}" not found.`);
    }

    return {
      ...result,
      candidates: updatedCandidates,
      selectedComposition: selected,
    };
  }
}
