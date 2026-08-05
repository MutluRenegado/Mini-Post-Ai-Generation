import crypto from 'crypto';
import { VisualIntelligenceBrief, BrandDirection } from './visual-intelligence.types';
import { VisualIntelligenceBriefSchema } from './visual-intelligence.schema';
import { SemanticSubjectIntelligence } from './semanticSubjectIntelligence';
import { VisualStoryEngine } from './VisualStoryEngine';
import { SceneGraphEngine } from './SceneGraphEngine';
import { SpatialReasoningEngine } from './SpatialReasoningEngine';
import { OccupationInteractionEngine } from './OccupationInteractionEngine';
import { EnvironmentAuthenticityEngine } from './EnvironmentAuthenticityEngine';
import { VisualStyleColorEngine } from './VisualStyleColorEngine';
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

export interface FinalPostAnalysisInput {
  sourcePostId?: string;
  postTopic?: string;
  postContent: string;
  platform?: string;
  postType?: string;
  brandContext?: BrandDirection;
  campaignContext?: string;
  standaloneImageMode?: boolean;
}

export class FinalPostAnalyzer {
  public static sanitizePostText(rawText: string): string {
    if (!rawText) return '';

    let clean = rawText
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
      .replace(/(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3,4}[\s-]?\d{4}/g, '')
      .replace(/\b\d{3}[-.\s]\d{4}\b/g, '')
      .replace(/(\?|&)(utm_[a-z]+|fbclid|gclid)=[^&\s]+/gi, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return clean;
  }

  public static generateFingerprint(sanitizedText: string, platform: string): string {
    const input = `${sanitizedText.toLowerCase()}||${platform.toLowerCase()}`;
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  public static analyze(input: FinalPostAnalysisInput): VisualIntelligenceBrief {
    const {
      sourcePostId,
      postTopic,
      postContent,
      platform = 'LinkedIn',
      postType = 'Standard Feed Post',
      brandContext,
      campaignContext,
      standaloneImageMode = false,
    } = input;

    if (!standaloneImageMode && (!postContent || postContent.trim().length === 0)) {
      throw new Error('FINALIZED_POST_REQUIRED: Post content is required to generate a VisualIntelligenceBrief.');
    }

    const rawContent = postContent || postTopic || 'Modern business update';
    const sanitizedText = this.sanitizePostText(rawContent);

    if (!standaloneImageMode && sanitizedText.length === 0) {
      throw new Error('SANITIZATION_EMPTY_POST: Post content contains no usable text after removing sensitive data and URLs.');
    }

    const fingerprint = this.generateFingerprint(sanitizedText, platform);
    const briefId = `vib_${fingerprint.slice(0, 12)}`;

    let aspectRatio = '1:1';
    let safeAreas = { top: 20, right: 20, bottom: 20, left: 20 };

    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('story') || lowerPlatform.includes('reel') || lowerPlatform.includes('tiktok')) {
      aspectRatio = '9:16';
      safeAreas = { top: 80, right: 20, bottom: 120, left: 20 };
    } else if (lowerPlatform.includes('portrait') || lowerPlatform.includes('instagram feed')) {
      aspectRatio = '4:5';
      safeAreas = { top: 30, right: 20, bottom: 30, left: 20 };
    } else if (lowerPlatform.includes('facebook') || lowerPlatform.includes('linkedin')) {
      aspectRatio = '1.91:1';
      safeAreas = { top: 20, right: 30, bottom: 20, left: 30 };
    } else if (lowerPlatform.includes('x') || lowerPlatform.includes('twitter') || lowerPlatform.includes('youtube')) {
      aspectRatio = '16:9';
      safeAreas = { top: 20, right: 40, bottom: 20, left: 40 };
    } else if (lowerPlatform.includes('pinterest')) {
      aspectRatio = '2:3';
      safeAreas = { top: 40, right: 20, bottom: 40, left: 20 };
    }

    const semanticExtraction = SemanticSubjectIntelligence.extract(sanitizedText, briefId);

    const brief: VisualIntelligenceBrief = {
      id: briefId,
      sourcePostId,
      centralMessage: sanitizedText.slice(0, 150),
      communicationObjective: `Drive engagement and visual clarity for: ${semanticExtraction.domain}`,

      primarySubject: semanticExtraction.primarySubject,
      secondarySubjects: semanticExtraction.secondarySubjects,

      setting: semanticExtraction.environment,
      action: semanticExtraction.visibleActions.join(' and '),

      audience: semanticExtraction.audience,
      mood: semanticExtraction.mood,
      tone: 'Professional and authoritative',
      emotionalEffect: semanticExtraction.emotionalEffect,

      literalVisualDirection: `High-resolution visual depicting ${semanticExtraction.primarySubject} inside ${semanticExtraction.environment}`,
      conceptualVisualDirection: `Metaphorical scene illustrating ${semanticExtraction.visibleActions[0]} with visible ${semanticExtraction.physicalObjects[0]}`,
      visualMetaphor: semanticExtraction.visualMetaphors[0] || 'Concrete professional representation',

      brandDirection: brandContext || {
        personality: 'Modern, Premium, Tech-Forward',
        palette: ['#00F0FF', '#0F172A', '#38BDF8'],
      },

      campaignContext,

      platform,
      postType,
      aspectRatio,
      safeAreas,

      textOverlayAllowance: true,
      colorDirection: brandContext?.palette || ['#00F0FF', '#0F172A', '#38BDF8'],

      prohibitedElements: [
        'watermarks',
        'unintended text',
        'blurry subjects',
        'malformed hands',
        'low quality artifacts',
        ...(brandContext?.visualRestrictions || []),
        ...semanticExtraction.elementsThatMustNeverAppear,
      ],
      safetyRestrictions: ['no explicit content', 'no trademarked logos', 'no personal identifiers'],

      stockSearchKeywords: semanticExtraction.visualKeywords,
      negativeConcepts: Array.from(new Set([
        ...semanticExtraction.elementsThatMustNeverAppear,
        'cluttered background',
        'dark gloomy mood',
        'overcrowded scene',
        'grainy texture',
      ])),

      sanitizedSourceSummary: sanitizedText.slice(0, 200),
      generationTimestamp: new Date().toISOString(),
      deterministicFingerprint: fingerprint,

      semanticSubject: semanticExtraction,
    };

    // Levels 26-31 Engine execution
    const storyResult = VisualStoryEngine.generateStory(brief, semanticExtraction);
    brief.visualStory = storyResult.story;

    const graphResult = SceneGraphEngine.buildGraph(brief, storyResult.story, semanticExtraction);
    brief.sceneGraph = graphResult.graph;

    const spatialResult = SpatialReasoningEngine.planSpatialLayout(brief, storyResult.story, graphResult.graph);
    brief.spatialLayout = spatialResult.layout;

    const interactionResult = OccupationInteractionEngine.planInteractions(brief, graphResult.graph, spatialResult.layout);
    brief.occupationInteractionPlan = interactionResult.plan;

    const envResult = EnvironmentAuthenticityEngine.planEnvironment(brief, graphResult.graph, spatialResult.layout, interactionResult.plan);
    brief.environmentAuthenticityPlan = envResult.plan;

    const styleResult = VisualStyleColorEngine.planStyle(brief, graphResult.graph, spatialResult.layout, interactionResult.plan, envResult.plan);
    brief.visualStyleColorPlan = styleResult.plan;

    // Levels 32-43 Engine execution
    brief.cameraViewpointPlan = CameraViewpointEngine.resolve({
      domain: semanticExtraction.domain,
      topic: postTopic,
      content: sanitizedText,
      platform,
      primarySubject: brief.primarySubject,
      environment: brief.setting,
    });

    brief.lightingIntelligencePlan = LightingIntelligenceEngine.resolve({
      domain: semanticExtraction.domain,
      topic: postTopic,
      content: sanitizedText,
      mood: brief.mood,
      environment: brief.setting,
    });

    brief.compositionHierarchyPlan = CompositionHierarchyEngine.resolve({
      primarySubject: brief.primarySubject,
      secondarySubjects: brief.secondarySubjects,
      environment: brief.setting,
      platform,
    });

    brief.subjectInteractionPlan = SubjectInteractionEngine.resolve({
      primarySubject: brief.primarySubject,
      secondarySubjects: brief.secondarySubjects,
      action: brief.action,
      content: sanitizedText,
    });

    brief.materialTexturePlan = MaterialTextureEngine.resolve({
      domain: semanticExtraction.domain,
      topic: postTopic,
      content: sanitizedText,
      environment: brief.setting,
    });

    brief.spatialPhysicalConsistencyPlan = SpatialPhysicalConsistencyEngine.resolve({
      primarySubject: brief.primarySubject,
      secondarySubjects: brief.secondarySubjects,
      environment: brief.setting,
      content: sanitizedText,
    });

    brief.emotionalNarrativePlan = EmotionalNarrativeEngine.resolve({
      topic: postTopic,
      content: sanitizedText,
      mood: brief.mood,
      tone: brief.tone,
      audience: brief.audience,
    });

    brief.humanAnatomyPosePlan = HumanAnatomyPoseEngine.resolve({
      primarySubject: brief.primarySubject,
      action: brief.action,
      content: sanitizedText,
    });

    brief.facialIdentityPlan = FacialIdentityEngine.resolve({
      primarySubject: brief.primarySubject,
      secondarySubjects: brief.secondarySubjects,
      intendedEmotion: brief.emotionalNarrativePlan.intendedEmotion,
      content: sanitizedText,
    });

    brief.typographyEmbeddedTextPlan = TypographyEmbeddedTextEngine.resolve({
      postContent: sanitizedText,
      platform,
    });

    brief.brandConsistencyPlan = BrandConsistencyEngine.resolve({
      domain: semanticExtraction.domain,
    });

    brief.platformOptimizationPlan = PlatformAspectRatioEngine.resolve({
      platform,
      primarySubject: brief.primarySubject,
      centralMessage: brief.centralMessage,
    });

    // Validate structured brief against schema
    VisualIntelligenceBriefSchema.parse(brief);

    return brief;
  }
}
