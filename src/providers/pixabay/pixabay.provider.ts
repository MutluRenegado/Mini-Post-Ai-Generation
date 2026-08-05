import type {
  ExternalImageProvider,
  ExternalImageSearchInput,
  ExternalImageSearchResult,
  ExternalImageAsset,
} from '../external-image-provider.interface';
import type { ImageAssetResult } from '../canonical-image-model';
import { PixabayClient } from './pixabay.client';
import { PixabayMapper } from './pixabay.mapper';
import { PixabayRateLimitTracker } from './pixabay.rate-limit';

export class PixabayProvider implements ExternalImageProvider {
  public readonly providerId = 'PIXABAY';

  async searchPhotos(input: ExternalImageSearchInput): Promise<ExternalImageSearchResult> {
    const page = input.page || 1;
    const perPage = Math.max(3, Math.min(input.perPage || 20, 200));

    const raw = await PixabayClient.search({
      query: input.query || 'nature',
      page,
      perPage,
      orientation: input.orientation,
      colors: input.color,
    });

    const assets = (raw.hits || []).map((hit) => PixabayMapper.toExternalAsset(hit));

    return {
      provider: this.providerId,
      page,
      perPage,
      totalResults: raw.totalHits || raw.total || assets.length,
      assets,
      rateLimit: PixabayRateLimitTracker.getStatus(),
    };
  }

  async searchPhotosCanonical(input: ExternalImageSearchInput): Promise<ImageAssetResult[]> {
    const page = input.page || 1;
    const perPage = Math.max(3, Math.min(input.perPage || 20, 200));

    const raw = await PixabayClient.search({
      query: input.query || 'nature',
      page,
      perPage,
      orientation: input.orientation,
      colors: input.color,
    });

    return (raw.hits || []).map((hit) => PixabayMapper.toCanonicalAsset(hit));
  }

  async getPhoto(id: string): Promise<ExternalImageAsset> {
    const raw = await PixabayClient.getPhoto(id);
    return PixabayMapper.toExternalAsset(raw);
  }
}
