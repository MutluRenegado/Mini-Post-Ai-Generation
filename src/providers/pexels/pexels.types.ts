export interface RawPexelsPhotoSource {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface RawPexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: RawPexelsPhotoSource;
  liked: boolean;
  alt: string;
}

export interface RawPexelsSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  prev_page?: string;
  photos: RawPexelsPhoto[];
}

export interface RawPexelsCollection {
  id: string;
  title: string;
  description?: string;
  private: boolean;
  media_count: number;
  photos_count: number;
  videos_count: number;
}

export interface RawPexelsCollectionsResponse {
  page: number;
  per_page: number;
  total_results: number;
  collections: RawPexelsCollection[];
}

export interface PexelsRateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
