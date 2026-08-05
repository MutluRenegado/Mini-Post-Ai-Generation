import crypto from 'crypto';
import { VisualIntelligenceBrief } from './visual-intelligence.types';
import { VisualConceptCandidate } from './visual-concept.types';
import { CompositionPlan } from './composition.types';
import { MasterImagePrompt } from './master-image-prompt.types';
import { MasterImagePromptSchema } from './master-image-prompt.schema';
import { SemanticSubjectIntelligence } from './semanticSubjectIntelligence';

export class MasterImagePromptBuilder {
  /**
   * Automatically builds a canonical production-quality MasterImagePrompt from upstream visual intelligence objects.
   * The first section of every prompt explicitly describes who is present, occupations, action, location, objects, and story.
   */
  public static buildPrompt(
    brief: VisualIntelligenceBrief,
    concept: VisualConceptCandidate,
    composition: CompositionPlan,
    options?: { userRefinement?: string; version?: number; providerTarget?: string }
  ): MasterImagePrompt {
    if (!brief || !concept || !composition) {
      throw new Error('INVALID_PROMPT_BUILDER_INPUT: Brief, concept, and composition plan are required.');
    }

    const version = options?.version || 1;
    const userRefinement = options?.userRefinement?.trim() || undefined;
    const providerTarget = options?.providerTarget || 'pollinations_ai';
    const timestamp = new Date().toISOString();

    const semantic = brief.semanticSubject || SemanticSubjectIntelligence.extract(brief.sanitizedSourceSummary || brief.centralMessage, brief.id);

    const primarySubject = concept.primarySubject || brief.primarySubject;
    const supportingSubjects = concept.supportingSubjects || brief.secondarySubjects || [];
    const setting = concept.setting || brief.setting || semantic.environment;
    const action = concept.action || brief.action || semantic.visibleActions[0];

    const peoplePresent = semantic.occupations.join(', ');
    const visibleObjects = semantic.physicalObjects.join(', ');
    const visualStory = brief.centralMessage || `Visual story illustrating ${semantic.domain}`;

    // 1. Structured Sections Construction
    const subjectSection = {
      primary: primarySubject,
      supporting: supportingSubjects,
      action,
      expressionOrState: 'Professional, focused, and inspiring',
    };

    const environmentSection = {
      setting,
      timeOfDay: composition.lighting.timeOfDay || 'Daylight',
      atmosphere: brief.mood || 'Clean, modern, and high-tech',
      weather: 'Clear studio environment',
      contextualDetails: [brief.centralMessage.slice(0, 80), ...supportingSubjects],
    };

    const compositionSection = {
      style: composition.composition.style,
      subjectPosition: composition.cropPlan.focalPointX === 0.5 ? 'Center position' : 'Off-center rule-of-thirds',
      cameraDistance: composition.camera.distance,
      cameraHeight: composition.camera.height,
      cameraAngle: composition.camera.angle,
      lens: composition.camera.lens,
      perspective: composition.camera.perspective,
      framing: `${composition.camera.distance} with ${composition.composition.negativeSpace}`,
      eyeFlow: composition.composition.eyeFlow,
      negativeSpace: composition.composition.negativeSpace,
      foreground: composition.layers.foreground,
      midground: composition.layers.midground,
      background: composition.layers.background,
    };

    const lightingSection = {
      direction: composition.lighting.direction,
      quality: composition.lighting.quality,
      intensity: composition.lighting.intensity,
      colorTemperature: composition.lighting.colorTemperature,
    };

    const colorSection = {
      primaryPalette: composition.colors.primary,
      secondaryPalette: composition.colors.secondary,
      contrastLevel: composition.colors.contrastLevel,
      brandDirection: brief.brandDirection?.personality || 'Modern Premium',
    };

    const styleSection = {
      visualStyle: 'Modern editorial digital photography',
      realismLevel: 'Photorealistic 8K render',
      materialDirection: ['glass', 'brushed aluminum', 'soft ambient surfaces'],
      textureDirection: ['crisp focal detail', 'smooth background gradient'],
      depthOfField: composition.depth.depthOfField,
    };

    const platformSection = {
      name: composition.platform.name,
      aspectRatio: composition.platform.aspectRatio,
      safeAreas: composition.safeAreas,
      cropResilience: composition.platform.cropTolerance,
      textOverlayAllowance: brief.textOverlayAllowance,
    };

    const negativeInstructions = [
      'no text',
      'no watermarks',
      'no logos',
      'no signatures',
      'no malformed hands or fingers',
      'no extra limbs',
      'no blurry subjects',
      'no low resolution artifacts',
      ...brief.negativeConcepts,
      ...semantic.elementsThatMustNeverAppear,
    ];

    const constraintsSection = {
      requiredElements: [primarySubject, setting, ...semantic.elementsThatMustAppear],
      prohibitedElements: Array.from(new Set([...(brief.prohibitedElements || []), ...semantic.elementsThatMustNeverAppear])),
      safetyRestrictions: brief.safetyRestrictions || [],
      negativeInstructions,
    };

    // 2. First portion explicitly describes: who is present, occupations, action, location, objects, visual story
    let generatedPrompt = `Inside ${setting}, ${peoplePresent} actively work and perform ${action} with visible ${visibleObjects}. Visual story: ${visualStory}. ` +
      `Photorealistic 8K render modern editorial photography depicting ${primarySubject}. ` +
      `Framed in a ${compositionSection.style} using a ${compositionSection.lens} with ${compositionSection.cameraDistance} and ${compositionSection.cameraAngle}. ` +
      `Illuminated by ${lightingSection.quality} (${lightingSection.direction}) creating a ${environmentSection.atmosphere} atmosphere. ` +
      `Featuring a color palette of ${colorSection.primaryPalette.join(', ')} with ${colorSection.contrastLevel}. ` +
      `Designed for ${platformSection.name} (${platformSection.aspectRatio} aspect ratio) with ${compositionSection.negativeSpace} for text overlay resilience.`;


    if (generatedPrompt.length > 700) {
      generatedPrompt = `${generatedPrompt.slice(0, 695).trim()}...`;
    }

    if (userRefinement) {
      generatedPrompt = `${generatedPrompt} Additional visual refinement: ${userRefinement}.`;
    }

    const negativePromptText = negativeInstructions.join(', ');

    // 3. Deterministic SHA-256 Fingerprint
    const fpInput = `${brief.id}||${concept.id}||${composition.id}||${generatedPrompt}||v${version}`;
    const fingerprint = crypto.createHash('sha256').update(fpInput).digest('hex');

    const promptId = `mip_${fingerprint.slice(0, 12)}`;
    const conciseSummary = `Master AI Prompt v${version} for ${primarySubject} (${composition.platform.aspectRatio})`;

    const masterPrompt: MasterImagePrompt = {
      id: promptId,
      sourcePostId: brief.sourcePostId,
      briefId: brief.id,
      conceptId: concept.id,
      compositionPlanId: composition.id,

      version,
      providerTarget,

      subject: subjectSection,
      environment: environmentSection,
      composition: compositionSection,
      lighting: lightingSection,
      color: colorSection,
      style: styleSection,
      platform: platformSection,
      constraints: constraintsSection,

      userRefinement,

      promptText: generatedPrompt,
      negativePromptText,
      concisePromptSummary: conciseSummary,

      deterministicFingerprint: fingerprint,
      createdAt: timestamp,
    };

    // 4. Runtime Validation
    MasterImagePromptSchema.parse(masterPrompt);

    return masterPrompt;
  }
}
