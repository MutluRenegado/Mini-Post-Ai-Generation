import type { ImageProvider, ImageProviderRequest, ImageProviderResult } from '../../application/ports/ImageProvider';

export interface GeminiImageClient {
  generateImage(input: { prompt: string; negativePrompt: string; aspectRatio: string }): Promise<unknown>;
}

export class GeminiImageProvider implements ImageProvider {
  public readonly name = 'gemini';
  public constructor(private readonly client: GeminiImageClient) {}
  public async generate(request: ImageProviderRequest): Promise<ImageProviderResult> {
    const raw = await this.client.generateImage({ prompt: request.prompt, negativePrompt: request.negativePrompt, aspectRatio: request.aspectRatio });
    return { provider: this.name, raw };
  }
}
