import type { RawPixabaySearchResponse } from './pixabay.types';

interface CacheEntry {
  timestamp: number;
  data: RawPixabaySearchResponse;
}

export class PixabayCacheManager {
  private static cache = new Map<string, CacheEntry>();
  // 24 hours TTL per Pixabay API Guidelines (86,400,000 ms)
  private static TTL_MS = 24 * 60 * 60 * 1000;

  /**
   * Generates a normalized cache key excluding API keys, credentials, and tokens.
   */
  public static generateKey(params: {
    query: string;
    page?: number;
    perPage?: number;
    orientation?: string;
    colors?: string;
    safeSearch?: boolean;
    lang?: string;
    category?: string;
    minWidth?: number;
    minHeight?: number;
    order?: string;
    imageType?: string;
  }): string {
    const rawQuery = (params.query || '').trim().toLowerCase();
    const truncatedQuery = rawQuery.slice(0, 100);
    const validPage = Math.max(params.page || 1, 1);
    
    let orientationParam = 'all';
    if (params.orientation === 'landscape' || params.orientation === 'horizontal') orientationParam = 'horizontal';
    else if (params.orientation === 'portrait' || params.orientation === 'vertical') orientationParam = 'vertical';

    const parts = [
      `q=${truncatedQuery}`,
      `page=${validPage}`,
      `per_page=${params.perPage || 20}`,
      `orientation=${orientationParam}`,
      `colors=${(params.colors || '').toLowerCase()}`,
      `safesearch=${params.safeSearch !== false}`,
      `lang=${(params.lang || 'en').toLowerCase()}`,
      `category=${(params.category || '').toLowerCase()}`,
      `min_width=${params.minWidth || 0}`,
      `min_height=${params.minHeight || 0}`,
      `order=${(params.order || 'popular').toLowerCase()}`,
      `image_type=${(params.imageType || 'photo').toLowerCase()}`,
    ];
    return parts.join('&');
  }

  public static get(key: string): RawPixabaySearchResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Verify 24-hour expiration window
    if (Date.now() - entry.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  public static set(key: string, data: RawPixabaySearchResponse): void {
    this.cache.set(key, {
      timestamp: Date.now(),
      data,
    });
  }

  public static clear(): void {
    this.cache.clear();
  }

  public static size(): number {
    return this.cache.size;
  }
}
