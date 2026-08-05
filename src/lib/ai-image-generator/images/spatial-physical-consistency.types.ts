export type PerspectiveType =
  | 'one_point_linear'
  | 'two_point_corner'
  | 'isometric'
  | 'forced_perspective'
  | 'eye_level_flat';

export interface SpatialPhysicalConsistencyDecision {
  relativeScaleRatio: string;
  depthOrdering: string[];
  perspective: PerspectiveType;
  surfaceContactGrounding: string;
  gravityVector: string;
  occlusionRules: string;
  horizonLogic: string;
  isPhysicallyPlausible: boolean;
  physicalInconsistencies?: string[];
  deterministicFingerprint: string;
}
