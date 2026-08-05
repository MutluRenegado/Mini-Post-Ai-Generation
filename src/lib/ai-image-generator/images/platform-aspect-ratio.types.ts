export interface PlatformOptimizationDecision {
  platform: string;
  dimensionsPx: { width: number; height: number };
  aspectRatio: string;
  safeZones: { top: number; right: number; bottom: number; left: number };
  focalPlacementStrategy: string;
  cropResilience: string;
  maxTextDensityPercentage: number;
  compositionFormat: 'square' | 'portrait' | 'landscape' | 'vertical_full';
  outputFormat: 'png' | 'jpeg' | 'webp';
  altTextTemplate: string;
  deterministicFingerprint: string;
}
