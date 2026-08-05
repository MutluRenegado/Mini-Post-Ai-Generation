import { MasterImagePrompt } from './master-image-prompt.types';
import { GeneratedImageQualityResult } from './generated-image-quality.types';
import { AIImageProviderResponse } from './ai-provider-adapter.types';

export interface RegenerationAttempt {
  attemptNumber: number;
  prompt: MasterImagePrompt;
  response?: AIImageProviderResponse;
  auditResult?: GeneratedImageQualityResult;
  repairedPrompt?: MasterImagePrompt;
  status: 'passed' | 'failed' | 'error';
  timestamp: string;
}

export interface RegenerationSession {
  sessionId: string;
  maxAttempts: number;
  attempts: RegenerationAttempt[];
  status: 'passed' | 'failed' | 'max_attempts_exceeded' | 'cancelled';
  bestAttempt?: RegenerationAttempt;
  startedAt: string;
  completedAt?: string;
}

export interface PostGenerationCorrectionResult {
  corrected: boolean;
  originalPrompt: MasterImagePrompt;
  repairedPrompt: MasterImagePrompt;
  repairsApplied: string[];
}
