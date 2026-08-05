export interface ExternalImageSearchInput {
  query: string;
  page?: number;
  perPage?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  size?: 'large' | 'medium' | 'small';
  color?: string;
  locale?: string;
}

export interface ExternalImageAsset {
  id: string;
  provider: string;
  width: number;
  height: number;
  url: string;
  photographerName: string;
  photographerUrl: string;
  sourceImageUrl: string;
  thumbnailUrl: string;
  altText: string;
  averageColor?: string;
  attributionText: string;
  attributionUrl: string;
  raw?: any;
}

export interface ExternalImageSearchResult {
  provider: string;
  page: number;
  perPage: number;
  totalResults: number;
  assets: ExternalImageAsset[];
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

export interface CollectionListInput {
  page?: number;
  perPage?: number;
}

export interface ExternalCollection {
  id: string;
  title: string;
  description?: string;
  private: boolean;
  mediaCount: number;
  photosCount: number;
  videosCount: number;
}

export interface CollectionListResult {
  provider: string;
  page: number;
  perPage: number;
  totalResults: number;
  collections: ExternalCollection[];
}

export interface ExternalImageProvider {
  providerId: string;
  searchPhotos(input: ExternalImageSearchInput): Promise<ExternalImageSearchResult>;
  getPhoto(id: string): Promise<ExternalImageAsset>;
  listCollections?(input: CollectionListInput): Promise<CollectionListResult>;
  getCollectionPhotos?(
    collectionId: string,
    input: ExternalImageSearchInput
  ): Promise<ExternalImageSearchResult>;
}
