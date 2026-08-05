import { z } from 'zod';

export const PromptCompressionDeltaSchema = z.object({
  originalLengthChars: z.number(),
  compressedLengthChars: z.number(),
  reductionPercentage: z.number(),
  removedRedundantTokens: z.array(z.string()),
  preservedMandatoryConstraints: z.array(z.string()),
});

export const PromptCompressionResultSchema = z.object({
  compressedPromptText: z.string(),
  originalPromptFingerprint: z.string(),
  compressedPromptFingerprint: z.string(),
  delta: PromptCompressionDeltaSchema,
  providerTokenLimitCompliant: z.boolean(),
});
