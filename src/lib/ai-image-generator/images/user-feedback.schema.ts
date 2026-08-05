import { z } from 'zod';

export const UserGenerationFeedbackSchema = z.object({
  feedbackId: z.string(),
  generationId: z.string(),
  scope: z.enum(['user_preference', 'brand_profile', 'project_session']),
  scopeId: z.string(),
  relevanceRating: z.number().min(1).max(5),
  styleRating: z.number().min(1).max(5),
  compositionRating: z.number().min(1).max(5),
  textAccuracyRating: z.number().min(1).max(5).optional(),
  rejectionReason: z.enum([
    'unrelated_subject',
    'poor_lighting',
    'brand_color_mismatch',
    'malformed_anatomy',
    'text_unreadable',
  ]).optional(),
  userNotes: z.string().optional(),
  regenerationRequested: z.boolean(),
  timestamp: z.string(),
});

export const FeedbackAggregatedPreferenceSchema = z.object({
  scope: z.enum(['user_preference', 'brand_profile', 'project_session']),
  scopeId: z.string(),
  preferredStyleGenres: z.array(z.string()),
  dislikedConcepts: z.array(z.string()),
  averageRelevanceRating: z.number(),
  totalFeedbackCount: z.number(),
  canonicalStandardsMutated: z.literal(false),
  deterministicFingerprint: z.string(),
});
