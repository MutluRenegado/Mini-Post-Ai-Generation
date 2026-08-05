import crypto from 'crypto';
import { MasterImagePrompt } from './master-image-prompt.types';
import { GeneratedImageQualityResult } from './generated-image-quality.types';
import { PostGenerationCorrectionResult } from './regeneration.types';
import { ImagePromptValidator } from './ImagePromptValidator';

export class GeneratedImageCorrectionEngine {
  /**
   * Translates verified post-generation image quality audit recommendations into targeted prompt section repairs.
   */
  public static applyPostGenerationCorrections(
    prompt: MasterImagePrompt,
    auditResult: GeneratedImageQualityResult
  ): PostGenerationCorrectionResult {
    if (!prompt || !auditResult) {
      throw new Error('INVALID_CORRECTION_INPUT: MasterImagePrompt and GeneratedImageQualityResult are required.');
    }

    if (auditResult.pass && auditResult.correctionRecommendations.length === 0) {
      return {
        corrected: false,
        originalPrompt: prompt,
        correctedPrompt: prompt,
        correctionsApplied: [],
        targetProblemsAddressed: [],
      };
    }

    const correctionsApplied: string[] = [];
    const targetProblemsAddressed: string[] = [];

    let updatedPromptText = prompt.promptText;
    let updatedConstraints = { ...prompt.constraints };
    let updatedSubject = { ...prompt.subject };
    let updatedPlatform = { ...prompt.platform };
    let updatedColor = { ...prompt.color };

    for (const rec of auditResult.correctionRecommendations) {
      targetProblemsAddressed.push(rec.problemCode);

      switch (rec.problemCode) {
        case 'LOW_RESOLUTION':
          updatedPlatform.cropResilience = 'Strict high-resolution bounds (1080p minimum)';
          updatedPromptText = `${updatedPromptText} Rendered in ultra-crisp 8K high resolution with sharp focal detail.`;
          correctionsApplied.push('Enforced high-resolution rendering bounds.');
          break;

        case 'ASPECT_RATIO_MISMATCH':
          updatedPromptText = updatedPromptText.replace(/aspect ratio/gi, `exact ${prompt.platform.aspectRatio} aspect ratio`);
          correctionsApplied.push(`Constrained prompt text to exact ${prompt.platform.aspectRatio} aspect ratio.`);
          break;

        case 'SUBJECT_PROMINENCE_MISMATCH':
          updatedSubject.expressionOrState = 'Prominent hero focus, centered, clear subject isolation';
          updatedPromptText = `Hero shot featuring ${updatedSubject.primary} in sharp focus. ${updatedPromptText}`;
          correctionsApplied.push('Enhanced primary subject prominence and hero-shot framing.');
          break;

        case 'BRAND_COLOR_DILUTION':
          if (prompt.color.primaryPalette.length > 0) {
            const brandColor = prompt.color.primaryPalette[0];
            updatedColor.brandDirection = `Dominant brand color theme incorporating ${brandColor}`;
            updatedPromptText = `${updatedPromptText} Featuring dominant brand color accent (${brandColor}).`;
            correctionsApplied.push(`Injected dominant brand color accent (${brandColor}).`);
          }
          break;

        default:
          updatedPromptText = `${updatedPromptText} Refinement instruction: ${rec.recommendedInstruction}`;
          correctionsApplied.push(`Applied recommendation: ${rec.recommendedInstruction}`);
          break;
      }
    }

    const newVersion = prompt.version + 1;
    const fpInput = `${prompt.briefId}||${prompt.conceptId}||${prompt.compositionPlanId}||${updatedPromptText}||v${newVersion}`;
    const newFingerprint = crypto.createHash('sha256').update(fpInput).digest('hex');

    const correctedPrompt: MasterImagePrompt = {
      ...prompt,
      version: newVersion,
      subject: updatedSubject,
      platform: updatedPlatform,
      color: updatedColor,
      constraints: updatedConstraints,
      promptText: updatedPromptText,
      concisePromptSummary: `${prompt.concisePromptSummary} (Post-Gen Repaired v${newVersion})`,
      deterministicFingerprint: newFingerprint,
    };

    // Ensure corrected prompt remains structurally valid
    ImagePromptValidator.validate(correctedPrompt);

    return {
      corrected: correctionsApplied.length > 0,
      originalPrompt: prompt,
      correctedPrompt,
      correctionsApplied,
      targetProblemsAddressed,
    };
  }
}
