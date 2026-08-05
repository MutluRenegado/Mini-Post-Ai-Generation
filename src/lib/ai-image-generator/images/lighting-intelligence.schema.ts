import { z } from 'zod';

export const LightingIntelligenceDecisionSchema = z.object({
  lightSource: z.enum([
    'natural_sunlight',
    'diffused_studio',
    'neon_rim_light',
    'volumetric_god_rays',
    'softbox_ambient',
    'indoor_warm',
    'dramatic_backlit',
    'golden_hour_sun',
  ]),
  direction: z.enum([
    'front_fill',
    'key_light_45',
    'side_profile',
    'backlit_rim',
    'top_down_overhead',
    'bottom_up_fill',
  ]),
  intensity: z.enum(['soft_ambient', 'moderate_key', 'high_contrast', 'harsh_direct']),
  softness: z.string(),
  contrastRatio: z.string(),
  colorTemperatureK: z.number(),
  timeOfDay: z.enum(['dawn', 'morning', 'noon', 'golden_hour', 'twilight', 'midnight', 'studio_interior']),
  shadowBehavior: z.string(),
  subjectBackgroundSeparationRim: z.boolean(),
  accessibilityVisibilityCheck: z.boolean(),
  brandLightingConstraint: z.string(),
  isPhysicallyCoherent: z.boolean(),
  contradictionWarnings: z.array(z.string()).optional(),
  deterministicFingerprint: z.string(),
});
