import { z } from 'zod';

export const VisualIntelligenceBriefSchema = z.object({
  id: z.string().min(1),
  postId: z.string().optional(),
  platform: z.string().min(1),
  sanitizedContent: z.string(),
  fingerprint: z.string().length(64),
  primarySubject: z.string().min(1),
  setting: z.string(),
  actionOrState: z.string(),
  visualMeaning: z.string(),
  keywords: z.array(z.string()),
  brandPalette: z.array(z.string()),
  aspectRatio: z.string(),
  safeAreas: z.object({
    top: z.number(),
    bottom: z.number(),
    left: z.number(),
    right: z.number(),
  }),
  createdAt: z.string(),
});
