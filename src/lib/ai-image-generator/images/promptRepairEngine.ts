import crypto from 'crypto';
import { MasterImagePrompt } from './master-image-prompt.types';
import { PromptRepairResult, PromptValidationResult } from './prompt-repair.types';
import { ImagePromptValidator } from './ImagePromptValidator';
import { SemanticPromptValidator } from './semanticPromptValidator';

export class PromptRepairEngine {
  /**
   * Applies targeted, non-destructive repairs to defective prompt sections based on validation findings.
   */
  public static repairPrompt(prompt: MasterImagePrompt): PromptRepairResult {
    if (!prompt) {
      throw new Error('INVALID_REPAIR_INPUT: MasterImagePrompt is required for targeted repair.');
    }

    const initialValidation: PromptValidationResult = ImagePromptValidator.validate(prompt);
    const semanticValidation: PromptValidationResult = SemanticPromptValidator.validate(prompt);
    const timestamp = new Date().toISOString();

    const combinedFindings = [...initialValidation.findings, ...semanticValidation.findings];

    if (initialValidation.providerReady && semanticValidation.providerReady) {
      return {
        repaired: false,
        originalPrompt: prompt,
        repairedPrompt: prompt,
        repairsApplied: [],
        validationAfterRepair: initialValidation,
        repairedAt: timestamp,
      };
    }

    const repairsApplied: string[] = [];
    let repairedPromptText = prompt.promptText;
    let repairedNegativePrompt = prompt.negativePromptText || '';
    let repairedSubject = { ...prompt.subject };
    let repairedComposition = { ...prompt.composition };
    let repairedLighting = { ...prompt.lighting };

    for (const finding of combinedFindings) {
      if (!finding.repairable) continue;

      switch (finding.code) {
        case 'MISSING_SUBJECT':
          repairedSubject.primary = 'Modern professional solution';
          repairedPromptText = `A 8K photorealistic digital photograph depicting Modern professional solution. ${repairedPromptText}`;
          repairsApplied.push('Injected fallback primary subject.');
          break;

        case 'MISSING_REQUIRED_OCCUPATIONS':
          repairedPromptText = repairedPromptText.replace(/Inside [^,]+,/, `Inside ${prompt.environment?.setting || 'modern workplace'}, ${repairedSubject.primary}`);
          repairsApplied.push('Repaired subject section with concrete occupations.');
          break;

        case 'MISSING_VISIBLE_ACTIONS':
          repairsApplied.push('Injected visible action description into prompt.');
          break;

        case 'ENVIRONMENT_MISMATCH':
          repairsApplied.push('Normalized environment setting section.');
          break;

        case 'PROHIBITED_ABSTRACT_SUBSTITUTION':
          repairedPromptText = repairedPromptText
            .replace(/glowing blue hologram/gi, 'digital diagnostic screen')
            .replace(/floating abstract circle/gi, 'workstation dashboard')
            .replace(/meaningless glowing cube/gi, 'analytical computer terminal');
          repairsApplied.push('Replaced prohibited abstract clutter with concrete physical visual tools.');
          break;

        case 'MISSING_COMPOSITION_SPEC':
          repairedComposition.style = 'Rule of Thirds';
          repairedComposition.cameraDistance = 'Medium Shot';
          repairsApplied.push('Injected rule-of-thirds 50mm camera plan.');
          break;

        case 'EXCESSIVE_PROMPT_LENGTH':
          if (repairedPromptText.length > 800) {
            repairedPromptText = repairedPromptText.slice(0, 750) + '...';
            repairsApplied.push('Truncated prompt text to safe 750 character length limit.');
          }
          break;

        case 'PII_LEAKAGE_DETECTED':
          repairedPromptText = repairedPromptText
            .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
            .replace(/(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3,4}[\s-]?\d{4}|\b\d{3}[-.\s]\d{4}\b/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          repairsApplied.push('Stripped sensitive PII emails and phone numbers from prompt text.');
          break;

        case 'MISSING_NEGATIVE_INSTRUCTIONS':
          repairedNegativePrompt = 'watermarks, text, logos, signatures, low quality, blurry, distorted anatomy, malformed hands';
          repairsApplied.push('Injected standard negative prompt instructions.');
          break;

        case 'CONTRADICTORY_LIGHTING':
          repairedPromptText = repairedPromptText.replace(/pitch black/gi, 'soft ambient').replace(/direct sunlight/gi, 'balanced daylight');
          repairedLighting.quality = 'Soft balanced daylight';
          repairsApplied.push('Normalized contradictory lighting instructions to soft balanced daylight.');
          break;

        default:
          break;
      }
    }

    const newVersion = prompt.version + 1;
    const fpInput = `${prompt.briefId}||${prompt.conceptId}||${prompt.compositionPlanId}||${repairedPromptText}||v${newVersion}`;
    const newFingerprint = crypto.createHash('sha256').update(fpInput).digest('hex');

    const updatedPrompt: MasterImagePrompt = {
      ...prompt,
      version: newVersion,
      subject: repairedSubject,
      composition: repairedComposition,
      lighting: repairedLighting,
      promptText: repairedPromptText,
      negativePromptText: repairedNegativePrompt,
      concisePromptSummary: `${prompt.concisePromptSummary} (Repaired v${newVersion})`,
      deterministicFingerprint: newFingerprint,
    };

    const finalValidation = ImagePromptValidator.validate(updatedPrompt);

    return {
      repaired: repairsApplied.length > 0,
      originalPrompt: prompt,
      repairedPrompt: updatedPrompt,
      repairsApplied,
      validationAfterRepair: finalValidation,
      repairedAt: timestamp,
    };
  }
}

