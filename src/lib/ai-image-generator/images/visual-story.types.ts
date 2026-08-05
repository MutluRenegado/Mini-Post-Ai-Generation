export type VisualRole = 'hero' | 'supporting' | 'contextual';
export type StoryPriority = 'hero-first' | 'balanced-narrative' | 'contextual-story';

export interface VisualCharacter {
  role: string;
  relationship: string;
  visualRole: VisualRole;
  expression: string;
}

export interface StoryAction {
  action: string;
  intensity: 'subtle' | 'moderate' | 'dynamic';
  narrativeImpact: string;
}

export interface NarrativeNode {
  node: string;
  relationship: string;
  children?: string[];
}

export interface VisualNarrativeTree {
  root: string;
  branches: NarrativeNode[];
}

export interface VisualStoryNarrative {
  id: string;
  briefId?: string;

  heroStory: string;
  supportingStory: string;
  secondaryNarrative: string;

  interactionFlow: string[];
  visualNarrativeTree: VisualNarrativeTree;

  who: VisualCharacter[];
  actions: StoryAction[];

  context: string;
  narrativePurpose: string;
  emotionalContext: string;

  requiredVisualEvidence: string[];
  prohibitedImagery: string[];

  storyPriority: StoryPriority;
  storyConfidence: number;

  generatedAt: string;
  fingerprint: string;
}

export interface VisualStoryResult {
  briefId?: string;
  story: VisualStoryNarrative;
  validationScore: number;
  isValid: boolean;
  generatedAt: string;
}
