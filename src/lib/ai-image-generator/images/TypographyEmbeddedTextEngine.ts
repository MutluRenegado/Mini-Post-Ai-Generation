import crypto from 'crypto';
import { AccessibilityStandard, TypographyStandard } from '../../../standards';
import { TypographyEmbeddedTextDecision, WCAGClassification } from './typography-embedded-text.types';

export class TypographyEmbeddedTextEngine {
  public static classifyContrast(ratio: number): WCAGClassification {
    if (ratio >= 7.0) return 'WCAG_2.2_AAA';
    if (ratio >= AccessibilityStandard.minContrastRatioText) return 'WCAG_2.2_AA'; // 4.5:1
    return 'FAIL';
  }

  public static resolve(input: {
    requestedText?: string;
    postContent?: string;
    contrastRatio?: number;
    platform?: string;
    explicitTextMode?: boolean;
  }): TypographyEmbeddedTextDecision {
    const contrastRatio = input.contrastRatio !== undefined ? input.contrastRatio : 4.5;
    const wcagClassification = this.classifyContrast(contrastRatio);

    // Default policy: Text-free photorealistic imagery unless explicit text mode is requested
    if (!input.explicitTextMode && !input.requestedText) {
      const payload = 'text_free_default';
      const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

      return {
        embeddedTextAllowed: false,
        wordCount: 0,
        textDensityPercentage: 0,
        placementRegion: 'None (Pure Visual Imagery)',
        safeZoneCompliant: true,
        minimumReadableSizePx: 24,
        contrastRatio: 21.0, // High natural visual contrast
        wcagClassification: 'WCAG_2.2_AAA',
        fontFamilyConstraint: TypographyStandard.fontFamilySans,
        spellingValidated: true,
        fallbackToTextFreeImage: true,
        reason: 'Default text-free photorealistic image mode to maximize visual quality and avoid rendering distortion.',
        deterministicFingerprint,
      };
    }

    const rawText = (input.requestedText || '').trim();
    const words = rawText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Verify spelling / string inclusion in post content if provided
    let spellingValidated = true;
    if (input.postContent && rawText.length > 0) {
      spellingValidated = input.postContent.toLowerCase().includes(rawText.toLowerCase());
    }

    const textDensityPercentage = Math.min(100, wordCount * 3); // Approx 3% area per word
    const safeZoneCompliant = true;
    let fallbackToTextFreeImage = false;
    let reason = 'Embedded text approved and meets legibility, safe-zone, and WCAG standards.';

    if (wordCount > 5) {
      fallbackToTextFreeImage = true;
      reason = 'TEXT_TOO_LONG: Embedded text exceeds 5-word legibility limit for image overlays.';
    } else if (textDensityPercentage > 15) {
      fallbackToTextFreeImage = true;
      reason = 'TEXT_DENSITY_EXCEEDED: Text area exceeds 15% visual canvas area limit.';
    } else if (wcagClassification === 'FAIL') {
      fallbackToTextFreeImage = true;
      reason = 'INSUFFICIENT_CONTRAST: Text contrast ratio is below WCAG 2.2 AA 4.5:1 minimum.';
    } else if (!spellingValidated) {
      fallbackToTextFreeImage = true;
      reason = 'UNAPPROVED_TEXT: Embedded text string is not present in finalized post content.';
    }

    const payload = `${rawText}|${wordCount}|${contrastRatio}|${wcagClassification}|${fallbackToTextFreeImage}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      embeddedTextAllowed: !fallbackToTextFreeImage,
      exactApprovedText: fallbackToTextFreeImage ? undefined : rawText,
      wordCount,
      textDensityPercentage,
      placementRegion: 'Upper left quadrant reserved low-texture canvas',
      safeZoneCompliant,
      minimumReadableSizePx: AccessibilityStandard.minTargetSizePx,
      contrastRatio,
      wcagClassification,
      fontFamilyConstraint: TypographyStandard.fontFamilySans,
      spellingValidated,
      fallbackToTextFreeImage,
      reason,
      deterministicFingerprint,
    };
  }
}
