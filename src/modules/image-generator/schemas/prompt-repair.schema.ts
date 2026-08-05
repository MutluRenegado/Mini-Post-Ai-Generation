import { z } from 'zod';
import { MasterImagePromptSchema } from './master-image-prompt.schema';

export const PromptFindingSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  severity: z.enum(['blocking', 'error', 'warning', 'info']),
  message: z.string().min(1),
  field: z.string().optional(),
  repairable: z.boolean(),
});

export const PromptValidationReportSchema = z.object({
  promptId: z.string().min(1),
  valid: z.boolean(),
  score: z.number().min(0).max(100),
  findings: z.array(PromptFindingSchema),
  auditedAt: z.string(),
});

export const PromptRepairResultSchema = z.object({
  repaired: z.boolean(),
  originalPrompt: MasterImagePromptSchema,
  repairedPrompt: MasterImagePromptSchema,
  appliedRepairs: z.array(z.string()),
  findingsBefore: z.array(PromptFindingSchema),
  findingsAfter: z.array(PromptFindingSchema),
});
