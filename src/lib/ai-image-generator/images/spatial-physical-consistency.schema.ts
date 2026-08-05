import { z } from 'zod';

export const SpatialPhysicalConsistencyDecisionSchema = z.object({
  relativeScaleRatio: z.string(),
  depthOrdering: z.array(z.string()),
  perspective: z.enum([
    'one_point_linear',
    'two_point_corner',
    'isometric',
    'forced_perspective',
    'eye_level_flat',
  ]),
  surfaceContactGrounding: z.string(),
  gravityVector: z.string(),
  occlusionRules: z.string(),
  horizonLogic: z.string(),
  isPhysicallyPlausible: z.boolean(),
  physicalInconsistencies: z.array(z.string()).optional(),
  deterministicFingerprint: z.string(),
});
