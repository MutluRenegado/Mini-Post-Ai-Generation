import { z } from 'zod';

export const TypographyEmbeddedTextDecisionSchema = z.object({
  embeddedTextAllowed: z.boolean(),
  exactApprovedText: z.string().optional(),
  wordCount: z.number(),
  textDensityPercentage: z.number(),
  placementRegion: z.string(),
  safeZoneCompliant: z.boolean(),
  minimumReadableSizePx: z.number(),
  contrastRatio: z.number(),
  wcagClassification: z.enum(['FAIL', 'WCAG_2.2_AA', 'WCAG_2.2_AAA']),
  fontFamilyConstraint: z.string(),
  spellingValidated: z.boolean(),
  fallbackToTextFreeImage: z.boolean(),
  reason: z.string(),
  deterministicFingerprint: z.string(),
});
