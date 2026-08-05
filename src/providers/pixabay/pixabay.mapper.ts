import type { RawPixabayPhotoHit } from './pixabay.types';
import type { ExternalImageAsset } from '../external-image-provider.interface';
import type { ImageAssetResult } from '../canonical-image-model';

export class PixabayMapper {
  /**
   * Constructs contributor profile URL when both username and user ID are present
   */
  public static getContributorUrl(user: string, userId?: number): string {
    const cleanUser = (user || '').trim();
    if (cleanUser && userId) {
      return `https://pixabay.com/users/${encodeURIComponent(cleanUser)}-${userId}/`;
    }
    return 'https://pixabay.com';
  }

  /**
   * Maps native RawPixabayPhotoHit to standard ExternalImageAsset
   */
  static toExternalAsset(hit: RawPixabayPhotoHit): ExternalImageAsset {
    const contributorName = hit.user || 'Pixabay Contributor';
    const contributorUrl = this.getContributorUrl(hit.user, hit.user_id);
    const displayImageUrl = hit.largeImageURL || hit.webformatURL || hit.previewURL;
    const pageUrl = hit.pageURL || 'https://pixabay.com';

    return {
      id: hit.id.toString(),
      provider: 'PIXABAY',
      width: hit.imageWidth || hit.webformatWidth || 1920,
      height: hit.imageHeight || hit.webformatHeight || 1080,
      url: pageUrl,
      photographerName: contributorName,
      photographerUrl: contributorUrl,
      sourceImageUrl: displayImageUrl,
      thumbnailUrl: hit.previewURL || displayImageUrl,
      altText: hit.tags || `Photo by ${contributorName} on Pixabay`,
      attributionText: `by ${contributorName} via Pixabay`,
      attributionUrl: pageUrl,
      raw: hit,
    };
  }

  /**
   * Maps native RawPixabayPhotoHit to Canonical ImageAssetResult
   */
  static toCanonicalAsset(hit: RawPixabayPhotoHit): ImageAssetResult {
    const width = hit.imageWidth || hit.webformatWidth || 1920;
    const height = hit.imageHeight || hit.webformatHeight || 1080;
    const ratio = width / height;
    let aspectRatio = '1:1';
    if (ratio > 1.5) aspectRatio = '16:9';
    else if (ratio < 0.75) aspectRatio = '9:16';
    else if (ratio < 0.9) aspectRatio = '4:5';

    const contributorName = hit.user || 'Pixabay Contributor';
    const contributorUrl = this.getContributorUrl(hit.user, hit.user_id);
    const displayImageUrl = hit.largeImageURL || hit.webformatURL || hit.previewURL;
    const pageUrl = hit.pageURL || 'https://pixabay.com';

    return {
      id: hit.id.toString(),
      source: 'PIXABAY',
      kind: 'STOCK',
      url: displayImageUrl,
      previewUrl: hit.webformatURL || displayImageUrl,
      thumbnailUrl: hit.previewURL || displayImageUrl,
      width,
      height,
      aspectRatio,
      mimeType: 'image/jpeg',
      altText: hit.tags || `Photo by ${contributorName} on Pixabay`,
      creator: {
        name: contributorName,
        url: contributorUrl,
      },
      sourcePage: pageUrl,
      attribution: {
        text: `by ${contributorName} via Pixabay`,
        url: pageUrl,
      },
      license: 'Pixabay Content License',
      providerMetadata: {
        views: hit.views || 0,
        downloads: hit.downloads || 0,
        likes: hit.likes || 0,
        comments: hit.comments || 0,
        tags: hit.tags || '',
        user_id: hit.user_id,
        type: hit.type,
        raw: hit,
      },
    };
  }
}
