import { z } from 'zod';

export const PromptSubjectSectionSchema = z.object({
  primary: z.string().min(1),
  supporting: z.array(z.string()),
  action: z.string().min(1),
  expressionOrState: z.string().optional(),
});

export const PromptEnvironmentSectionSchema = z.object({
  setting: z.string().min(1),
  timeOfDay: z.string().optional(),
  atmosphere: z.string().optional(),
  weather: z.string().optional(),
  contextualDetails: z.array(z.string()),
});

export const PromptCompositionSectionSchema = z.object({
  style: z.string().min(1),
  subjectPosition: z.string().min(1),
  cameraDistance: z.string().min(1),
  cameraHeight: z.string().min(1),
  cameraAngle: z.string().min(1),
  lens: z.string().min(1),
  perspective: z.string().min(1),
  framing: z.string().min(1),
  eyeFlow: z.string().min(1),
  negativeSpace: z.string().min(1),
  foreground: z.array(z.string()),
  midground: z.array(z.string()),
  background: z.array(z.string()),
});

export const PromptLightingSectionSchema = z.object({
  direction: z.string().min(1),
  quality: z.string().min(1),
  intensity: z.string().min(1),
  colorTemperature: z.string().min(1),
});

export const PromptColorSectionSchema = z.object({
  primaryPalette: z.array(z.string()),
  secondaryPalette: z.array(z.string()),
  contrastLevel: z.string().min(1),
  brandDirection: z.string().optional(),
});

export const PromptStyleSectionSchema = z.object({
  visualStyle: z.string().min(1),
  realismLevel: z.string().min(1),
  materialDirection: z.array(z.string()).optional(),
  textureDirection: z.array(z.string()).optional(),
  depthOfField: z.string().min(1),
});

export const PromptPlatformSectionSchema = z.object({
  name: z.string().min(1),
  aspectRatio: z.string().min(1),
  safeAreas: z.object({
    top: z.number().optional(),
    right: z.number().optional(),
    bottom: z.number().optional(),
    left: z.number().optional(),
  }),
  cropResilience: z.string().min(1),
  textOverlayAllowance: z.boolean(),
});

export const PromptConstraintsSectionSchema = z.object({
  requiredElements: z.array(z.string()),
  prohibitedElements: z.array(z.string()),
  safetyRestrictions: z.array(z.string()),
  negativeInstructions: z.array(z.string()),
});

export const MasterImagePromptSchema = z.object({
  id: z.string().min(1),

  sourcePostId: z.string().optional(),
  briefId: z.string().min(1),
  conceptId: z.string().min(1),
  compositionPlanId: z.string().min(1),

  version: z.number().min(1),
  providerTarget: z.string().optional(),

  subject: PromptSubjectSectionSchema,
  environment: PromptEnvironmentSectionSchema,
  composition: PromptCompositionSectionSchema,
  lighting: PromptLightingSectionSchema,
  color: PromptColorSectionSchema,
  style: PromptStyleSectionSchema,
  platform: PromptPlatformSectionSchema,
  constraints: PromptConstraintsSectionSchema,

  userRefinement: z.string().optional(),

  promptText: z.string().min(1),
  negativePromptText: z.string().optional(),
  concisePromptSummary: z.string().min(1),

  deterministicFingerprint: z.string().min(1),
  createdAt: z.string().min(1),
});
