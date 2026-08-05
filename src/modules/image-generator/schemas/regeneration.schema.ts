import { z } from 'zod';
import { MasterImagePromptSchema } from './master-image-prompt.schema';
import { GeneratedImageQualityResultSchema } from './generated-image-quality.schema';
import { AIImageProviderResponseSchema } from './ai-provider-adapter.schema';

export const RegenerationAttemptSchema = z.object({
  attemptNumber: z.number().int().positive(),
  prompt: MasterImagePromptSchema,
  response: AIImageProviderResponseSchema.optional(),
  auditResult: GeneratedImageQualityResultSchema.optional(),
  repairedPrompt: MasterImagePromptSchema.optional(),
  status: z.enum(['passed', 'failed', 'error']),
  timestamp: z.string(),
});

export const RegenerationSessionSchema = z.object({
  sessionId: z.string().min(1),
  maxAttempts: z.number().int().positive(),
  attempts: z.array(RegenerationAttemptSchema),
  status: z.enum(['passed', 'failed', 'max_attempts_exceeded', 'cancelled']),
  bestAttempt: RegenerationAttemptSchema.optional(),
  startedAt: z.string(),
  completedAt: z.string().optional(),
});
