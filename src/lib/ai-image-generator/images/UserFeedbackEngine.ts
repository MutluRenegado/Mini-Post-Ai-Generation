import crypto from 'crypto';
import { UserGenerationFeedback, FeedbackAggregatedPreference } from './user-feedback.types';

export class UserFeedbackEngine {
  public static recordFeedback(input: UserGenerationFeedback): UserGenerationFeedback {
    return {
      ...input,
      timestamp: input.timestamp || new Date().toISOString(),
    };
  }

  public static aggregatePreferences(feedbacks: UserGenerationFeedback[]): FeedbackAggregatedPreference {
    if (!feedbacks || feedbacks.length === 0) {
      return {
        scope: 'user_preference',
        scopeId: 'default_guest',
        preferredStyleGenres: [],
        dislikedConcepts: [],
        averageRelevanceRating: 5.0,
        totalFeedbackCount: 0,
        canonicalStandardsMutated: false,
        deterministicFingerprint: crypto.createHash('sha256').update('empty_feedback').digest('hex'),
      };
    }

    const scope = feedbacks[0].scope;
    const scopeId = feedbacks[0].scopeId;

    let totalRating = 0;
    const dislikedConcepts: string[] = [];

    feedbacks.forEach((f) => {
      totalRating += f.relevanceRating;
      if (f.rejectionReason) {
        dislikedConcepts.push(f.rejectionReason);
      }
    });

    const averageRelevanceRating = Math.round((totalRating / feedbacks.length) * 10) / 10;
    const payload = `${scope}|${scopeId}|${averageRelevanceRating}|${feedbacks.length}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      scope,
      scopeId,
      preferredStyleGenres: ['high_tech_modern', 'editorial_photo'],
      dislikedConcepts: Array.from(new Set(dislikedConcepts)),
      averageRelevanceRating,
      totalFeedbackCount: feedbacks.length,
      canonicalStandardsMutated: false, // Strict protection: Feedback does NOT overwrite canonical standards
      deterministicFingerprint,
    };
  }
}
