export type WCAGClassification = 'FAIL' | 'WCAG_2.2_AA' | 'WCAG_2.2_AAA';

export interface TypographyEmbeddedTextDecision {
  embeddedTextAllowed: boolean;
  exactApprovedText?: string;
  wordCount: number;
  textDensityPercentage: number;
  placementRegion: string;
  safeZoneCompliant: boolean;
  minimumReadableSizePx: number;
  contrastRatio: number;
  wcagClassification: WCAGClassification;
  fontFamilyConstraint: string;
  spellingValidated: boolean;
  fallbackToTextFreeImage: boolean;
  reason: string;
  deterministicFingerprint: string;
}
