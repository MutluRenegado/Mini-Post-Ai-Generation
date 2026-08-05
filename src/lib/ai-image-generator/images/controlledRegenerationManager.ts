import { VisualIntelligenceBrief } from './visual-intelligence.types';
import { VisualConceptCandidate } from './visual-concept.types';
import { CompositionPlan } from './composition.types';
import { MasterImagePrompt } from './master-image-prompt.types';
import { AIProviderRouter } from './aiProviderRouter';
import { GeneratedImageQualityAuditor } from './generatedImageQualityAuditor';
import { GeneratedImageCorrectionEngine } from './generatedImageCorrectionEngine';
import { RegenerationSession, RegenerationAttempt } from './regeneration.types';
import { RegenerationSessionSchema } from './regeneration.schema';

export class ControlledRegenerationManager {
  /**
   * Runs a bounded self-correction regeneration session starting from an initial MasterImagePrompt.
   */
  public static async runRegenerationLoop(
    brief: VisualIntelligenceBrief,
    concept: VisualConceptCandidate,
    composition: CompositionPlan,
    initialPrompt: MasterImagePrompt,
    options?: {
      maxAttempts?: number;
      targetQualityScore?: number;
      ownerId?: string;
      sourcePostId?: string;
      providerOverride?: (request: any) => Promise<any>;
    }
  ): Promise<RegenerationSession> {
    if (!brief || !concept || !composition || !initialPrompt) {
      throw new Error('INVALID_REGENERATION_INPUT: Brief, concept, composition plan, and initial prompt are required.');
    }

    const maxAttempts = options?.maxAttempts || 3;
    const targetQualityScore = options?.targetQualityScore || 80;
    const sessionId = `reg_sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const startedAt = new Date().toISOString();

    const session: RegenerationSession = {
      id: sessionId,
      ownerId: options?.ownerId,
      sourcePostId: options?.sourcePostId || brief.sourcePostId,
      briefId: brief.id,
      conceptId: concept.id,
      compositionPlanId: composition.id,
      initialPromptId: initialPrompt.id,
      currentPromptId: initialPrompt.id,
      attempts: [],
      currentAttempt: 0,
      maxAttempts,
      targetQualityScore,
      status: 'pending',
      startedAt,
    };

    let currentPrompt = initialPrompt;
    let bestScore = -1;

    while (session.currentAttempt < maxAttempts) {
      session.currentAttempt += 1;
      const attemptStart = Date.now();
      session.status = 'generating';

      let aiResponse: any = null;
      try {
        if (options?.providerOverride) {
          aiResponse = await options.providerOverride({ prompt: currentPrompt, aspectRatio: composition.platform.aspectRatio });
        } else {
          aiResponse = await AIProviderRouter.generate({
            prompt: currentPrompt,
            aspectRatio: composition.platform.aspectRatio,
          });
        }
      } catch (err: any) {
        session.status = 'failed';
        session.completedAt = new Date().toISOString();
        return session;
      }

      session.status = 'auditing';
      const auditResult = GeneratedImageQualityAuditor.auditGeneratedImage(
        aiResponse.asset,
        brief,
        concept,
        composition,
        currentPrompt,
        { passThreshold: targetQualityScore }
      );

      const attemptEnd = Date.now();
      const attemptRecord: RegenerationAttempt = {
        attemptNumber: session.currentAttempt,
        prompt: currentPrompt,
        responseAsset: aiResponse.asset,
        auditResult,
        correctionsApplied: [],
        durationMs: attemptEnd - attemptStart,
        timestamp: new Date(attemptStart).toISOString(),
      };

      session.attempts.push(attemptRecord);

      if (auditResult.overallScore > bestScore) {
        bestScore = auditResult.overallScore;
        session.bestImageVersionId = aiResponse.asset.id;
        session.selectedImageVersionId = aiResponse.asset.id;
      }

      // Check Termination Condition 1: Quality Threshold Passed
      if (auditResult.pass) {
        session.status = 'passed';
        session.completedAt = new Date().toISOString();
        RegenerationSessionSchema.parse(session);
        return session;
      }

      // Check Termination Condition 2: Critical Unrepairable Problem
      const hasCriticalProblem = auditResult.detectedProblems.some((p) => p.severity === 'critical');
      if (hasCriticalProblem) {
        session.status = 'blocked';
        session.completedAt = new Date().toISOString();
        RegenerationSessionSchema.parse(session);
        return session;
      }

      // Check Termination Condition 3: Max Attempts Reached
      if (session.currentAttempt >= maxAttempts) {
        session.status = 'failed';
        session.completedAt = new Date().toISOString();
        RegenerationSessionSchema.parse(session);
        return session;
      }

      // Step: Post-Generation Prompt Correction
      session.status = 'repairing';
      const correction = GeneratedImageCorrectionEngine.applyPostGenerationCorrections(currentPrompt, auditResult);
      if (!correction.corrected) {
        session.status = 'failed';
        session.completedAt = new Date().toISOString();
        RegenerationSessionSchema.parse(session);
        return session;
      }

      attemptRecord.correctionsApplied = correction.correctionsApplied;
      currentPrompt = correction.correctedPrompt;
      session.currentPromptId = currentPrompt.id;
    }

    session.status = 'failed';
    session.completedAt = new Date().toISOString();
    RegenerationSessionSchema.parse(session);
    return session;
  }

  /**
   * Cancels a running or pending regeneration session safely.
   */
  public static cancelSession(session: RegenerationSession): RegenerationSession {
    return {
      ...session,
      status: 'cancelled',
      completedAt: new Date().toISOString(),
    };
  }
}
