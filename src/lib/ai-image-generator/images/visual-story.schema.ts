import { z } from 'zod';

export const VisualCharacterSchema = z.object({
  role: z.string().min(1),
  relationship: z.string().min(1),
  visualRole: z.enum(['hero', 'supporting', 'contextual']),
  expression: z.string().min(1),
});

export const StoryActionSchema = z.object({
  action: z.string().min(1),
  intensity: z.enum(['subtle', 'moderate', 'dynamic']),
  narrativeImpact: z.string().min(1),
});

export const NarrativeNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    node: z.string().min(1),
    relationship: z.string().min(1),
    children: z.array(z.string()).optional(),
  })
);

export const VisualNarrativeTreeSchema = z.object({
  root: z.string().min(1),
  branches: z.array(NarrativeNodeSchema),
});

export const VisualStoryNarrativeSchema = z.object({
  id: z.string().min(1),
  briefId: z.string().optional(),

  heroStory: z.string().min(1),
  supportingStory: z.string().min(1),
  secondaryNarrative: z.string().min(1),

  interactionFlow: z.array(z.string()),
  visualNarrativeTree: VisualNarrativeTreeSchema,

  who: z.array(VisualCharacterSchema),
  actions: z.array(StoryActionSchema),

  context: z.string().min(1),
  narrativePurpose: z.string().min(1),
  emotionalContext: z.string().min(1),

  requiredVisualEvidence: z.array(z.string()),
  prohibitedImagery: z.array(z.string()),

  storyPriority: z.enum(['hero-first', 'balanced-narrative', 'contextual-story']),
  storyConfidence: z.number().min(0).max(100),

  generatedAt: z.string().min(1),
  fingerprint: z.string().min(1),
});

export const VisualStoryResultSchema = z.object({
  briefId: z.string().optional(),
  story: VisualStoryNarrativeSchema,
  validationScore: z.number().min(0).max(100),
  isValid: z.boolean(),
  generatedAt: z.string().min(1),
});
