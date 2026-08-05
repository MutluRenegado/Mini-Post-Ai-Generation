import { MasterImagePrompt } from './master-image-prompt.types';
import { ImageAssetResult } from '@/providers/canonical-image-model';

export interface AIImageGenerationRequest {
  prompt: MasterImagePrompt;
  providerPreference?: string;

  width?: number;
  height?: number;
  aspectRatio: string;

  seed?: number;
  timeoutMs?: number;
}

export interface AIImageGenerationResponse {
  asset: ImageAssetResult;

  provider: string;
  model: string;

  requestId?: string;
  seed?: number;

  width: number;
  height: number;
  mimeType: string;
  fileSize?: number;

  promptVersion: number;

  briefId: string;
  conceptId: string;
  compositionPlanId: string;

  generationStartedAt: string;
  generationCompletedAt: string;

  providerMetadata?: Record<string, unknown>;
}
