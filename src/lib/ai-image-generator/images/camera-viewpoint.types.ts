export type ShotType =
  | 'close_up'
  | 'medium_close_up'
  | 'medium_shot'
  | 'full_shot'
  | 'wide_shot'
  | 'extreme_wide'
  | 'macro'
  | 'aerial_drone';

export type CameraDistance =
  | 'macro'
  | 'extreme_close_up'
  | 'close_up'
  | 'medium'
  | 'long_shot'
  | 'extreme_long_shot';

export type ViewpointType =
  | 'eye_level'
  | 'low_angle'
  | 'high_angle'
  | 'birds_eye'
  | 'worms_eye'
  | 'over_the_shoulder'
  | 'dutch_angle'
  | 'first_person';

export type LensCharacteristic =
  | 'wide_angle_24mm'
  | 'standard_prime_35mm'
  | 'nifty_fifty_50mm'
  | 'portrait_85mm'
  | 'telephoto_135mm'
  | 'macro_100mm'
  | 'anamorphic'
  | 'tilt_shift';

export type FocalEmphasis =
  | 'shallow_depth_of_field'
  | 'deep_focus'
  | 'rack_focus'
  | 'bokeh_priority'
  | 'sharp_subject_only';

export interface CameraViewpointDecision {
  shotType: ShotType;
  cameraDistance: CameraDistance;
  viewpoint: ViewpointType;
  lensCharacteristic: LensCharacteristic;
  cameraHeight: string;
  cameraAngle: string;
  focalEmphasis: FocalEmphasis;
  depthOfFieldIntent: string;
  platformFraming: string;
  rationale: string;
  isPhysicallyCoherent: boolean;
  contradictionWarnings?: string[];
  deterministicFingerprint: string;
}
