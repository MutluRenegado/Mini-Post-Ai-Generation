export type FeedbackScope = 'user_preference' | 'brand_profile' | 'project_session';

export interface UserGenerationFeedback {
  feedbackId: string;
  generationId: string;
  scope: FeedbackScope;
  scopeId: string; // userId, brandId, or projectId
  relevanceRating: number; // 1 to 5
  styleRating: number; // 1 to 5
  compositionRating: number; // 1 to 5
  textAccuracyRating?: number; // 1 to 5
  rejectionReason?: 'unrelated_subject' | 'poor_lighting' | 'brand_color_mismatch' | 'malformed_anatomy' | 'text_unreadable';
  userNotes?: string;
  regenerationRequested: boolean;
  timestamp: string;
}

export interface FeedbackAggregatedPreference {
  scope: FeedbackScope;
  scopeId: string;
  preferredStyleGenres: string[];
  dislikedConcepts: string[];
  averageRelevanceRating: number;
  totalFeedbackCount: number;
  canonicalStandardsMutated: false; // Explicit guarantee: Standards are never mutated
  deterministicFingerprint: string;
}
