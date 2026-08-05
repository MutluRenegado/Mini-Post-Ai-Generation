import { RegenerationSession } from './regeneration.types';
import { GeneratedImageQualityResult } from './generated-image-quality.types';
import { ImageMakerLearningRecord, UserImageFeedback } from './image-learning.types';
import { ImageMakerLearningRecordSchema } from './image-learning.schema';

export class ImageMakerLearningService {
  private static recordsStore: ImageMakerLearningRecord[] = [];

  /**
   * Clears internal memory store (useful for testing).
   */
  public static clearStore(): void {
    this.recordsStore = [];
  }

  /**
   * Records a privacy-safe ImageMakerLearningRecord from a completed regeneration session and quality result.
   */
  public static recordSessionOutcome(params: {
    session: RegenerationSession;
    ownerId: string;
    finalQualityResult: GeneratedImageQualityResult;
    platform: string;
    userFeedback?: UserImageFeedback;
    learningContributionAllowed?: boolean;
    templateId?: string;
    brandProfileId?: string;
  }): ImageMakerLearningRecord {
    if (!params || !params.session || !params.ownerId || !params.finalQualityResult) {
      throw new Error('INVALID_LEARNING_INPUT: Session, ownerId, and finalQualityResult are required.');
    }

    const { session, ownerId, finalQualityResult, platform, userFeedback, learningContributionAllowed, templateId, brandProfileId } = params;

    const timestamp = new Date().toISOString();
    const rejectedVersions = session.attempts
      .map((a) => a.responseAsset?.id)
      .filter((id): id is string => !!id && id !== session.selectedImageVersionId);

    const problemCodes = finalQualityResult.detectedProblems.map((p) => p.code);
    const corrections = session.attempts.flatMap((a) => a.correctionsApplied || []);

    const record: ImageMakerLearningRecord = {
      id: `lrn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ownerId,
      postId: session.sourcePostId,

      briefId: session.briefId,
      conceptId: session.conceptId,
      compositionPlanId: session.compositionPlanId,

      promptId: session.currentPromptId,
      promptVersion: session.attempts.length > 0 ? session.attempts[session.attempts.length - 1].prompt.version : 1,

      provider: 'pollinations_ai',
      model: 'FLUX.1-schnell',

      imageAssetId: session.selectedImageVersionId || session.bestImageVersionId || 'asset_unknown',
      imageVersion: session.currentAttempt,

      qualityResultId: finalQualityResult.id,
      qualityScores: {
        overallScore: finalQualityResult.overallScore,
        semanticRelevance: finalQualityResult.scores.semanticRelevance,
        composition: finalQualityResult.scores.composition,
        platformSuitability: finalQualityResult.scores.platformSuitability,
        technicalQuality: finalQualityResult.scores.technicalQuality,
      },
      detectedProblemCodes: problemCodes,

      correctionActions: Array.from(new Set(corrections)),
      regenerationCount: session.currentAttempt,

      selectedVersionId: session.selectedImageVersionId,
      rejectedVersionIds: rejectedVersions,

      userFeedback,

      platform,
      templateId,
      brandProfileId,

      learningContributionAllowed: learningContributionAllowed !== false,

      createdAt: timestamp,
    };

    ImageMakerLearningRecordSchema.parse(record);
    this.recordsStore.push(record);

    return record;
  }

  /**
   * Returns all active learning records for an owner.
   */
  public static getOwnerRecords(ownerId: string): ImageMakerLearningRecord[] {
    return this.recordsStore.filter((r) => r.ownerId === ownerId && !r.deletedAt);
  }

  /**
   * Downstream privacy deletion request handler. Soft-deletes user records.
   */
  public static softDeleteOwnerRecords(ownerId: string): number {
    let deletedCount = 0;
    const now = new Date().toISOString();
    for (const record of this.recordsStore) {
      if (record.ownerId === ownerId && !record.deletedAt) {
        record.deletedAt = now;
        deletedCount += 1;
      }
    }
    return deletedCount;
  }
}
