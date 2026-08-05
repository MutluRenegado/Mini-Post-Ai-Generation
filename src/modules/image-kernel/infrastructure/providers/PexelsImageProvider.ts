import type { ImageProvider, ImageProviderRequest, ImageProviderResult } from '../../application/ports/ImageProvider';
import { PexelsService } from '@/lib/services/pexelsService';

export class PexelsImageProvider implements ImageProvider {
  public readonly name = 'pexels';

  public async generate(request: ImageProviderRequest): Promise<ImageProviderResult> {
    const searchRes = await PexelsService.searchPhotos(request.prompt, {
      perPage: 1,
      orientation: request.aspectRatio === '9:16' ? 'portrait' : request.aspectRatio === '16:9' ? 'landscape' : 'square',
    });

    if (!searchRes.photos || searchRes.photos.length === 0) {
      throw new Error(`PEXELS_NO_RESULTS: No stock photos found for prompt "${request.prompt}"`);
    }

    const photo = searchRes.photos[0];
    const assetUrl = photo.src.large2x || photo.src.large || photo.src.original;

    return {
      provider: this.name,
      assetUrl,
      assetId: photo.id.toString(),
      raw: photo,
    };
  }
}
