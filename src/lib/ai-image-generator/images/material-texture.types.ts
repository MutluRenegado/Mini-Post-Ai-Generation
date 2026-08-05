export type MaterialCategory =
  | 'brushed_metal'
  | 'polished_glass'
  | 'matte_ceramic'
  | 'natural_wood'
  | 'woven_fabric'
  | 'smooth_composite'
  | 'photovoltaic_silicon'
  | 'polished_marble';

export interface SurfaceSpec {
  material: MaterialCategory;
  textureDescription: string;
  reflectivityPercentage: number;
  roughnessIndex: number; // 0.0 (smooth mirror) to 1.0 (rough matte)
  translucency: string;
  surfaceWearState: 'pristine_factory' | 'subtle_patina' | 'industrial_weathered';
  fabricDrapeBehavior?: string;
  environmentalResponse: string;
}

export interface MaterialTextureDecision {
  primarySurface: SurfaceSpec;
  secondarySurfaces: SurfaceSpec[];
  brandProductMaterialConsistency: string;
  isPhysicallyCoherent: boolean;
  contradictionWarnings?: string[];
  deterministicFingerprint: string;
}
