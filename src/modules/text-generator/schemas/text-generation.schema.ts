import { z } from 'zod';

export const TextGenerationRequestSchema = z.object({
  topic: z.string().min(1),
  platform: z.string().optional(),
  postType: z.string().optional(),
  tone: z.string().optional(),
  targetAudience: z.string().optional(),
  language: z.string().optional(),
  hashtagsCount: z.number().int().min(0).max(30).optional(),
  includeSeo: z.boolean().optional(),
});

export const PlatformTextOutputSchema = z.object({
  platform: z.string().min(1),
  caption: z.string().min(1),
  hashtags: z.array(z.string()),
  callToAction: z.string(),
});

export const TextGenerationResponseSchema = z.object({
  masterPost: z.string().min(1),
  platformOutputs: z.array(PlatformTextOutputSchema),
  seoTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  generatedAt: z.string(),
});
