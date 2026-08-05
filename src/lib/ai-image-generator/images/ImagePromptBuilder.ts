import { ImageRecreationRequest, PostVisualBrief, VisualIntent } from './image.types';
import { PostVisualBriefExtractor } from './PostVisualBriefExtractor';

/**
 * @deprecated Backwards Compatibility Layer
 * Replaced by MasterImageOrchestrator prompt synthesis (Levels 32–50).
 */
export class ImagePromptBuilder {
  /**
   * Constructs a provider-ready image prompt strictly from VisualIntent and PostVisualBrief.
   * Does NOT invent new semantic subjects, objects, or people.
   */
  static buildFromIntent(intent: VisualIntent, brief: PostVisualBrief): string {
    const defaultNegativeConstraints = [
      'no dark empty office',
      'no low-light control room',
      'no generic corporate stock photo',
      'no meaningless computer monitors',
      'no black-dominant composition',
      'no desaturated grey palette',
      'no empty workspace',
      'no unrelated scenery',
      'no floating holograms',
      'no outdated technology',
      'no clichéd handshake',
      'no generic luxury aesthetic',
      'no illegible text',
      'no watermarks',
      'no logos',
      'no distorted hands',
      'no duplicated people',
      'no visual clutter',
      'no weak focal subject',
    ];

    if (!intent.peopleRequired) {
      defaultNegativeConstraints.push('no people in frame', 'no human models', 'no faces');
    }

    const negativePromptStr = Array.from(
      new Set([
        ...defaultNegativeConstraints,
        ...(intent.prohibitedElements || []),
        ...(brief.negativeConstraints || []),
      ])
    ).join(', ');

    const peopleLine = intent.peopleRequired && intent.peopleDescription
      ? `People Subject: ${intent.peopleDescription}.`
      : 'Human Subject Policy: No human subjects required in scene composition.';

    const parts = [
      `[Platform: ${brief.platform} | Target Crop: ${brief.aspectRatio} | Format: ${intent.visualFormat} | Realism: ${intent.realismLevel}]`,
      `[Style: ${intent.platformStyle} | Lighting: ${intent.lighting}]`,
      `Primary Dominant Subject: ${intent.primarySubject}.`,
      `Scene Description: ${intent.sceneDescription}.`,
      `Visual Narrative: ${intent.visualNarrative}.`,
      peopleLine,
      `Supporting Objects: ${intent.keyObjects.slice(0, 5).join(', ')}.`,
      `Background Environment (Subordinate): ${intent.environment}.`,
      `Composition Architecture: ${intent.composition}, camera angle: ${intent.cameraAngle}.`,
      `Lighting Direction: ${intent.lighting}.`,
      `Vibrant Palette: ${brief.colorDirection}.`,
      `Brand Accents: ${((brief.brandColors && brief.brandColors.length > 0) ? brief.brandColors : ['#08C9FF', '#FFB020']).join(', ')}.`,
      `Negative Constraints: ${negativePromptStr}.`,
      `Quality Specification: Ultra-detailed 8K resolution, ${intent.realismLevel} ${intent.visualFormat}, sharp focal clarity, no text, no watermark, no logos, no UI, no icons unless explicitly required.`,
    ];

    return parts.join(' ');
  }

  /**
   * Constructs a structured, photographic & editorial provider prompt EXCLUSIVELY from a PostVisualBrief.
   */
  static buildPromptFromBrief(brief: PostVisualBrief): string {
    const defaultNegativeConstraints = [
      'no dark empty office',
      'no low-light control room',
      'no generic corporate stock photo',
      'no meaningless computer monitors',
      'no black-dominant composition',
      'no desaturated grey palette',
      'no empty workspace',
      'no unrelated scenery',
      'no random people',
      'no floating holograms',
      'no outdated technology',
      'no clichéd handshake',
      'no generic luxury aesthetic',
      'no illegible text',
      'no watermarks',
      'no logos',
      'no distorted hands',
      'no duplicated people',
      'no visual clutter',
      'no weak focal subject',
    ];

    const negativePromptStr = Array.from(
      new Set([...defaultNegativeConstraints, ...(brief.negativeConstraints || [])])
    ).join(', ');

    const styleName = brief.visualStyle || 'colourful-professional';

    const parts = [
      `[Platform: ${brief.platform} | Target Crop: ${brief.aspectRatio} | Safe Zone: Mobile Center Safe]`,
      `[Style: ${styleName} | Aesthetic: Ultra-realistic Photorealistic Modern Editorial | Lighting: Natural Studio Daylight]`,
      `[Communication Goal: ${brief.communicationGoal}]`,
      `[Reader Intent: ${brief.readerIntent || 'Instant visual understanding within one second'}]`,
      `Primary Focal Subject: ${brief.mainSubject}.`,
      `Visible Action: ${brief.actionOrSituation}.`,
      `Supporting Objects: ${brief.supportingSubjects.concat(brief.keyObjects).slice(0, 5).join(', ')}.`,
      `Background Environment (Background Only): ${brief.environment}.`,
      `Visual Story: ${brief.visualStory || 'Human focal subjects actively communicating post core message'}.`,
      `Contemporary Composition: ${brief.composition}, ${brief.framing}, rule of thirds with clear subject isolation and layered depth.`,
      `Bright Lighting: ${brief.lighting}.`,
      `Vibrant Palette: ${brief.colorDirection}.`,
      `Social Shareability: High contrast, instant visual clarity within one second, premium publication aesthetic.`,
      `Brand Integration: Accent colors ${((brief.brandColors && brief.brandColors.length > 0) ? brief.brandColors : ['#08C9FF', '#FFB020']).join(', ')} in a bright, clean, high-contrast setting.`,
      `Negative Constraints: ${negativePromptStr}, background environment must not dominate, no warehouse corridor as main subject, no empty logistics hall, no empty server room, no random shipping containers as main focus.`,
      `Quality Specification: Ultra-detailed 8K resolution, photorealistic commercial editorial photography, sharp focal clarity, no text, no watermark, no logos, no UI, no icons unless explicitly required.`,
    ];

    return parts.join(' ');
  }

  /**
   * Constructs a structured prompt from an ImageRecreationRequest.
   * Enforces extracting a PostVisualBrief from final approved post text first.
   */
  static buildPrompt(req: ImageRecreationRequest): string {
    const brief = PostVisualBriefExtractor.extract(req);
    let prompt = this.buildPromptFromBrief(brief);

    if (req.operation === 'recreate') {
      if (req.originalImagePrompt) {
        prompt += ` [Recreate visual based on original concept: ${req.originalImagePrompt}]`;
      }
      if (req.recreationInstructions) {
        prompt += ` [Recreation Instructions: ${req.recreationInstructions}]`;
      }
    }

    return prompt;
  }
}
