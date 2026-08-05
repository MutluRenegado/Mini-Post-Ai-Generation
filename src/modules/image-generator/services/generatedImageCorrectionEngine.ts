import crypto from 'crypto';
import { MasterImagePrompt } from '../types/master-image-prompt.types';
import { GeneratedImageQualityResult } from '../types/generated-image-quality.types';
import { PostGenerationCorrectionResult } from '../types/regeneration.types';

export class GeneratedImageCorrectionEngine {
  public static applyPostGenerationCorrections(
    prompt: MasterImagePrompt,
    auditResult: GeneratedImageQualityResult
  ): PostGenerationCorrectionResult {
    const repairsApplied: string[] = [];
    let corrected = false;

    let repairedText = prompt.promptText;
    let repairedConstraints = [...prompt.constraints];

    for (const finding of auditResult.findings) {
      if (finding.code === 'RESOLUTION_LOW') {
        repairedText += ' High resolution 4k detail 8k photo.';
        repairsApplied.push('Appended high-resolution quality tags.');
        corrected = true;
      }
      if (finding.code === 'MIME_UNSUPPORTED') {
        repairedConstraints.push('no unusual image formats');
        repairsApplied.push('Added negative format constraint.');
        corrected = true;
      }
    }

    let repairedPrompt: MasterImagePrompt = { ...prompt };

    if (corrected) {
      const fingerprint = crypto.createHash('sha256').update(repairedText).digest('hex');
      repairedPrompt = {
        ...prompt,
        promptText: repairedText,
        constraints: repairedConstraints,
        version: prompt.version + 1,
        fingerprint,
        providerReady: true,
      };
    }

    return {
      corrected,
      originalPrompt: prompt,
      repairedPrompt,
      repairsApplied,
    };
  }
}
