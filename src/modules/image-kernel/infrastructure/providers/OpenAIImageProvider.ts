import type { ImageProvider, ImageProviderRequest, ImageProviderResult } from '../../application/ports/ImageProvider';

export interface OpenAIImageClient {
  generateImage(input: { prompt: string; size: string }): Promise<unknown>;
}

export class OpenAIImageProvider implements ImageProvider {
  public readonly name = 'openai';
  public constructor(private readonly client: OpenAIImageClient) {}
  public async generate(request: ImageProviderRequest): Promise<ImageProviderResult> {
    const raw = await this.client.generateImage({ prompt: `${request.prompt}\nNegative constraints: ${request.negativePrompt}`, size: request.aspectRatio });
    return { provider: this.name, raw };
  }
}
