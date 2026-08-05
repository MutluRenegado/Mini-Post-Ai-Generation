import type {
  ExternalImageProvider,
  ExternalImageSearchInput,
  ExternalImageSearchResult,
  ExternalImageAsset,
} from '../external-image-provider.interface';
import type { ImageAssetResult } from '../canonical-image-model';
import { UnsplashClient } from './unsplash.client';
import { UnsplashMapper } from './unsplash.mapper';
import { UnsplashRateLimitTracker } from './unsplash.rate-limit';

export class UnsplashProvider implements ExternalImageProvider {
  public readonly providerId = 'UNSPLASH';

  async searchPhotos(input: ExternalImageSearchInput): Promise<ExternalImageSearchResult> {
    const page = input.page || 1;
    const perPage = Math.max(1, Math.min(input.perPage || 20, 30));

    let orientationParam: 'landscape' | 'portrait' | 'squarish' | undefined = undefined;
    if (input.orientation === 'landscape') orientationParam = 'landscape';
    else if (input.orientation === 'portrait') orientationParam = 'portrait';
    else if (input.orientation === 'square') orientationParam = 'squarish';

    const raw = await UnsplashClient.search({
      query: input.query || 'nature',
      page,
      perPage,
      orientation: orientationParam,
      color: input.color,
    });

    const assets = (raw.results || []).map((hit) => UnsplashMapper.toExternalAsset(hit));

    return {
      provider: this.providerId,
      page,
      perPage,
      totalResults: raw.total || assets.length,
      assets,
      rateLimit: UnsplashRateLimitTracker.getStatus(),
    };
  }

  async searchPhotosCanonical(input: ExternalImageSearchInput): Promise<ImageAssetResult[]> {
    const page = input.page || 1;
    const perPage = Math.max(1, Math.min(input.perPage || 20, 30));

    let orientationParam: 'landscape' | 'portrait' | 'squarish' | undefined = undefined;
    if (input.orientation === 'landscape') orientationParam = 'landscape';
    else if (input.orientation === 'portrait') orientationParam = 'portrait';
    else if (input.orientation === 'square') orientationParam = 'squarish';

    const raw = await UnsplashClient.search({
      query: input.query || 'nature',
      page,
      perPage,
      orientation: orientationParam,
      color: input.color,
    });

    return (raw.results || []).map((hit) => UnsplashMapper.toCanonicalAsset(hit));
  }

  async getPhoto(id: string): Promise<ExternalImageAsset> {
    const raw = await UnsplashClient.getPhoto(id);
    return UnsplashMapper.toExternalAsset(raw);
  }

  /**
   * Required download tracking trigger per Unsplash API terms
   */
  async triggerDownload(downloadLocationUrl: string): Promise<void> {
    await UnsplashClient.triggerDownload(downloadLocationUrl);
  }
}
