import type { RawUnsplashSearchResponse } from './unsplash.types';

interface CacheEntry {
  timestamp: number;
  data: RawUnsplashSearchResponse;
}

export class UnsplashCacheManager {
  private static cache = new Map<string, CacheEntry>();
  // 24 hours TTL per Unsplash API Guidelines (86,400,000 ms)
  private static TTL_MS = 24 * 60 * 60 * 1000;

  /**
   * Generates a normalized cache key excluding API keys, credentials, and tokens.
   */
  public static generateKey(params: {
    query: string;
    page?: number;
    perPage?: number;
    orientation?: string;
    color?: string;
    orderBy?: string;
  }): string {
    const rawQuery = (params.query || '').trim().toLowerCase();
    const truncatedQuery = rawQuery.slice(0, 100);
    const validPage = Math.max(params.page || 1, 1);

    const parts = [
      `query=${truncatedQuery}`,
      `page=${validPage}`,
      `per_page=${params.perPage || 20}`,
      `orientation=${(params.orientation || 'all').toLowerCase()}`,
      `color=${(params.color || '').toLowerCase()}`,
      `order_by=${(params.orderBy || 'relevant').toLowerCase()}`,
    ];
    return parts.join('&');
  }

  public static get(key: string): RawUnsplashSearchResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  public static set(key: string, data: RawUnsplashSearchResponse): void {
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
