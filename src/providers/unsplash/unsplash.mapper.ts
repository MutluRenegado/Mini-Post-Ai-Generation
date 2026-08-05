import type { RawUnsplashPhotoHit } from './unsplash.types';
import type { ExternalImageAsset } from '../external-image-provider.interface';
import type { ImageAssetResult } from '../canonical-image-model';

export class UnsplashMapper {
  private static UTM_PARMS = '?utm_source=mini_post_app&utm_medium=referral';

  /**
   * Appends mandatory Unsplash API referral params to external links
   */
  public static appendUtm(url: string): string {
    if (!url) return 'https://unsplash.com';
    return url.includes('?') ? `${url}&utm_source=mini_post_app&utm_medium=referral` : `${url}${this.UTM_PARMS}`;
  }

  /**
   * Maps native RawUnsplashPhotoHit to standard ExternalImageAsset
   */
  static toExternalAsset(hit: RawUnsplashPhotoHit): ExternalImageAsset {
    const photographerName = hit.user?.name || hit.user?.username || 'Unsplash Photographer';
    const photographerUrl = this.appendUtm(hit.user?.links?.html || `https://unsplash.com/@${hit.user?.username}`);
    const pageUrl = this.appendUtm(hit.links?.html || 'https://unsplash.com');
    const displayImageUrl = hit.urls?.regular || hit.urls?.full || hit.urls?.small;

    return {
      id: hit.id,
      provider: 'UNSPLASH',
      width: hit.width || 1920,
      height: hit.height || 1080,
      url: pageUrl,
      photographerName,
      photographerUrl,
      sourceImageUrl: displayImageUrl,
      thumbnailUrl: hit.urls?.thumb || hit.urls?.small || displayImageUrl,
      altText: hit.alt_description || hit.description || `Photo by ${photographerName} on Unsplash`,
      attributionText: `Photo by ${photographerName} on Unsplash`,
      attributionUrl: pageUrl,
      raw: hit,
    };
  }

  /**
   * Maps native RawUnsplashPhotoHit to Canonical ImageAssetResult
   */
  static toCanonicalAsset(hit: RawUnsplashPhotoHit): ImageAssetResult {
    const width = hit.width || 1920;
    const height = hit.height || 1080;
    const ratio = width / height;
    let aspectRatio = '1:1';
    if (ratio > 1.5) aspectRatio = '16:9';
    else if (ratio < 0.75) aspectRatio = '9:16';
    else if (ratio < 0.9) aspectRatio = '4:5';

    const photographerName = hit.user?.name || hit.user?.username || 'Unsplash Photographer';
    const photographerUrl = this.appendUtm(hit.user?.links?.html || `https://unsplash.com/@${hit.user?.username}`);
    const pageUrl = this.appendUtm(hit.links?.html || 'https://unsplash.com');
    const displayImageUrl = hit.urls?.regular || hit.urls?.full || hit.urls?.small;

    return {
      id: hit.id,
      source: 'UNSPLASH',
      kind: 'STOCK',
      url: displayImageUrl,
      previewUrl: hit.urls?.regular || displayImageUrl,
      thumbnailUrl: hit.urls?.thumb || displayImageUrl,
      width,
      height,
      aspectRatio,
      mimeType: 'image/jpeg',
      altText: hit.alt_description || hit.description || `Photo by ${photographerName} on Unsplash`,
      creator: {
        name: photographerName,
        url: photographerUrl,
      },
      sourcePage: pageUrl,
      attribution: {
        text: `Photo by ${photographerName} on Unsplash`,
        url: pageUrl,
      },
      license: 'Unsplash License',
      providerMetadata: {
        likes: hit.likes || 0,
        downloadLocation: hit.links?.download_location,
        color: hit.color,
        blurHash: hit.blur_hash,
        raw: hit,
      },
    };
  }
}
