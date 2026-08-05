import { z } from 'zod';

export const QAFindingSchema = z.object({
  ruleId: z.string(),
  sourceStandard: z.string(),
  severity: z.enum(['info', 'warning', 'error']),
  affectedField: z.string(),
  evidence: z.string(),
  repairability: z.enum(['auto_repairable', 'requires_regeneration', 'fatal']),
  repairAction: z.string().optional(),
  disposition: z.enum(['PASS', 'REPAIRED', 'REJECTED']),
});

export const ImageQualityAssuranceReportSchema = z.object({
  overallDisposition: z.enum(['PASS', 'WARNING', 'FAIL']),
  findings: z.array(QAFindingSchema),
  totalRuleCount: z.number(),
  passedCount: z.number(),
  repairedCount: z.number(),
  failedCount: z.number(),
  provenanceComplete: z.boolean(),
  deterministicFingerprint: z.string(),
});
