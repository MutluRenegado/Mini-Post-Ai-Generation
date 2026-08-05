export type LightSourceType =
  | 'natural_sunlight'
  | 'diffused_studio'
  | 'neon_rim_light'
  | 'volumetric_god_rays'
  | 'softbox_ambient'
  | 'indoor_warm'
  | 'dramatic_backlit'
  | 'golden_hour_sun';

export type LightDirection =
  | 'front_fill'
  | 'key_light_45'
  | 'side_profile'
  | 'backlit_rim'
  | 'top_down_overhead'
  | 'bottom_up_fill';

export type LightIntensity = 'soft_ambient' | 'moderate_key' | 'high_contrast' | 'harsh_direct';

export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'golden_hour' | 'twilight' | 'midnight' | 'studio_interior';

export interface LightingIntelligenceDecision {
  lightSource: LightSourceType;
  direction: LightDirection;
  intensity: LightIntensity;
  softness: string;
  contrastRatio: string;
  colorTemperatureK: number;
  timeOfDay: TimeOfDay;
  shadowBehavior: string;
  subjectBackgroundSeparationRim: boolean;
  accessibilityVisibilityCheck: boolean;
  brandLightingConstraint: string;
  isPhysicallyCoherent: boolean;
  contradictionWarnings?: string[];
  deterministicFingerprint: string;
}
