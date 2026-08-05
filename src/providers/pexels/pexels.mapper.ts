import type { RawPexelsPhoto, RawPexelsCollection } from './pexels.types';
import type { ExternalImageAsset, ExternalCollection } from '../external-image-provider.interface';

export class PexelsMapper {
  static toExternalAsset(photo: RawPexelsPhoto): ExternalImageAsset {
    const photographerName = photo.photographer || 'Pexels Contributor';
    const photographerUrl = photo.photographer_url || 'https://www.pexels.com';

    return {
      id: photo.id.toString(),
      provider: 'PEXELS',
      width: photo.width,
      height: photo.height,
      url: photo.url,
      photographerName,
      photographerUrl,
      sourceImageUrl: photo.src.large2x || photo.src.large || photo.src.original,
      thumbnailUrl: photo.src.medium || photo.src.small || photo.src.tiny,
      altText: photo.alt || `Photo by ${photographerName} on Pexels`,
      averageColor: photo.avg_color,
      attributionText: `Photo by ${photographerName} on Pexels`,
      attributionUrl: photo.url,
      raw: photo,
    };
  }

  static toExternalCollection(collection: RawPexelsCollection): ExternalCollection {
    return {
      id: collection.id,
      title: collection.title,
      description: collection.description,
      private: collection.private,
      mediaCount: collection.media_count,
      photosCount: collection.photos_count,
      videosCount: collection.videos_count,
    };
  }
}
