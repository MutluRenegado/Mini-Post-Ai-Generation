import {
  UnsplashConfigurationError,
  UnsplashAuthenticationError,
  UnsplashRateLimitError,
  UnsplashNotFoundError,
  UnsplashValidationError,
  UnsplashError,
} from './unsplash.errors';
import { UnsplashRateLimitTracker } from './unsplash.rate-limit';
import { UnsplashCacheManager } from './unsplash.cache';
import type { RawUnsplashSearchResponse, UnsplashSearchInput, RawUnsplashPhotoHit } from './unsplash.types';

export class UnsplashClient {
  private static BASE_URL = 'https://api.unsplash.com/';

  private static getAccessKey(): string {
    const key = process.env.UNSPLASH_ACCESS_KEY;
    if (!key || key.trim().length === 0) {
      throw new UnsplashConfigurationError('UNSPLASH_ACCESS_KEY is not defined in server environment secrets.');
    }
    return key.trim();
  }

  /**
   * Encapsulated server-side HTTP request execution with key redaction and 15s timeout
   */
  private static async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (UnsplashRateLimitTracker.isExhausted()) {
      throw new UnsplashRateLimitError('Unsplash API rate limit has been exhausted. Please wait until reset.');
    }

    const accessKey = this.getAccessKey();
    const queryParams = new URLSearchParams(params);
    const queryString = queryParams.toString();
    const fullUrl = `${this.BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      UnsplashRateLimitTracker.updateFromHeaders(response.headers);

      if (response.status === 401 || response.status === 403) {
        throw new UnsplashAuthenticationError();
      }
      if (response.status === 429) {
        throw new UnsplashRateLimitError();
      }
      if (response.status === 404) {
        throw new UnsplashNotFoundError();
      }
      if (!response.ok) {
        throw new UnsplashError(`Unsplash API HTTP ${response.status}`, 'UNSPLASH_HTTP_ERROR', response.status);
      }

      const data: T = await response.json();
      return data;
    } catch (err: any) {
      if (err instanceof UnsplashError) throw err;
      if (err.name === 'AbortError') {
        throw new UnsplashError('Unsplash API request timed out after 15 seconds.', 'UNSPLASH_TIMEOUT', 408);
      }
      throw new UnsplashError(`Unsplash network error: ${err.message}`, 'UNSPLASH_NETWORK_ERROR', 500);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Main search endpoint with validation, normalization, 24-hour caching, and rate limiting
   */
  static async search(input: UnsplashSearchInput): Promise<RawUnsplashSearchResponse> {
    const rawQuery = (input.query || '').trim();
    if (!rawQuery) {
      throw new UnsplashValidationError('Search query cannot be empty or whitespace only.');
    }

    const truncatedQuery = rawQuery.slice(0, 100);
    const page = Math.max(input.page || 1, 1);
    const perPage = Math.max(1, Math.min(input.perPage || 20, 30));

    const cacheKey = UnsplashCacheManager.generateKey({
      query: truncatedQuery,
      page,
      perPage,
      orientation: input.orientation,
      color: input.color,
      orderBy: input.orderBy,
    });

    const cached = UnsplashCacheManager.get(cacheKey);
    if (cached) return cached;

    const params: Record<string, string> = {
      query: truncatedQuery,
      page: page.toString(),
      per_page: perPage.toString(),
    };

    if (input.orientation) params.orientation = input.orientation;
    if (input.color) params.color = input.color;
    if (input.orderBy) params.order_by = input.orderBy;

    const response = await this.request<RawUnsplashSearchResponse>('search/photos', params);
    UnsplashCacheManager.set(cacheKey, response);

    return response;
  }

  /**
   * Single photo lookup helper
   */
  static async getPhoto(id: string): Promise<RawUnsplashPhotoHit> {
    const photoId = (id || '').trim();
    if (!photoId) {
      throw new UnsplashValidationError('Invalid photo ID provided.');
    }

    return this.request<RawUnsplashPhotoHit>(`photos/${encodeURIComponent(photoId)}`);
  }

  /**
   * Required Unsplash download tracking trigger endpoint per API terms
   */
  static async triggerDownload(downloadLocationUrl: string): Promise<void> {
    if (!downloadLocationUrl) return;
    const accessKey = this.getAccessKey();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    try {
      await fetch(downloadLocationUrl, {
        method: 'GET',
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
        signal: controller.signal,
      });
    } catch {
      // Non-blocking download tracking trigger
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
