export interface PromptSubjectSection {
  primary: string;
  supporting: string[];
  action: string;
  expressionOrState?: string;
}

export interface PromptEnvironmentSection {
  setting: string;
  timeOfDay?: string;
  atmosphere?: string;
  weather?: string;
  contextualDetails: string[];
}

export interface PromptCompositionSection {
  style: string;
  subjectPosition: string;
  cameraDistance: string;
  cameraHeight: string;
  cameraAngle: string;
  lens: string;
  perspective: string;
  framing: string;
  eyeFlow: string;
  negativeSpace: string;
  foreground: string[];
  midground: string[];
  background: string[];
}

export interface PromptLightingSection {
  direction: string;
  quality: string;
  intensity: string;
  colorTemperature: string;
}

export interface PromptColorSection {
  primaryPalette: string[];
  secondaryPalette: string[];
  contrastLevel: string;
  brandDirection?: string;
}

export interface PromptStyleSection {
  visualStyle: string;
  realismLevel: string;
  materialDirection?: string[];
  textureDirection?: string[];
  depthOfField: string;
}

export interface PromptPlatformSection {
  name: string;
  aspectRatio: string;
  safeAreas: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  cropResilience: string;
  textOverlayAllowance: boolean;
}

export interface PromptConstraintsSection {
  requiredElements: string[];
  prohibitedElements: string[];
  safetyRestrictions: string[];
  negativeInstructions: string[];
}

export interface MasterImagePrompt {
  id: string;

  sourcePostId?: string;
  briefId: string;
  conceptId: string;
  compositionPlanId: string;

  version: number;
  providerTarget?: string;

  subject: PromptSubjectSection;
  environment: PromptEnvironmentSection;
  composition: PromptCompositionSection;
  lighting: PromptLightingSection;
  color: PromptColorSection;
  style: PromptStyleSection;
  platform: PromptPlatformSection;
  constraints: PromptConstraintsSection;

  userRefinement?: string;

  promptText: string;
  negativePromptText?: string;
  concisePromptSummary: string;

  deterministicFingerprint: string;
  createdAt: string;
}
