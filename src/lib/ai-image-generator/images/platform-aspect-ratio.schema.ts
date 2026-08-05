import { z } from 'zod';

export const PlatformOptimizationDecisionSchema = z.object({
  platform: z.string(),
  dimensionsPx: z.object({ width: z.number(), height: z.number() }),
  aspectRatio: z.string(),
  safeZones: z.object({ top: z.number(), right: z.number(), bottom: z.number(), left: z.number() }),
  focalPlacementStrategy: z.string(),
  cropResilience: z.string(),
  maxTextDensityPercentage: z.number(),
  compositionFormat: z.enum(['square', 'portrait', 'landscape', 'vertical_full']),
  outputFormat: z.enum(['png', 'jpeg', 'webp']),
  altTextTemplate: z.string(),
  deterministicFingerprint: z.string(),
});
