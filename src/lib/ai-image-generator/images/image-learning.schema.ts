import { z } from 'zod';

export const UserImageFeedbackSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  relevant: z.boolean().optional(),
  styleMatch: z.boolean().optional(),
  compositionMatch: z.boolean().optional(),
  problemCodes: z.array(z.string()).optional(),
  comment: z.string().optional(),
});

export const ImageMakerLearningRecordSchema = z.object({
  id: z.string().min(1),

  ownerId: z.string().min(1),
  postId: z.string().optional(),
  campaignId: z.string().optional(),

  briefId: z.string().min(1),
  conceptId: z.string().min(1),
  compositionPlanId: z.string().min(1),

  promptId: z.string().min(1),
  promptVersion: z.number().min(1),

  provider: z.string().min(1),
  model: z.string().min(1),

  imageAssetId: z.string().min(1),
  imageVersion: z.number().min(1),

  qualityResultId: z.string().min(1),
  qualityScores: z.record(z.string(), z.number()),
  detectedProblemCodes: z.array(z.string()),

  correctionActions: z.array(z.string()),
  regenerationCount: z.number().min(0),

  selectedVersionId: z.string().optional(),
  rejectedVersionIds: z.array(z.string()),

  userFeedback: UserImageFeedbackSchema.optional(),

  platform: z.string().min(1),
  templateId: z.string().optional(),
  brandProfileId: z.string().optional(),

  learningContributionAllowed: z.boolean(),

  createdAt: z.string().min(1),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
});

export const OptimizationMetricsSchema = z.object({
  totalRecords: z.number().min(0),
  averageQualityScore: z.number().min(0).max(100),
  passRatePercentage: z.number().min(0).max(100),
  averageRegenerationCount: z.number().min(0),

  mostFrequentProblemCodes: z.array(z.object({ code: z.string(), count: z.number() })),
  mostEffectiveCorrections: z.array(z.object({ action: z.string(), successRate: z.number() })),
  providerSuccessRates: z.record(z.string(), z.number()),
  platformSuccessRates: z.record(z.string(), z.number()),

  analyzedAt: z.string().min(1),
});
