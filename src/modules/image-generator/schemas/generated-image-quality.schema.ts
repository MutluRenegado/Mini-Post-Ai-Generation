import { z } from 'zod';

export const GeneratedImageFindingSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  severity: z.enum(['blocking', 'error', 'warning', 'info']),
  message: z.string().min(1),
  category: z.enum(['payload', 'format', 'dimension', 'composition', 'safeArea', 'semantic']),
  repairable: z.boolean(),
});

export const GeneratedImageQualityResultSchema = z.object({
  assetId: z.string().min(1),
  passed: z.boolean(),
  score: z.number().min(0).max(100),
  findings: z.array(GeneratedImageFindingSchema),
  auditedAt: z.string(),
  recommendations: z.array(z.string()),
  unavailableChecks: z.array(z.string()),
});
