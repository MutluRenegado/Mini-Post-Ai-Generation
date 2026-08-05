import { z } from 'zod';

export const SurfaceSpecSchema = z.object({
  material: z.enum([
    'brushed_metal',
    'polished_glass',
    'matte_ceramic',
    'natural_wood',
    'woven_fabric',
    'smooth_composite',
    'photovoltaic_silicon',
    'polished_marble',
  ]),
  textureDescription: z.string(),
  reflectivityPercentage: z.number(),
  roughnessIndex: z.number(),
  translucency: z.string(),
  surfaceWearState: z.enum(['pristine_factory', 'subtle_patina', 'industrial_weathered']),
  fabricDrapeBehavior: z.string().optional(),
  environmentalResponse: z.string(),
});

export const MaterialTextureDecisionSchema = z.object({
  primarySurface: SurfaceSpecSchema,
  secondarySurfaces: z.array(SurfaceSpecSchema),
  brandProductMaterialConsistency: z.string(),
  isPhysicallyCoherent: z.boolean(),
  contradictionWarnings: z.array(z.string()).optional(),
  deterministicFingerprint: z.string(),
});
