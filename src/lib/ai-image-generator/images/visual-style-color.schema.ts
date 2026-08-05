import { z } from 'zod';

export const EditorialStyleTypeSchema = z.enum([
  'editorial_photo',
  'documentary_corporate',
  'high_tech_modern',
  'minimalist_professional',
  'industrial_documentary',
  'academic_scholarly',
]);

export const RenderingMediumSchema = z.enum(['real_world_photography', 'clean_digital_illustration', 'mixed_media']);

export const ColorHarmonyTypeSchema = z.enum(['analogous', 'complementary', 'triadic', 'monochromatic', 'split_complementary']);

export const StyleEvidenceSchema = z.object({
  sourceLayer: z.enum(['finalized_article', 'brand_direction', 'semantic_subject', 'environment_plan']),
  sourceId: z.string(),
  evidenceExcerpt: z.string(),
  derivation: z.enum(['direct', 'inferred', 'brand_guided']),
  confidence: z.number().min(0).max(1),
  isRequired: z.boolean(),
});

export const IndustryStyleProfileSchema = z.object({
  profileId: z.string(),
  domain: z.string(),
  primaryStyle: EditorialStyleTypeSchema,
  renderingMedium: RenderingMediumSchema,
  primaryColorHex: z.string(),
  secondaryColorHex: z.string(),
  accentColorHex: z.string(),
  neutralColorHex: z.string(),
  backgroundColorHex: z.string(),
  surfaceFinish: z.string(),
  lightingMood: z.string(),
  evidence: StyleEvidenceSchema,
});

export const ColorPsychologyContextSchema = z.object({
  emotionalTone: z.string(),
  dominantHue: z.string(),
  accentHue: z.string(),
  saturationLevel: z.enum(['vibrant', 'balanced', 'muted', 'subdued']),
  contrastLevel: z.enum(['high_contrast', 'medium_contrast', 'soft_contrast']),
  colorHarmony: ColorHarmonyTypeSchema,
  evidence: StyleEvidenceSchema,
});

export const BrandPaletteAlignmentSchema = z.object({
  brandPersonality: z.string(),
  primaryMatchRatio: z.number().min(0).max(1),
  accentMatchRatio: z.number().min(0).max(1),
  brandRestrictionsCompliant: z.boolean(),
  alignmentScore: z.number().min(0).max(100),
  evidence: StyleEvidenceSchema,
});

export const AccessibilityContrastReportSchema = z.object({
  textVsBackgroundRatio: z.number().min(0),
  accentVsNeutralRatio: z.number().min(0),
  meetsWCAG21AA: z.boolean(),
  complianceLevel: z.enum(['AA_compliant', 'AAA_compliant', 'non_compliant']),
  evidence: StyleEvidenceSchema,
});

export const StyleValidationDefectSchema = z.object({
  code: z.enum([
    'UNSUPPORTED_STYLE_GENRE',
    'BRAND_COLOR_MISMATCH',
    'POOR_ACCESSIBILITY_CONTRAST',
    'EMOTIONAL_TONE_MISMATCH',
    'INCONSISTENT_COLOR_PALETTE',
    'EXCESSIVE_INFERRED_STYLE',
    'MISSING_PROVENANCE',
    'INVALID_CONFIDENCE',
  ]),
  severity: z.enum(['critical', 'warning']),
  message: z.string(),
  nodeId: z.string().optional(),
});

export const VisualStyleColorPlanSchema = z.object({
  id: z.string(),
  briefId: z.string(),
  environmentPlanId: z.string(),
  primaryDomain: z.string(),
  secondaryDomain: z.string().optional(),
  isMixedDomain: z.boolean(),

  styleType: EditorialStyleTypeSchema,
  renderingMedium: RenderingMediumSchema,
  styleProfile: IndustryStyleProfileSchema,
  colorPsychology: ColorPsychologyContextSchema,
  brandAlignment: BrandPaletteAlignmentSchema,
  accessibility: AccessibilityContrastReportSchema,

  palette: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    neutral: z.string(),
    background: z.string(),
  }),

  directEvidenceRatio: z.number().min(0).max(1),
  inferredEvidenceRatio: z.number().min(0).max(1),

  generatedAt: z.string(),
  fingerprint: z.string(),
});

export const VisualStyleColorResultSchema = z.object({
  briefId: z.string(),
  plan: VisualStyleColorPlanSchema,
  serializedJson: z.string(),
  humanReadableSummary: z.string(),
  validationScore: z.number().min(0).max(100),
  isValid: z.boolean(),
  defects: z.array(StyleValidationDefectSchema),
  generatedAt: z.string(),
});
