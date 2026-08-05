import { z } from 'zod';

export const UserBrandKitSchema = z.object({
  brandId: z.string(),
  brandName: z.string(),
  primaryColorHex: z.string(),
  secondaryColorHex: z.string().optional(),
  accentColorHex: z.string().optional(),
  fontFamily: z.string().optional(),
  toneVoice: z.string().optional(),
  prohibitedTreatments: z.array(z.string()).optional(),
  logoWatermarkPlacement: z.enum(['top_right', 'bottom_right', 'none']).optional(),
});

export const BrandConsistencyDecisionSchema = z.object({
  brandKitActive: z.boolean(),
  resolvedColors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }),
  typographyStyle: z.string(),
  toneAlignment: z.string(),
  prohibitedTreatmentsFiltered: z.array(z.string()),
  fallbackUsed: z.boolean(),
  miniPostAppBrandingInjected: z.boolean(),
  deterministicFingerprint: z.string(),
});
