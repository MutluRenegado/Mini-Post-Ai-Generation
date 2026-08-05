import { VisualIntelligenceBrief } from './visual-intelligence.types';
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
import { ImageQualityAssuranceReport } from './image-quality-assurance.types';
import { PromptCompressionResult } from './prompt-compression.types';
import { PromptSelfHealingResult } from './prompt-self-healing.types';
import { ProviderCompatibilityCheckResult } from './provider-compatibility.types';
import { ImageSemanticEvaluationResult } from './image-semantic-evaluation.types';
import { UserGenerationFeedback } from './user-feedback.types';

export interface Level32to50PipelineResult {
  success: boolean;
  brief: VisualIntelligenceBrief;
  intelligence: {
    camera: CameraViewpointDecision;
    lighting: LightingIntelligenceDecision;
    composition: CompositionHierarchyDecision;
    subjectInteraction: SubjectInteractionDecision;
    materialTexture: MaterialTextureDecision;
    spatialPhysical: SpatialPhysicalConsistencyDecision;
    emotionalNarrative: EmotionalNarrativeDecision;
    humanAnatomyPose: HumanAnatomyPoseDecision;
    facialIdentity: FacialIdentityDecision;
    typographyEmbeddedText: TypographyEmbeddedTextDecision;
    brandConsistency: BrandConsistencyDecision;
    platformOptimization: PlatformOptimizationDecision;
  };
  qaReport: ImageQualityAssuranceReport;
  promptCompression: PromptCompressionResult;
  promptRepair?: PromptSelfHealingResult;
  providerCompatibility: ProviderCompatibilityCheckResult;
  semanticEvaluation: ImageSemanticEvaluationResult;
  userFeedbackLink?: UserGenerationFeedback;
  finalMasterPromptText: string;
  outputImageUrl?: string;
  outputFingerprint: string;
  provenance: {
    inputFingerprint: string;
    briefFingerprint: string;
    orchestrationFingerprint: string;
    standardIdentifiers: string[];
    timestamp: string;
  };
  failureReason?: string;
}
