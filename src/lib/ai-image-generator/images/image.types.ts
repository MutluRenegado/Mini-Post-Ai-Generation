export type ImageOperation = 'generate' | 'regenerate' | 'recreate' | 'edit';

export type TextStatus =
  | 'DRAFT'
  | 'GENERATING'
  | 'EDITING'
  | 'VALIDATING'
  | 'READY_FOR_APPROVAL'
  | 'FINAL'
  | 'REJECTED';

export interface FinalTextState {
  textStatus: TextStatus;
  textVersion: string;
  finalText: string;
  finalizedAt?: string;
  finalizedBy?: string;
  qualityScore?: number;
  platform?: string;
  postType?: string;
  language?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export function isImageGenerationAllowed(state?: Partial<FinalTextState> | { textStatus?: string; finalText?: string; approvalStatus?: string }): { allowed: boolean; reason?: string } {
  if (!state) {
    return { allowed: false, reason: 'IMAGE_GENERATION_BLOCKED_TEXT_NOT_FINAL' };
  }
  const status = (state.textStatus || '').toUpperCase();
  if (status !== 'FINAL' && status !== 'APPROVED') {
    return { allowed: false, reason: 'IMAGE_GENERATION_BLOCKED_TEXT_NOT_FINAL' };
  }
  if (!state.finalText || state.finalText.trim().length === 0) {
    return { allowed: false, reason: 'IMAGE_GENERATION_BLOCKED_FINAL_TEXT_EMPTY' };
  }
  if (state.approvalStatus && state.approvalStatus.toUpperCase() === 'REJECTED') {
    return { allowed: false, reason: 'IMAGE_GENERATION_BLOCKED_TEXT_NOT_APPROVED' };
  }
  return { allowed: true };
}

export type ModernVisualStyle =
  | 'modern-editorial'
  | 'vibrant-commercial'
  | 'colourful-professional'
  | 'premium-lifestyle'
  | 'clean-infographic'
  | 'modern-3d-editorial'
  | 'bold-social'
  | 'minimal-bright'
  | 'brand-led'
  | 'photorealistic-contemporary'
  | 'dark-cinematic';

export type DomainCategory =
  | 'international_trade'
  | 'finance'
  | 'technology'
  | 'marketing'
  | 'healthcare'
  | 'education'
  | 'manufacturing'
  | 'business';

export interface VisualShareabilityProfile {
  attentionStrength: number;
  clarity: number;
  colourEnergy: number;
  subjectProminence: number;
  mobileReadability: number;
  platformSuitability: number;
  brandRecognition: number;
  emotionalAppeal: number;
}

export interface PostVisualBrief {
  postId?: string;
  platform: string;
  postType: string;

  primaryTopic: string;
  centralMessage: string;
  communicationGoal: string;
  readerIntent: string;
  domainCategory?: DomainCategory;
  targetAudience: string;

  mainSubject: string;
  supportingSubjects: string[];
  environment: string;
  actionOrSituation: string;
  visualStory: string;

  emotionalTone: string;
  visualMood: string;
  visualStyle: ModernVisualStyle | string;

  keyObjects: string[];
  keyConcepts: string[];
  prohibitedObjects: string[];

  composition: string;
  cameraAngle: string;
  framing: string;
  lighting: string;
  colorDirection: string;
  shareabilityProfile?: VisualShareabilityProfile;

  templateId?: string;
  brandKitId?: string;
  brandColors?: string[];
  brandTone?: string;

  width: number;
  height: number;
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9' | '2:3' | '4:3';

  textInImagePolicy: 'none' | 'minimal' | 'required';
  requiredText?: string;
  negativeConstraints: string[];
}

export interface GroundedVisualElement {
  value: string;
  sourceText: string;
  sourceType: 'direct' | 'derived' | 'abstract-translation';
  confidence: number;
}

import { ImageStandard } from '@/standards/ai/image.standard';

export const SEMANTIC_THRESHOLDS = {
  overallSemanticScore: ImageStandard.minimumOverallSemanticScore,
  domainConsistency: ImageStandard.categoryThresholds.domainConsistency,
  primarySubjectAccuracy: ImageStandard.categoryThresholds.primarySubjectAccuracy,
  sceneConsistency: ImageStandard.categoryThresholds.sceneConsistency,
  keyObjectAccuracy: ImageStandard.categoryThresholds.keyObjectAccuracy,
  visualNarrativeAccuracy: ImageStandard.categoryThresholds.visualNarrativeAccuracy,
  environmentAccuracy: ImageStandard.categoryThresholds.environmentAccuracy,
  peopleRoleAccuracy: ImageStandard.categoryThresholds.peopleRoleAccuracy,
  abstractConceptTranslation: ImageStandard.categoryThresholds.abstractConceptAccuracy,
  platformAdaptation: ImageStandard.categoryThresholds.platformAdaptationAccuracy,
  promptCompleteness: ImageStandard.categoryThresholds.promptCompletenessScore,
} as const;

export interface SemanticValidationResult {
  valid: boolean;
  overallSemanticScore: number;

  categoryScores: {
    domainConsistency: number;
    primarySubjectAccuracy: number;
    sceneConsistency: number;
    keyObjectAccuracy: number;
    visualNarrativeAccuracy: number;
    environmentAccuracy: number;
    peopleRoleAccuracy: number;
    abstractConceptTranslation: number;
    platformAdaptation: number;
    promptCompleteness: number;
  };

  hardFailures: string[];
  failedThresholds: string[];
  errors: string[];
}

export interface ImagePromptValidation extends SemanticValidationResult {
  relevanceScore: number;
  specificityScore: number;
  platformScore: number;
  brandScore: number;
  modernityScore: number;
  colourScore: number;
  shareabilityScore: number;
  subjectClarityScore: number;
  topicAccuracyScore: number;
  communicationClarityScore: number;
  primarySubjectProminenceScore: number;
  domainConsistencyScore?: number;
  primarySubjectCoverageScore?: number;
  keyObjectCoverageScore?: number;
  sceneConsistencyScore?: number;
  peopleRoleConsistencyScore?: number;
  problems: string[];
}

export interface GeneratedImageAudit {
  relevant: boolean;
  subjectMatchScore: number;
  messageMatchScore: number;
  compositionScore: number;
  platformScore: number;
  brandScore: number;
  modernityScore?: number;
  colourScore?: number;
  shareabilityScore?: number;
  topicAccuracyScore?: number;
  communicationClarityScore?: number;
  problems: string[];
}

export interface ImageRecreationRequest {
  operation: ImageOperation;
  postId?: string;
  sourceImageId?: string;
  sourceImageUrl?: string;
  originalImagePrompt?: string;
  postTopic: string;
  postTitle?: string;
  postContent?: string;
  platform?: string;
  postType?: string;
  templateId?: string;
  width?: number;
  height?: number;
  aspectRatio?: '1:1' | '4:5' | '9:16' | '16:9' | '2:3' | '4:3';
  brandKitId?: string;
  visualStyle?: ModernVisualStyle | string;
  recreationInstructions?: string;
  seed?: number;
  versionId?: string;
}

export interface VisualIntent {
  detectedDomain: string;
  primarySubject: string;
  secondarySubjects: string[];
  keyObjects: string[];
  excludedObjects: string[];

  sceneDescription: string;
  visualNarrative: string;

  peopleRequired: boolean;
  peopleDescription?: string;

  environment: string;
  composition: string;
  cameraAngle: string;
  lighting: string;

  visualFormat:
    | 'photograph'
    | 'editorial-illustration'
    | 'infographic'
    | '3d-render'
    | 'conceptual-art';

  realismLevel:
    | 'photorealistic'
    | 'semi-realistic'
    | 'stylized';

  mood: string;
  platformStyle: string;

  visualPriorities: string[];
  prohibitedElements: string[];

  confidenceScore: number;

  // Semantic Provenance Evidence
  groundedPrimarySubject?: GroundedVisualElement;
  groundedSecondarySubjects?: GroundedVisualElement[];
  groundedKeyObjects?: GroundedVisualElement[];
  groundedPeopleDescription?: GroundedVisualElement;
  groundedEnvironment?: GroundedVisualElement;
  groundedSceneDescription?: GroundedVisualElement;
  groundedVisualNarrative?: GroundedVisualElement;
}

export interface ImageGenerationContract {
  imageUrl?: string;
  imageMimeType?: string;
  imageSource?: string;
  imageStatus: 'generated' | 'stored' | 'failed' | 'generation_failed' | 'generation_succeeded_persistence_failed' | 'persisted';
  storagePath?: string;
  imageError?: string;
  promptUsed?: string;
  versionId?: string;
  operation?: ImageOperation;
  visualSummary?: ContentVisualSummary;
  visualIntent?: VisualIntent;
  visualBrief?: PostVisualBrief;
  validation?: ImagePromptValidation;
  provenance?: any;
  outputFingerprint?: string;
  pipelineResult?: any;
  history?: Array<{ url: string; versionId: string; timestamp: string }>;
}

export interface ContentVisualSummary {
  mainSubject: string;
  coreMessage: string;
  relevantPeople: string[];
  relevantObjects: string[];
  environment: string;
  location: string;
  timeOrLighting: string;
  mood: string;
  audience: string;
  industry: string;
  visualPriorities: string[];
  prohibitedElements: string[];
}

export interface ImagePipelineState {
  finalText: string;
  textStatus: 'draft' | 'validated' | 'approved';
  visualSummary?: ContentVisualSummary;
  visualIntent?: VisualIntent;
  visualBrief?: PostVisualBrief;
  imagePrompt?: string;
  imagePromptStatus?: 'pending' | 'validated' | 'rejected';
}

export interface RawProviderImageInput {
  base64?: string;
  inlineData?: { mimeType: string; data: string };
  fileUri?: string;
  url?: string;
  textPrompt?: string;
  seed?: number;
  versionId?: string;
}


