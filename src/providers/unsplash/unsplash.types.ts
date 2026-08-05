export type UnsplashOrientation = 'landscape' | 'portrait' | 'squarish' | 'square';
export type UnsplashOrderBy = 'relevant' | 'latest';

export interface UnsplashSearchInput {
  query: string;
  page?: number;
  perPage?: number;
  orientation?: UnsplashOrientation;
  color?: string;
  orderBy?: UnsplashOrderBy;
}

export interface RawUnsplashUser {
  id: string;
  username: string;
  name: string;
  portfolio_url?: string;
  links: {
    html: string;
    photos: string;
  };
  profile_image?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

export interface RawUnsplashUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

export interface RawUnsplashLinks {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

export interface RawUnsplashPhotoHit {
  id: string;
  width: number;
  height: number;
  color?: string;
  blur_hash?: string;
  description?: string;
  alt_description?: string;
  urls: RawUnsplashUrls;
  links: RawUnsplashLinks;
  likes: number;
  user: RawUnsplashUser;
}

export interface RawUnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: RawUnsplashPhotoHit[];
}

export interface UnsplashRateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
