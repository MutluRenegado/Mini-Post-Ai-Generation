import { SemanticSubjectExtraction } from './semantic-subject.types';
import { VisualStoryNarrative } from './visual-story.types';
import { SceneGraph } from './scene-graph.types';
import { SpatialLayout } from './spatial-reasoning.types';
import { OccupationInteractionPlan } from './occupation-interaction.types';
import { EnvironmentAuthenticityPlan } from './environment-authenticity.types';
import { VisualStyleColorPlan } from './visual-style-color.types';
import { CameraViewpointDecision } from './camera-viewpoint.types';
import { LightingIntelligenceDecision } from './lighting-intelligence.types';
import { CompositionHierarchyDecision } from './composition-hierarchy.types';
import { SubjectInteractionDecision } from './subject-interaction.types';
import { MaterialTextureDecision } from './material-texture.types';
import { SpatialPhysicalConsistencyDecision } from './spatial-physical-consistency.types';
import { EmotionalNarrativeDecision } from './emotional-narrative.types';
import { HumanAnatomyPoseDecision } from './human-anatomy-pose.types';
import { FacialIdentityDecision } from './facial-identity.types';
import { TypographyEmbeddedTextDecision } from './typography-embedded-text.types';
import { BrandConsistencyDecision } from './brand-consistency.types';
import { PlatformOptimizationDecision } from './platform-aspect-ratio.types';

export interface BrandDirection {
  brandId?: string;
  personality?: string;
  palette?: string[];
  typographyDirection?: string;
  visualRestrictions?: string[];
}

export interface SafeAreas {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface VisualIntelligenceBrief {
  id: string;
  sourcePostId?: string;

  centralMessage: string;
  communicationObjective: string;

  primarySubject: string;
  secondarySubjects: string[];

  setting: string;
  action: string;

  audience: string;
  mood: string;
  tone: string;
  emotionalEffect: string;

  literalVisualDirection: string;
  conceptualVisualDirection: string;
  visualMetaphor?: string;

  brandDirection?: BrandDirection;

  campaignContext?: string;

  platform: string;
  postType: string;
  aspectRatio: string;

  safeAreas: SafeAreas;

  textOverlayAllowance: boolean;
  colorDirection: string[];

  prohibitedElements: string[];
  safetyRestrictions: string[];

  stockSearchKeywords: string[];
  negativeConcepts: string[];

  sanitizedSourceSummary: string;
  generationTimestamp: string;
  deterministicFingerprint: string;

  semanticSubject?: SemanticSubjectExtraction;
  visualStory?: VisualStoryNarrative;
  sceneGraph?: SceneGraph;
  spatialLayout?: SpatialLayout;
  occupationInteractionPlan?: OccupationInteractionPlan;
  environmentAuthenticityPlan?: EnvironmentAuthenticityPlan;
  visualStyleColorPlan?: VisualStyleColorPlan;

  // Levels 32–43 Intelligence Engine Plans
  cameraViewpointPlan?: CameraViewpointDecision;
  lightingIntelligencePlan?: LightingIntelligenceDecision;
  compositionHierarchyPlan?: CompositionHierarchyDecision;
  subjectInteractionPlan?: SubjectInteractionDecision;
  materialTexturePlan?: MaterialTextureDecision;
  spatialPhysicalConsistencyPlan?: SpatialPhysicalConsistencyDecision;
  emotionalNarrativePlan?: EmotionalNarrativeDecision;
  humanAnatomyPosePlan?: HumanAnatomyPoseDecision;
  facialIdentityPlan?: FacialIdentityDecision;
  typographyEmbeddedTextPlan?: TypographyEmbeddedTextDecision;
  brandConsistencyPlan?: BrandConsistencyDecision;
  platformOptimizationPlan?: PlatformOptimizationDecision;
}
