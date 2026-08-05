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

export interface CompositionScores {
  semanticRelevance: number;
  visualClarity: number;
  brandCompatibility: number;
  platformCompatibility: number;
  productionFeasibility: number;
  cropResilience: number;
  typographyFriendliness: number;
  visualHierarchy: number;
  overall: number;
}

export interface CompositionPlan {
  id: string;
  briefId: string;
  conceptId: string;

  compositionType: 'editorial' | 'minimal' | 'cinematic';
  sceneType: string;

  focalSubject: string;
  supportingSubjects: string[];

  camera: CameraPlan;
  composition: CompositionStylePlan;
  layers: LayerPlan;
  lighting: LightingPlan;
  colors: ColorPlan;
  depth: DepthPlan;

  safeAreas: CompositionSafeAreas;
  platform: PlatformCompositionFit;
  cropPlan: CropPlan;

  scores: CompositionScores;

  qualityNotes: string[];
  riskFlags: string[];

  status: 'candidate' | 'selected' | 'rejected';
  createdAt: string;
}

export interface CompositionPlanningResult {
  briefId: string;
  conceptId: string;
  candidates: CompositionPlan[];
  selectedComposition: CompositionPlan;
  generationTimestamp: string;
}
