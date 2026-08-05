export interface MasterImagePrompt {
  id: string;
  briefId: string;
  conceptId: string;
  compositionId: string;
  promptText: string;
  subject: string;
  environment: string;
  lighting: string;
  color: string;
  platform: string;
  constraints: string[];
  version: number;
  fingerprint: string;
  providerReady: boolean;
  createdAt: string;
}
