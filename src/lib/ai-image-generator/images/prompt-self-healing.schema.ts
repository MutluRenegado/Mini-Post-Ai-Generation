import { z } from 'zod';

export const PromptRepairActionSchema = z.object({
  iteration: z.number(),
  triggerRule: z.string(),
  issueDescription: z.string(),
  beforeSnippet: z.string(),
  afterSnippet: z.string(),
  standardsReference: z.string(),
});

export const PromptSelfHealingResultSchema = z.object({
  repairedPromptText: z.string(),
  repairedNegativePromptText: z.string(),
  iterationCount: z.number(),
  maxAllowedIterations: z.number(),
  actionsApplied: z.array(PromptRepairActionSchema),
  repairSucceeded: z.boolean(),
  unresolvedDefects: z.array(z.string()).optional(),
  deterministicFingerprint: z.string(),
});
