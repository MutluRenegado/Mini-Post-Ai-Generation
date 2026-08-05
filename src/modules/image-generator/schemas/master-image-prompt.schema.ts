import { z } from 'zod';

export const MasterImagePromptSchema = z.object({
  id: z.string().min(1),
  briefId: z.string().min(1),
  conceptId: z.string().min(1),
  compositionId: z.string().min(1),
  promptText: z.string().min(1),
  subject: z.string().min(1),
  environment: z.string(),
  lighting: z.string(),
  color: z.string(),
  platform: z.string().min(1),
  constraints: z.array(z.string()),
  version: z.number().int().min(1),
  fingerprint: z.string().length(64),
  providerReady: z.boolean(),
  createdAt: z.string(),
});
