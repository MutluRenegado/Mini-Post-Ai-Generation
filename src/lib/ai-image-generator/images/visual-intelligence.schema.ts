import { z } from 'zod';
import { SemanticSubjectExtractionSchema } from './semantic-subject.schema';
import { VisualStoryNarrativeSchema } from './visual-story.schema';
import { SceneGraphSchema } from './scene-graph.schema';
import { SpatialLayoutSchema } from './spatial-reasoning.schema';
import { OccupationInteractionPlanSchema } from './occupation-interaction.schema';
import { EnvironmentAuthenticityPlanSchema } from './environment-authenticity.schema';
import { VisualStyleColorPlanSchema } from './visual-style-color.schema';

export const BrandDirectionSchema = z.object({
  brandId: z.string().optional(),
  personality: z.string().optional(),
  palette: z.array(z.string()).optional(),
  typographyDirection: z.string().optional(),
  visualRestrictions: z.array(z.string()).optional(),
});

export const SafeAreasSchema = z.object({
  top: z.number().optional(),
  right: z.number().optional(),
  bottom: z.number().optional(),
  left: z.number().optional(),
});

export const VisualIntelligenceBriefSchema = z.object({
  id: z.string().min(1),
  sourcePostId: z.string().optional(),

  centralMessage: z.string().min(1),
  communicationObjective: z.string().min(1),

  primarySubject: z.string().min(1),
  secondarySubjects: z.array(z.string()),

  setting: z.string().min(1),
  action: z.string().min(1),

  audience: z.string().min(1),
  mood: z.string().min(1),
  tone: z.string().min(1),
  emotionalEffect: z.string().min(1),

  literalVisualDirection: z.string().min(1),
  conceptualVisualDirection: z.string().min(1),
  visualMetaphor: z.string().optional(),

  brandDirection: BrandDirectionSchema.optional(),

  campaignContext: z.string().optional(),

  platform: z.string().min(1),
  postType: z.string().min(1),
  aspectRatio: z.string().min(1),

  safeAreas: SafeAreasSchema,

  textOverlayAllowance: z.boolean(),
  colorDirection: z.array(z.string()),

  prohibitedElements: z.array(z.string()),
  safetyRestrictions: z.array(z.string()),

  stockSearchKeywords: z.array(z.string()),
  negativeConcepts: z.array(z.string()),

  sanitizedSourceSummary: z.string().min(1),
  generationTimestamp: z.string().min(1),
  deterministicFingerprint: z.string().min(1),

  semanticSubject: SemanticSubjectExtractionSchema.optional(),
  visualStory: VisualStoryNarrativeSchema.optional(),
  sceneGraph: SceneGraphSchema.optional(),
  spatialLayout: SpatialLayoutSchema.optional(),
  occupationInteractionPlan: OccupationInteractionPlanSchema.optional(),
  environmentAuthenticityPlan: EnvironmentAuthenticityPlanSchema.optional(),
  visualStyleColorPlan: VisualStyleColorPlanSchema.optional(),
});



