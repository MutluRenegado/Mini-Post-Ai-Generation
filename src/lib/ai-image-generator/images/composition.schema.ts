import { z } from 'zod';

export const CameraPlanSchema = z.object({
  distance: z.string().min(1),
  height: z.string().min(1),
  angle: z.string().min(1),
  lens: z.string().min(1),
  perspective: z.string().min(1),
});

export const CompositionStylePlanSchema = z.object({
  style: z.string().min(1),
  ruleOfThirds: z.boolean(),
  symmetry: z.boolean(),
  negativeSpace: z.string().min(1),
  eyeFlow: z.string().min(1),
  balance: z.string().min(1),
});

export const LayerPlanSchema = z.object({
  foreground: z.array(z.string()),
  midground: z.array(z.string()),
  background: z.array(z.string()),
});

export const LightingPlanSchema = z.object({
  direction: z.string().min(1),
  quality: z.string().min(1),
  intensity: z.string().min(1),
  timeOfDay: z.string().min(1),
  colorTemperature: z.string().min(1),
});

export const ColorPlanSchema = z.object({
  primary: z.array(z.string()),
  secondary: z.array(z.string()),
  contrastLevel: z.string().min(1),
});

export const DepthPlanSchema = z.object({
  depthOfField: z.string().min(1),
  focusTarget: z.string().min(1),
});

export const CompositionSafeAreasSchema = z.object({
  top: z.number(),
  bottom: z.number(),
  left: z.number(),
  right: z.number(),
});

export const PlatformCompositionFitSchema = z.object({
  name: z.string().min(1),
  aspectRatio: z.string().min(1),
  cropTolerance: z.string().min(1),
});

export const CropPlanSchema = z.object({
  focalPointX: z.number().min(0).max(1),
  focalPointY: z.number().min(0).max(1),
  safeCrop: z.boolean(),
});

export const CompositionScoresSchema = z.object({
  semanticRelevance: z.number().min(0).max(100),
  visualClarity: z.number().min(0).max(100),
  brandCompatibility: z.number().min(0).max(100),
  platformCompatibility: z.number().min(0).max(100),
  productionFeasibility: z.number().min(0).max(100),
  cropResilience: z.number().min(0).max(100),
  typographyFriendliness: z.number().min(0).max(100),
  visualHierarchy: z.number().min(0).max(100),
  overall: z.number().min(0).max(100),
});

export const CompositionPlanSchema = z.object({
  id: z.string().min(1),
  briefId: z.string().min(1),
  conceptId: z.string().min(1),

  compositionType: z.enum(['editorial', 'minimal', 'cinematic']),
  sceneType: z.string().min(1),

  focalSubject: z.string().min(1),
  supportingSubjects: z.array(z.string()),

  camera: CameraPlanSchema,
  composition: CompositionStylePlanSchema,
  layers: LayerPlanSchema,
  lighting: LightingPlanSchema,
  colors: ColorPlanSchema,
  depth: DepthPlanSchema,

  safeAreas: CompositionSafeAreasSchema,
  platform: PlatformCompositionFitSchema,
  cropPlan: CropPlanSchema,

  scores: CompositionScoresSchema,

  qualityNotes: z.array(z.string()),
  riskFlags: z.array(z.string()),

  status: z.enum(['candidate', 'selected', 'rejected']),
  createdAt: z.string().min(1),
});
