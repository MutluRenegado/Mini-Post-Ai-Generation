import crypto from 'crypto';
import { PromptSelfHealingResult, PromptRepairAction } from './prompt-self-healing.types';

export class PromptSelfHealingEngine {
  public static repair(input: {
    promptText: string;
    negativePromptText?: string;
    anatomyRiskDetected?: boolean;
    spatialImpossibilityDetected?: boolean;
    excessiveTextDetected?: boolean;
    maxAllowedIterations?: number;
  }): PromptSelfHealingResult {
    const maxAllowedIterations = input.maxAllowedIterations || 3;
    let currentPrompt = input.promptText || '';
    let currentNegativePrompt = input.negativePromptText || '';
    const actionsApplied: PromptRepairAction[] = [];
    let iterationCount = 0;

    // Iteration 1: Anatomy Safeguard Repair
    if (iterationCount < maxAllowedIterations && (input.anatomyRiskDetected || currentPrompt.toLowerCase().includes('6 fingers'))) {
      iterationCount++;
      const beforeSnippet = currentPrompt;
      currentPrompt = currentPrompt.replace(/6 fingers|extra hand|extra fingers/gi, '5 distinct fingers on each hand');
      if (!currentPrompt.includes('5 distinct fingers')) {
        currentPrompt = `${currentPrompt}, 5 distinct fingers on each hand`;
      }

      const mandatoryAnatomyNegatives = 'extra fingers, fused fingers, malformed hands, missing limbs, extra limbs, mutated anatomy';
      if (!currentNegativePrompt.includes('extra fingers')) {
        currentNegativePrompt = currentNegativePrompt ? `${currentNegativePrompt}, ${mandatoryAnatomyNegatives}` : mandatoryAnatomyNegatives;
      }

      actionsApplied.push({
        iteration: iterationCount,
        triggerRule: 'REPAIR_ANATOMY_001',
        issueDescription: 'Removed malformed finger prompt instruction and appended strict anatomy negative prompt constraints',
        beforeSnippet,
        afterSnippet: currentPrompt,
        standardsReference: 'ContentPolicyStandard',
      });
    }

    // Iteration 2: Spatial Impossibility Repair
    if (iterationCount < maxAllowedIterations && (input.spatialImpossibilityDetected || currentPrompt.toLowerCase().includes('floating without support'))) {
      iterationCount++;
      const beforeSnippet = currentPrompt;
      currentPrompt = currentPrompt.replace(/floating without support/gi, 'seated or grounded naturally on floor plane');

      actionsApplied.push({
        iteration: iterationCount,
        triggerRule: 'REPAIR_PHYSICS_001',
        issueDescription: 'Replaced unsupported floating subject instruction with natural surface grounding',
        beforeSnippet,
        afterSnippet: currentPrompt,
        standardsReference: 'ImageStandard',
      });
    }

    // Iteration 3: Excessive Text Overlay Repair
    if (iterationCount < maxAllowedIterations && input.excessiveTextDetected) {
      iterationCount++;
      const beforeSnippet = currentPrompt;
      currentPrompt = `${currentPrompt}, pure photorealistic imagery without embedded text overlay`;

      actionsApplied.push({
        iteration: iterationCount,
        triggerRule: 'REPAIR_TYPOGRAPHY_001',
        issueDescription: 'Applied text-free fallback to avoid unreadable image text overlay',
        beforeSnippet,
        afterSnippet: currentPrompt,
        standardsReference: 'AccessibilityStandard & TypographyStandard',
      });
    }

    const payload = `${currentPrompt}|${currentNegativePrompt}|${iterationCount}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      repairedPromptText: currentPrompt,
      repairedNegativePromptText: currentNegativePrompt,
      iterationCount,
      maxAllowedIterations,
      actionsApplied,
      repairSucceeded: true,
      deterministicFingerprint,
    };
  }
}
