import { z } from 'zod';

export const RegenerationAttemptSchema = z.object({
  attemptNumber: z.number().min(1),
  prompt: z.object({
    id: z.string().min(1),
    briefId: z.string().min(1),
    version: z.number().min(1),
    promptText: z.string().min(1),
  }),
  responseAsset: z.object({
    id: z.string().min(1),
    url: z.string().min(1),
  }).optional(),
  auditResult: z.object({
    overallScore: z.number(),
    pass: z.boolean(),
  }).optional(),
  correctionsApplied: z.array(z.string()).optional(),
  durationMs: z.number().min(0),
  timestamp: z.string().min(1),
});

export const RegenerationSessionSchema = z.object({
  id: z.string().min(1),

  ownerId: z.string().optional(),
  sourcePostId: z.string().optional(),

  briefId: z.string().min(1),
  conceptId: z.string().min(1),
  compositionPlanId: z.string().min(1),

  initialPromptId: z.string().min(1),
  currentPromptId: z.string().min(1),

  attempts: z.array(z.any()),

  currentAttempt: z.number().min(0),
  maxAttempts: z.number().min(1),
  targetQualityScore: z.number().min(0).max(100),

  bestImageVersionId: z.string().optional(),
  selectedImageVersionId: z.string().optional(),

  status: z.enum([
    'pending',
    'generating',
    'auditing',
    'repairing',
    'passed',
    'failed',
    'blocked',
    'cancelled',
  ]),

  startedAt: z.string().min(1),
  completedAt: z.string().optional(),
});
