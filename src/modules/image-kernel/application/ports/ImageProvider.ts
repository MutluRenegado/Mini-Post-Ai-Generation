export interface ImageProviderRequest {
  readonly prompt: string;
  readonly negativePrompt: string;
  readonly aspectRatio: string;
  readonly requestId: string;
}

export interface ImageProviderResult {
  readonly provider: string;
  readonly assetUrl?: string;
  readonly assetId?: string;
  readonly raw?: unknown;
}

export interface ImageProvider {
  readonly name: string;
  generate(request: ImageProviderRequest): Promise<ImageProviderResult>;
}
