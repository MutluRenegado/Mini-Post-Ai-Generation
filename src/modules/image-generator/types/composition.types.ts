export interface CameraPlan {
  distance: string;
  height: string;
  angle: string;
  lens: string;
  perspective: string;
}

export interface CompositionStylePlan {
  style: string;
  ruleOfThirds: boolean;
  symmetry: boolean;
  negativeSpace: string;
  eyeFlow: string;
  balance: string;
}

export interface LayerPlan {
  foreground: string[];
  midground: string[];
  background: string[];
}

export interface LightingPlan {
  direction: string;
  quality: string;
  intensity: string;
  timeOfDay: string;
  colorTemperature: string;
}

export interface ColorPlan {
  primary: string[];
  secondary: string[];
  contrastLevel: string;
}

export interface DepthPlan {
  depthOfField: string;
  focusTarget: string;
}

export interface CompositionSafeAreas {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface PlatformCompositionFit {
  name: string;
  aspectRatio: string;
  cropTolerance: string;
}

export interface CropPlan {
  focalPointX: number;
  focalPointY: number;
  safeCrop: boolean;
}

export interface CompositionPlanDetails {
  cameraPerspective: string;
  cameraLens: string;
  lighting: string;
  colorPalette: string[];
  eyeFlow: string;
  safeZonePadding: string;
}

export interface CompositionPlan {
  id: string;
  briefId: string;
  conceptId: string;
  status: 'selected' | 'candidate';
  camera: CameraPlan;
  style: CompositionStylePlan;
  layers: LayerPlan;
  lighting: LightingPlan;
  colors: ColorPlan;
  depth: DepthPlan;
  safeAreas: CompositionSafeAreas;
  platformFit: PlatformCompositionFit[];
  cropResilience: CropPlan;
  composition: CompositionPlanDetails;
  score: number;
  plannedAt: string;
}

export interface CompositionGenerationResult {
  candidates: CompositionPlan[];
  selectedComposition: CompositionPlan;
  selectedReason: string;
}
