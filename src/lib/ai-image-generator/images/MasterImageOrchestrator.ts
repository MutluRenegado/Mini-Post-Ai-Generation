import crypto from 'crypto';
import { FinalPostAnalyzer, FinalPostAnalysisInput } from './finalPostAnalyzer';
import { CameraViewpointEngine } from './CameraViewpointEngine';
import { LightingIntelligenceEngine } from './LightingIntelligenceEngine';
import { CompositionHierarchyEngine } from './CompositionHierarchyEngine';
import { SubjectInteractionEngine } from './SubjectInteractionEngine';
import { MaterialTextureEngine } from './MaterialTextureEngine';
import { SpatialPhysicalConsistencyEngine } from './SpatialPhysicalConsistencyEngine';
import { EmotionalNarrativeEngine } from './EmotionalNarrativeEngine';
import { HumanAnatomyPoseEngine } from './HumanAnatomyPoseEngine';
import { FacialIdentityEngine } from './FacialIdentityEngine';
import { TypographyEmbeddedTextEngine } from './TypographyEmbeddedTextEngine';
import { BrandConsistencyEngine } from './BrandConsistencyEngine';
import { PlatformAspectRatioEngine } from './PlatformAspectRatioEngine';
import { ImageQualityAssuranceEngine } from './ImageQualityAssuranceEngine';
import { PromptCompressionEngine } from './PromptCompressionEngine';
import { PromptSelfHealingEngine } from './PromptSelfHealingEngine';
import { PromptSelfHealingResult } from './prompt-self-healing.types';
import { ProviderCompatibilityEngine } from './ProviderCompatibilityEngine';
import { ImageSemanticEvaluationEngine } from './ImageSemanticEvaluationEngine';
import { UserFeedbackEngine } from './UserFeedbackEngine';
import { Level32to50PipelineResult } from './master-image-orchestrator.types';

export class MasterImageOrchestrator {
  public static runPipeline(input: FinalPostAnalysisInput & {
    userBrandKit?: any;
    providerId?: string;
    explicitTextMode?: boolean;
    userFeedback?: any;
  }): Level32to50PipelineResult {
    // Step 1: Text-First Validation
    if (!input.standaloneImageMode && (!input.postContent || input.postContent.trim().length === 0)) {
      throw new Error('UNFINISHED_TEXT_REJECTED: Image generation requires finalized approved post content.');
    }

    // Step 2 & 3: Normalization & Brief Analysis (Levels 15-31)
    const brief = FinalPostAnalyzer.analyze(input);
    const inputFingerprint = brief.deterministicFingerprint;

    // Step 4: Levels 32-43 Intelligence Resolution
    const camera = CameraViewpointEngine.resolve({
      domain: brief.semanticSubject?.domain,
      topic: input.postTopic,
      content: input.postContent || brief.centralMessage,
      platform: brief.platform,
      primarySubject: brief.primarySubject,
      environment: brief.setting,
    });

    const lighting = LightingIntelligenceEngine.resolve({
      domain: brief.semanticSubject?.domain,
      topic: input.postTopic,
      content: input.postContent || brief.centralMessage,
      mood: brief.mood,
      environment: brief.setting,
    });

    const composition = CompositionHierarchyEngine.resolve({
      primarySubject: brief.primarySubject,
      secondarySubjects: brief.secondarySubjects,
      environment: brief.setting,
      platform: brief.platform,
      textOverlayRequested: input.explicitTextMode,
    });

    const subjectInteraction = SubjectInteractionEngine.resolve({
      primarySubject: brief.primarySubject,
      secondarySubjects: brief.secondarySubjects,
      action: brief.action,
      content: input.postContent || brief.centralMessage,
    });

    const materialTexture = MaterialTextureEngine.resolve({
      domain: brief.semanticSubject?.domain,
      topic: input.postTopic,
      content: input.postContent || brief.centralMessage,
      environment: brief.setting,
    });

    const spatialPhysical = SpatialPhysicalConsistencyEngine.resolve({
      primarySubject: brief.primarySubject,
      secondarySubjects: brief.secondarySubjects,
      environment: brief.setting,
      content: input.postContent || brief.centralMessage,
    });

    const emotionalNarrative = EmotionalNarrativeEngine.resolve({
      topic: input.postTopic,
      content: input.postContent || brief.centralMessage,
      mood: brief.mood,
      tone: brief.tone,
      audience: brief.audience,
    });

    const humanAnatomyPose = HumanAnatomyPoseEngine.resolve({
      primarySubject: brief.primarySubject,
      action: brief.action,
      content: input.postContent || brief.centralMessage,
    });

    const facialIdentity = FacialIdentityEngine.resolve({
      primarySubject: brief.primarySubject,
      secondarySubjects: brief.secondarySubjects,
      intendedEmotion: emotionalNarrative.intendedEmotion,
      content: input.postContent || brief.centralMessage,
    });

    const typographyEmbeddedText = TypographyEmbeddedTextEngine.resolve({
      requestedText: input.explicitTextMode ? brief.primarySubject : undefined,
      postContent: input.postContent || brief.centralMessage,
      platform: brief.platform,
      explicitTextMode: input.explicitTextMode,
    });

    const brandConsistency = BrandConsistencyEngine.resolve({
      userBrandKit: input.userBrandKit,
      domain: brief.semanticSubject?.domain,
    });

    const platformOptimization = PlatformAspectRatioEngine.resolve({
      platform: brief.platform,
      primarySubject: brief.primarySubject,
      centralMessage: brief.centralMessage,
    });

    // Step 5: Build Master Prompt Text
    const rawMasterPrompt = `Professional photograph of ${brief.primarySubject} in ${brief.setting}. ${camera.shotType} shot with ${camera.lensCharacteristic}, ${lighting.lightSource} lighting with ${lighting.softness}. ${materialTexture.primarySurface.textureDescription}. ${emotionalNarrative.intendedEmotion} emotional mood. Color palette: ${brandConsistency.resolvedColors.primary}, ${brandConsistency.resolvedColors.secondary}. High detail 85mm editorial photography, highly detailed, crisp focus.`;

    // Step 6: Level 44 Quality Assurance & Standards Validation
    const qaReport = ImageQualityAssuranceEngine.evaluate({
      promptText: rawMasterPrompt,
      platform: brief.platform,
      contrastRatio: typographyEmbeddedText.contrastRatio,
      wordCount: typographyEmbeddedText.wordCount,
      isAnatomicallySound: humanAnatomyPose.isAnatomicallySound,
      isPhysicallyPlausible: spatialPhysical.isPhysicallyPlausible,
      fingerprint: inputFingerprint,
    });

    // Step 7: Level 45 Prompt Compression
    const promptCompression = PromptCompressionEngine.compress(rawMasterPrompt);

    // Step 8: Level 46 Self-Healing & Repair
    let promptRepair: PromptSelfHealingResult | undefined = undefined;
    let finalMasterPromptText = promptCompression.compressedPromptText;

    if (!humanAnatomyPose.isAnatomicallySound || !spatialPhysical.isPhysicallyPlausible || qaReport.overallDisposition === 'FAIL') {
      promptRepair = PromptSelfHealingEngine.repair({
        promptText: promptCompression.compressedPromptText,
        anatomyRiskDetected: !humanAnatomyPose.isAnatomicallySound,
        spatialImpossibilityDetected: !spatialPhysical.isPhysicallyPlausible,
      });
      finalMasterPromptText = promptRepair.repairedPromptText;
    }

    // Step 9: Level 47 Provider & Model Compatibility Check
    const providerCompatibility = ProviderCompatibilityEngine.checkCompatibility({
      providerId: input.providerId || 'google',
      aspectRatio: platformOptimization.aspectRatio,
      promptTextLength: finalMasterPromptText.length,
    });

    // Step 10 & 11: Level 48 Semantic Evaluation
    const semanticEvaluation = ImageSemanticEvaluationEngine.evaluate({
      postContent: brief.centralMessage,
      briefSummary: `${brief.primarySubject} in ${brief.setting}`,
      promptText: finalMasterPromptText,
    });

    // Step 12: Level 49 User Feedback Linkage
    let userFeedbackLink: any = undefined;
    if (input.userFeedback) {
      userFeedbackLink = UserFeedbackEngine.recordFeedback(input.userFeedback);
    }

    // Step 13: Provenance & Output Fingerprint
    const payload = `${inputFingerprint}|${finalMasterPromptText}|${providerCompatibility.providerId}|${semanticEvaluation.overallStatus}`;
    const outputFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    const success = providerCompatibility.isCompatible && (qaReport.overallDisposition === 'PASS' || qaReport.overallDisposition === 'WARNING');

    return {
      success,
      brief,
      intelligence: {
        camera,
        lighting,
        composition,
        subjectInteraction,
        materialTexture,
        spatialPhysical,
        emotionalNarrative,
        humanAnatomyPose,
        facialIdentity,
        typographyEmbeddedText,
        brandConsistency,
        platformOptimization,
      },
      qaReport,
      promptCompression,
      promptRepair,
      providerCompatibility,
      semanticEvaluation,
      userFeedbackLink,
      finalMasterPromptText,
      outputFingerprint,
      provenance: {
        inputFingerprint,
        briefFingerprint: brief.deterministicFingerprint,
        orchestrationFingerprint: outputFingerprint,
        standardIdentifiers: ['AccessibilityStandard', 'ColorStandard', 'TypographyStandard', 'SizingStandard', 'ContentPolicyStandard'],
        timestamp: new Date().toISOString(),
      },
      failureReason: success ? undefined : (providerCompatibility.incompatibilityReasons ? providerCompatibility.incompatibilityReasons.join('; ') : 'QA_VALIDATION_FAILURE'),
    };
  }
}
