import { MasterImagePrompt } from './master-image-prompt.types';
import { ImageAssetResult } from '@/providers/canonical-image-model';
import { GeneratedImageQualityResult } from './generated-image-quality.types';

export interface RegenerationAttempt {
  attemptNumber: number;
  prompt: MasterImagePrompt;
  responseAsset?: ImageAssetResult;
  auditResult?: GeneratedImageQualityResult;
  correctionsApplied?: string[];
  durationMs: number;
  timestamp: string;
}

export interface RegenerationSession {
  id: string;

  ownerId?: string;
  sourcePostId?: string;

  briefId: string;
  conceptId: string;
  compositionPlanId: string;

  initialPromptId: string;
  currentPromptId: string;

  attempts: RegenerationAttempt[];

  currentAttempt: number;
  maxAttempts: number;
  targetQualityScore: number;

  bestImageVersionId?: string;
  selectedImageVersionId?: string;

  status:
    | 'pending'
    | 'generating'
    | 'auditing'
    | 'repairing'
    | 'passed'
    | 'failed'
    | 'blocked'
    | 'cancelled';

  startedAt: string;
  completedAt?: string;
}

export interface PostGenerationCorrectionResult {
  corrected: boolean;
  originalPrompt: MasterImagePrompt;
  correctedPrompt: MasterImagePrompt;
  correctionsApplied: string[];
  targetProblemsAddressed: string[];
}
