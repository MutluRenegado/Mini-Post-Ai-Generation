import { z } from 'zod';

export const ProviderCapabilitySpecSchema = z.object({
  providerId: z.string(),
  modelName: z.string(),
  supportedAspectRatios: z.array(z.string()),
  maxPromptLengthChars: z.number(),
  supportsNegativePrompt: z.boolean(),
  supportsSeed: z.boolean(),
  supportsImageReference: z.boolean(),
  serverSideOnly: z.literal(true),
});

export const ProviderCompatibilityCheckResultSchema = z.object({
  providerId: z.string(),
  modelName: z.string(),
  isCompatible: z.boolean(),
  resolvedDimensions: z.object({ width: z.number(), height: z.number() }),
  resolvedAspectRatio: z.string(),
  isRetryableFailure: z.boolean(),
  incompatibilityReasons: z.array(z.string()).optional(),
  secretsExposed: z.literal(false),
  deterministicFingerprint: z.string(),
});
