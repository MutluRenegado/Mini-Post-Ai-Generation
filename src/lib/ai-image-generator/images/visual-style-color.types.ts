/**
 * Level 31: Visual Style and Color Intelligence Types
 */

export type EditorialStyleType =
  | 'editorial_photo'
  | 'documentary_corporate'
  | 'high_tech_modern'
  | 'minimalist_professional'
  | 'industrial_documentary'
  | 'academic_scholarly';

export type RenderingMedium = 'real_world_photography' | 'clean_digital_illustration' | 'mixed_media';

export type ColorHarmonyType = 'analogous' | 'complementary' | 'triadic' | 'monochromatic' | 'split_complementary';

export interface StyleEvidence {
  sourceLayer: 'finalized_article' | 'brand_direction' | 'semantic_subject' | 'environment_plan';
  sourceId: string;
  evidenceExcerpt: string;
  derivation: 'direct' | 'inferred' | 'brand_guided';
  confidence: number;
  isRequired: boolean;
}

export interface IndustryStyleProfile {
  profileId: string;
  domain: string;
  primaryStyle: EditorialStyleType;
  renderingMedium: RenderingMedium;
  primaryColorHex: string;
  secondaryColorHex: string;
  accentColorHex: string;
  neutralColorHex: string;
  backgroundColorHex: string;
  surfaceFinish: string;
  lightingMood: string;
  evidence: StyleEvidence;
}

export interface ColorPsychologyContext {
  emotionalTone: string;
  dominantHue: string;
  accentHue: string;
  saturationLevel: 'vibrant' | 'balanced' | 'muted' | 'subdued';
  contrastLevel: 'high_contrast' | 'medium_contrast' | 'soft_contrast';
  colorHarmony: ColorHarmonyType;
  evidence: StyleEvidence;
}

export interface BrandPaletteAlignment {
  brandPersonality: string;
  primaryMatchRatio: number;
  accentMatchRatio: number;
  brandRestrictionsCompliant: boolean;
  alignmentScore: number;
  evidence: StyleEvidence;
}

export interface AccessibilityContrastReport {
  textVsBackgroundRatio: number;
  accentVsNeutralRatio: number;
  meetsWCAG21AA: boolean;
  complianceLevel: 'AA_compliant' | 'AAA_compliant' | 'non_compliant';
  evidence: StyleEvidence;
}

export interface StyleValidationDefect {
  code:
    | 'UNSUPPORTED_STYLE_GENRE'
    | 'BRAND_COLOR_MISMATCH'
    | 'POOR_ACCESSIBILITY_CONTRAST'
    | 'EMOTIONAL_TONE_MISMATCH'
    | 'INCONSISTENT_COLOR_PALETTE'
    | 'EXCESSIVE_INFERRED_STYLE'
    | 'MISSING_PROVENANCE'
    | 'INVALID_CONFIDENCE';
  severity: 'critical' | 'warning';
  message: string;
  nodeId?: string;
}

export interface VisualStyleColorPlan {
  id: string;
  briefId: string;
  environmentPlanId: string;
  primaryDomain: string;
  secondaryDomain?: string;
  isMixedDomain: boolean;

  styleType: EditorialStyleType;
  renderingMedium: RenderingMedium;
  styleProfile: IndustryStyleProfile;
  colorPsychology: ColorPsychologyContext;
  brandAlignment: BrandPaletteAlignment;
  accessibility: AccessibilityContrastReport;

  palette: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    background: string;
  };

  directEvidenceRatio: number;
  inferredEvidenceRatio: number;

  generatedAt: string;
  fingerprint: string;
}

export interface VisualStyleColorResult {
  briefId: string;
  plan: VisualStyleColorPlan;
  serializedJson: string;
  humanReadableSummary: string;
  validationScore: number;
  isValid: boolean;
  defects: StyleValidationDefect[];
  generatedAt: string;
}
