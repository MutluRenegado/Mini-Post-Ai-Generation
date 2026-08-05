import { z } from 'zod';

export const ImageMakerLearningRecordSchema = z.object({
  id: z.string().min(1),
  ownerId: z.string().min(1),
  postId: z.string().optional(),
  promptFingerprint: z.string().length(64),
  conceptCategory: z.string().optional(),
  compositionStyle: z.string().optional(),
  qualityScore: z.number().min(0).max(100),
  attemptsCount: z.number().int().positive(),
  userAccepted: z.boolean(),
  userRating: z.number().min(1).max(5).optional(),
  userFeedbackText: z.string().optional(),
  timestamp: z.string(),
});
