import type {
  ExternalImageProvider,
  ExternalImageSearchInput,
  ExternalImageSearchResult,
  ExternalImageAsset,
  CollectionListInput,
  CollectionListResult,
} from '../external-image-provider.interface';
import { PexelsClient } from './pexels.client';
import { PexelsMapper } from './pexels.mapper';
import { PexelsRateLimitTracker } from './pexels.rate-limit';

export class PexelsProvider implements ExternalImageProvider {
  public readonly providerId = 'PEXELS';

  async searchPhotos(input: ExternalImageSearchInput): Promise<ExternalImageSearchResult> {
    const page = input.page || 1;
    const perPage = Math.min(input.perPage || 15, 50);

    const raw = input.query
      ? await PexelsClient.search(input.query, page, perPage, input.orientation)
      : await PexelsClient.getCurated(page, perPage);

    const assets = raw.photos.map((p) => PexelsMapper.toExternalAsset(p));

    return {
      provider: this.providerId,
      page: raw.page,
      perPage: raw.per_page,
      totalResults: raw.total_results,
      assets,
      rateLimit: PexelsRateLimitTracker.getStatus(),
    };
  }

  async getPhoto(id: string): Promise<ExternalImageAsset> {
    const raw = await PexelsClient.getPhoto(id);
    return PexelsMapper.toExternalAsset(raw);
  }

  async listCollections(input: CollectionListInput = {}): Promise<CollectionListResult> {
    const page = input.page || 1;
    const perPage = Math.min(input.perPage || 15, 50);

    const raw = await PexelsClient.getFeaturedCollections(page, perPage);
    const collections = raw.collections.map((c) => PexelsMapper.toExternalCollection(c));

    return {
      provider: this.providerId,
      page: raw.page,
      perPage: raw.per_page,
      totalResults: raw.total_results,
      collections,
    };
  }

  async getCollectionPhotos(
    collectionId: string,
    input: ExternalImageSearchInput = { query: '' }
  ): Promise<ExternalImageSearchResult> {
    const page = input.page || 1;
    const perPage = Math.min(input.perPage || 15, 50);

    const raw = await PexelsClient.getCollectionMedia(collectionId, page, perPage);
    const assets = (raw.photos || []).map((p) => PexelsMapper.toExternalAsset(p));

    return {
      provider: this.providerId,
      page: raw.page || page,
      perPage: raw.per_page || perPage,
      totalResults: raw.total_results || assets.length,
      assets,
      rateLimit: PexelsRateLimitTracker.getStatus(),
    };
  }
}
