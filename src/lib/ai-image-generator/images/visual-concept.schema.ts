import { z } from 'zod';

export const ConceptPlatformFitSchema = z.object({
  platform: z.string().min(1),
  aspectRatio: z.string().min(1),
  safeAreaCompatibility: z.number().min(0).max(100),
});

export const ConceptScoresSchema = z.object({
  semanticRelevance: z.number().min(0).max(100),
  brandCompatibility: z.number().min(0).max(100),
  platformCompatibility: z.number().min(0).max(100),
  productionFeasibility: z.number().min(0).max(100),
  originality: z.number().min(0).max(100),
  overall: z.number().min(0).max(100),
});

export const VisualConceptCandidateSchema = z.object({
  id: z.string().min(1),
  briefId: z.string().min(1),
  type: z.enum(['literal', 'editorial', 'symbolic']),

  title: z.string().min(1),
  sceneDescription: z.string().min(1),

  primarySubject: z.string().min(1),
  supportingSubjects: z.array(z.string()),

  setting: z.string().min(1),
  action: z.string().min(1),
  visualMetaphor: z.string().optional(),

  emotionalEffect: z.string().min(1),
  compositionDirection: z.string().min(1),
  colorDirection: z.array(z.string()),
  lightingDirection: z.string().optional(),

  platformFit: ConceptPlatformFitSchema,

  scores: ConceptScoresSchema,

  riskFlags: z.array(z.string()),
  conciseSelectionRationale: z.string().min(1),

  status: z.enum(['candidate', 'selected', 'rejected']),
  createdAt: z.string().min(1),
});
