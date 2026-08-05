import { z } from 'zod';

export const GeneratedImageProblemSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  category: z.enum([
    'semantic_relevance',
    'concept_fidelity',
    'composition',
    'lighting',
    'color_harmony',
    'brand_alignment',
    'platform_fit',
    'technical_quality',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().min(1),
  impactScore: z.number().min(0).max(100),
});

export const ImageCorrectionRecommendationSchema = z.object({
  id: z.string().min(1),
  problemCode: z.string().min(1),
  targetSection: z.enum([
    'subject',
    'environment',
    'composition',
    'lighting',
    'color',
    'style',
    'platform',
    'constraints',
    'userRefinement',
  ]),
  action: z.enum(['modify', 'add', 'remove', 'rebalance']),
  recommendedInstruction: z.string().min(1),
  expectedScoreImprovement: z.number().min(1).max(50),
});

export const GeneratedImageQualityResultSchema = z.object({
  id: z.string().min(1),
  assetId: z.string().min(1),

  briefId: z.string().min(1),
  conceptId: z.string().min(1),
  compositionPlanId: z.string().min(1),
  promptId: z.string().min(1),
  promptVersion: z.number().min(1),

  overallScore: z.number().min(0).max(100),
  passThreshold: z.number().min(0).max(100),
  pass: z.boolean(),

  scores: z.object({
    semanticRelevance: z.number().min(0).max(100),
    conceptFidelity: z.number().min(0).max(100),
    subjectCorrectness: z.number().min(0).max(100),
    settingCorrectness: z.number().min(0).max(100),
    actionCorrectness: z.number().min(0).max(100),

    composition: z.number().min(0).max(100),
    focalClarity: z.number().min(0).max(100),
    visualHierarchy: z.number().min(0).max(100),

    lighting: z.number().min(0).max(100),
    colorHarmony: z.number().min(0).max(100),
    brandSuitability: z.number().min(0).max(100),

    platformSuitability: z.number().min(0).max(100),
    cropResilience: z.number().min(0).max(100),
    safeZoneCompliance: z.number().min(0).max(100),

    technicalQuality: z.number().min(0).max(100),
    sharpness: z.number().min(0).max(100),
    resolution: z.number().min(0).max(100),
    artifactControl: z.number().min(0).max(100),
    accessibility: z.number().min(0).max(100),
  }),

  detectedProblems: z.array(GeneratedImageProblemSchema),
  correctionRecommendations: z.array(ImageCorrectionRecommendationSchema),

  semanticFidelity: z
    .object({
      primarySubjectFidelity: z.number().min(0).max(100),
      occupationFidelity: z.number().min(0).max(100),
      actionFidelity: z.number().min(0).max(100),
      objectFidelity: z.number().min(0).max(100),
      environmentFidelity: z.number().min(0).max(100),
      domainFidelity: z.number().min(0).max(100),
      conceptFidelity: z.number().min(0).max(100),
      overallSemanticFidelity: z.number().min(0).max(100),
    })
    .optional(),

  analysisMethods: z.array(z.string()),
  unavailableChecks: z.array(z.string()),

  auditedAt: z.string().min(1),
});

