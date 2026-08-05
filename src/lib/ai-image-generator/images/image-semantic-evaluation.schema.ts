import { z } from 'zod';

export const SemanticRelevanceScoreSchema = z.object({
  score: z.number(),
  confidence: z.number(),
  status: z.enum(['VERIFIED', 'UNVERIFIED', 'UNAVAILABLE', 'FAILED']),
  evidenceExcerpt: z.string(),
  calculationMethod: z.string(),
  thresholdSource: z.string(),
  limitationsNote: z.string().optional(),
});

export const ImageSemanticEvaluationResultSchema = z.object({
  overallStatus: z.enum(['VERIFIED', 'UNVERIFIED', 'UNAVAILABLE', 'FAILED']),
  textToBriefScore: SemanticRelevanceScoreSchema,
  briefToPromptScore: SemanticRelevanceScoreSchema,
  imageContentVisionScore: SemanticRelevanceScoreSchema,
  isPassed: z.boolean(),
  deterministicFingerprint: z.string(),
});
