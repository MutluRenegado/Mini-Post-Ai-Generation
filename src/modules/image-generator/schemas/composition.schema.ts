import { z } from 'zod';

export const CameraPlanSchema = z.object({
  distance: z.string(),
  height: z.string(),
  angle: z.string(),
  lens: z.string(),
  perspective: z.string(),
});

export const CompositionStylePlanSchema = z.object({
  style: z.string(),
  ruleOfThirds: z.boolean(),
  symmetry: z.boolean(),
  negativeSpace: z.string(),
  eyeFlow: z.string(),
  balance: z.string(),
});

export const LayerPlanSchema = z.object({
  foreground: z.array(z.string()),
  midground: z.array(z.string()),
  background: z.array(z.string()),
});

export const LightingPlanSchema = z.object({
  direction: z.string(),
  quality: z.string(),
  intensity: z.string(),
  timeOfDay: z.string(),
  colorTemperature: z.string(),
});

export const ColorPlanSchema = z.object({
  primary: z.array(z.string()),
  secondary: z.array(z.string()),
  contrastLevel: z.string(),
});

export const DepthPlanSchema = z.object({
  depthOfField: z.string(),
  focusTarget: z.string(),
});

export const CompositionSafeAreasSchema = z.object({
  top: z.number(),
  bottom: z.number(),
  left: z.number(),
  right: z.number(),
});

export const PlatformCompositionFitSchema = z.object({
  name: z.string(),
  aspectRatio: z.string(),
  cropTolerance: z.string(),
});

export const CropPlanSchema = z.object({
  focalPointX: z.number(),
  focalPointY: z.number(),
  safeCrop: z.boolean(),
});

export const CompositionPlanDetailsSchema = z.object({
  cameraPerspective: z.string(),
  cameraLens: z.string(),
  lighting: z.string(),
  colorPalette: z.array(z.string()),
  eyeFlow: z.string(),
  safeZonePadding: z.string(),
});

export const CompositionPlanSchema = z.object({
  id: z.string().min(1),
  briefId: z.string().min(1),
  conceptId: z.string().min(1),
  status: z.enum(['selected', 'candidate']),
  camera: CameraPlanSchema,
  style: CompositionStylePlanSchema,
  layers: LayerPlanSchema,
  lighting: LightingPlanSchema,
  colors: ColorPlanSchema,
  depth: DepthPlanSchema,
  safeAreas: CompositionSafeAreasSchema,
  platformFit: z.array(PlatformCompositionFitSchema),
  cropResilience: CropPlanSchema,
  composition: CompositionPlanDetailsSchema,
  score: z.number().min(0).max(100),
  plannedAt: z.string(),
});
