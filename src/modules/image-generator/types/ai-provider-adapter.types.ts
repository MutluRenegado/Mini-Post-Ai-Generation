export interface AIImageProviderRequest {
  promptText: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  seed?: number;
  model?: string;
  timeoutMs?: number;
}

export interface AIImageProviderResponse {
  assetId: string;
  providerName: string;
  modelName: string;
  imageData: Buffer;
  mimeType: string;
  width: number;
  height: number;
  durationMs: number;
  promptText: string;
  aspectRatio: string;
}

export interface AIImageProviderError {
  providerName: string;
  code: string;
  message: string;
  retryable: boolean;
}
