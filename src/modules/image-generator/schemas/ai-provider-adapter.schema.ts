import { z } from 'zod';

export const AIImageProviderRequestSchema = z.object({
  promptText: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  aspectRatio: z.string().optional(),
  seed: z.number().int().optional(),
  model: z.string().optional(),
  timeoutMs: z.number().int().positive().optional(),
});

export const AIImageProviderResponseSchema = z.object({
  assetId: z.string().min(1),
  providerName: z.string().min(1),
  modelName: z.string().min(1),
  imageData: z.instanceof(Buffer),
  mimeType: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  durationMs: z.number().nonnegative(),
  promptText: z.string().min(1),
  aspectRatio: z.string().min(1),
});
