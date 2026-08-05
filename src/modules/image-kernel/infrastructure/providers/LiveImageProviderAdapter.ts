import type { ImageProvider, ImageProviderRequest, ImageProviderResult } from '../../application/ports/ImageProvider';
import { ImageGenerationProvider } from '@/lib/ai-image-generator/images/ImageGenerationProvider';

export class LiveImageProviderAdapter implements ImageProvider {
  public readonly name = 'live-image-provider';

  public async generate(request: ImageProviderRequest): Promise<ImageProviderResult> {
    const fullPrompt = `${request.prompt}\nNegative Constraints: ${request.negativePrompt}`;
    const raw = await ImageGenerationProvider.generateImage(fullPrompt, {
      aspectRatio: request.aspectRatio || '1:1',
      versionId: request.requestId,
    });

    return {
      provider: this.name,
      assetUrl: raw.url,
      assetId: raw.versionId || request.requestId,
      raw,
    };
  }
}
