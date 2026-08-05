import { z } from 'zod';

export const AIImageGenerationRequestSchema = z.object({
  prompt: z.object({
    id: z.string().min(1),
    briefId: z.string().min(1),
    conceptId: z.string().min(1),
    compositionPlanId: z.string().min(1),
    version: z.number().min(1),
    promptText: z.string().min(1),
    negativePromptText: z.string().optional(),
    platform: z.object({
      name: z.string(),
      aspectRatio: z.string(),
    }),
  }),
  providerPreference: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  aspectRatio: z.string().min(1),
  seed: z.number().optional(),
  timeoutMs: z.number().optional(),
});

export const AIImageGenerationResponseSchema = z.object({
  asset: z.object({
    id: z.string().min(1),
    source: z.string().min(1),
    kind: z.string().min(1),
    url: z.string().min(1),
    previewUrl: z.string().min(1),
    thumbnailUrl: z.string().min(1),
    base64: z.string().optional(),
    width: z.number().min(1),
    height: z.number().min(1),
    aspectRatio: z.string().min(1),
    mimeType: z.string().min(1),
    altText: z.string().min(1),
  }),
  provider: z.string().min(1),
  model: z.string().min(1),
  requestId: z.string().optional(),
  seed: z.number().optional(),
  width: z.number().min(1),
  height: z.number().min(1),
  mimeType: z.string().min(1),
  fileSize: z.number().optional(),
  promptVersion: z.number().min(1),
  briefId: z.string().min(1),
  conceptId: z.string().min(1),
  compositionPlanId: z.string().min(1),
  generationStartedAt: z.string().min(1),
  generationCompletedAt: z.string().min(1),
});
