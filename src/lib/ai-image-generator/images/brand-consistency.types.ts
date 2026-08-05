export interface UserBrandKit {
  brandId: string;
  brandName: string;
  primaryColorHex: string;
  secondaryColorHex?: string;
  accentColorHex?: string;
  fontFamily?: string;
  toneVoice?: string;
  prohibitedTreatments?: string[];
  logoWatermarkPlacement?: 'top_right' | 'bottom_right' | 'none';
}

export interface BrandConsistencyDecision {
  brandKitActive: boolean;
  resolvedColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typographyStyle: string;
  toneAlignment: string;
  prohibitedTreatmentsFiltered: string[];
  fallbackUsed: boolean;
  miniPostAppBrandingInjected: boolean;
  deterministicFingerprint: string;
}
