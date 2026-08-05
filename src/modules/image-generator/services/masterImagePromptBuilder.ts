import crypto from 'crypto';
import { VisualIntelligenceBrief } from '../types/visual-intelligence.types';
import { VisualConceptCandidate } from '../types/visual-concept.types';
import { CompositionPlan } from '../types/composition.types';
import { MasterImagePrompt } from '../types/master-image-prompt.types';
import { MasterImagePromptSchema } from '../schemas/master-image-prompt.schema';

export class MasterImagePromptBuilder {
  public static generateFingerprint(promptText: string): string {
    return crypto.createHash('sha256').update(promptText).digest('hex');
  }

  public static buildPrompt(
    brief: VisualIntelligenceBrief,
    concept: VisualConceptCandidate,
    composition: CompositionPlan,
    userRefinement?: string
  ): MasterImagePrompt {
    const subjectSection = `${concept.primarySubject}. ${concept.description}`;
    const environmentSection = `Environment: ${brief.setting}. Background layers: ${composition.layers.background.join(', ')}.`;
    const lightingSection = `Lighting: ${composition.lighting.quality}, ${composition.lighting.direction}.`;
    const colorSection = `Colors: Palette matching ${brief.brandPalette.join(', ')}. ${composition.colors.contrastLevel}.`;
    const platformSection = `Platform framing: Optimized for ${brief.platform} (${brief.aspectRatio} aspect ratio) with safe areas top ${brief.safeAreas.top}px, bottom ${brief.safeAreas.bottom}px.`;

    const baseConstraints = [
      'no watermarks',
      'no text overlay unless specified',
      'no malformed hands or extra fingers',
      'no blurry artifacts',
      'no low-resolution textures',
    ];

    const refinementPart = userRefinement ? ` Additional style instruction: ${userRefinement}.` : '';

    const promptText = `8k resolution photographic masterpiece of ${subjectSection}. ${environmentSection} ${lightingSection} ${colorSection} ${platformSection}${refinementPart} Camera: ${composition.camera.lens}, ${composition.camera.perspective}. Negative constraints: ${baseConstraints.join(', ')}.`;

    const fingerprint = this.generateFingerprint(promptText);
    const id = `mip_${fingerprint.slice(0, 12)}`;

    const masterPrompt: MasterImagePrompt = {
      id,
      briefId: brief.id,
      conceptId: concept.id,
      compositionId: composition.id,
      promptText,
      subject: subjectSection,
      environment: environmentSection,
      lighting: lightingSection,
      color: colorSection,
      platform: platformSection,
      constraints: baseConstraints,
      version: 1,
      fingerprint,
      providerReady: true,
      createdAt: new Date().toISOString(),
    };

    MasterImagePromptSchema.parse(masterPrompt);
    return masterPrompt;
  }
}
