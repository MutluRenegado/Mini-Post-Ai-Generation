export type PixabayImageType = 'all' | 'photo' | 'illustration' | 'vector';
export type PixabayOrientation = 'all' | 'horizontal' | 'vertical';
export type PixabayOrder = 'popular' | 'latest';

export interface PixabaySearchInput {
  query: string;
  page?: number;
  perPage?: number;
  imageType?: PixabayImageType;
  orientation?: 'landscape' | 'portrait' | 'square' | 'all';
  category?: string;
  colors?: string;
  minWidth?: number;
  minHeight?: number;
  order?: PixabayOrder;
  safeSearch?: boolean;
  lang?: string;
}

export interface RawPixabayPhotoHit {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  fullHDURL?: string;
  imageURL?: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface RawPixabaySearchResponse {
  total: number;
  totalHits: number;
  hits: RawPixabayPhotoHit[];
}

export interface PixabayRateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
