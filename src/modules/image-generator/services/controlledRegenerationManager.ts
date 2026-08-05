import { MasterImagePrompt } from '../types/master-image-prompt.types';
import { RegenerationSession, RegenerationAttempt } from '../types/regeneration.types';
import { AIProviderRouter } from '../providers/aiProviderRouter';
import { GeneratedImageQualityAuditor } from './generatedImageQualityAuditor';
import { GeneratedImageCorrectionEngine } from './generatedImageCorrectionEngine';

export class ControlledRegenerationManager {
  public static async runRegenerationLoop(
    initialPrompt: MasterImagePrompt,
    maxAttempts = 3
  ): Promise<RegenerationSession> {
    const sessionId = `rgn_sess_${Date.now()}`;
    const attempts: RegenerationAttempt[] = [];
    let currentPrompt = initialPrompt;
    let status: RegenerationSession['status'] = 'failed';
    let bestAttempt: RegenerationAttempt | undefined;

    for (let attemptNum = 1; attemptNum <= maxAttempts; attemptNum++) {
      try {
        const response = await AIProviderRouter.generate(currentPrompt);
        const auditResult = GeneratedImageQualityAuditor.auditGeneratedImage(response);

        const attempt: RegenerationAttempt = {
          attemptNumber: attemptNum,
          prompt: currentPrompt,
          response,
          auditResult,
          status: auditResult.passed ? 'passed' : 'failed',
          timestamp: new Date().toISOString(),
        };

        attempts.push(attempt);

        if (!bestAttempt || (auditResult.score > (bestAttempt.auditResult?.score || 0))) {
          bestAttempt = attempt;
        }

        if (auditResult.passed) {
          status = 'passed';
          break;
        }

        // Apply post-gen corrections for next attempt
        const correction = GeneratedImageCorrectionEngine.applyPostGenerationCorrections(currentPrompt, auditResult);
        if (correction.corrected) {
          currentPrompt = correction.repairedPrompt;
          attempt.repairedPrompt = currentPrompt;
        } else {
          break; // Cannot repair further
        }
      } catch (err: any) {
        attempts.push({
          attemptNumber: attemptNum,
          prompt: currentPrompt,
          status: 'error',
          timestamp: new Date().toISOString(),
        });
        break;
      }
    }

    if (status !== 'passed' && attempts.length >= maxAttempts) {
      status = 'max_attempts_exceeded';
    }

    return {
      sessionId,
      maxAttempts,
      attempts,
      status,
      bestAttempt,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
  }
}
