import {
  PexelsConfigurationError,
  PexelsAuthenticationError,
  PexelsRateLimitError,
  PexelsNotFoundError,
  PexelsError,
} from './pexels.errors';
import { PexelsRateLimitTracker } from './pexels.rate-limit';
import type { RawPexelsSearchResponse, RawPexelsPhoto, RawPexelsCollectionsResponse } from './pexels.types';

export class PexelsClient {
  private static BASE_URL = 'https://api.pexels.com/v1';

  private static getApiKey(): string {
    const key = process.env.PEXELS_API_KEY;
    if (!key) {
      throw new PexelsConfigurationError('PEXELS_API_KEY is not defined in server environment secrets.');
    }
    return key.trim();
  }

  private static async request<T>(endpoint: string): Promise<T> {
    if (PexelsRateLimitTracker.isExhausted()) {
      throw new PexelsRateLimitError('Pexels API rate limit has been exhausted. Please wait until reset.');
    }

    const apiKey = this.getApiKey();
    const url = `${this.BASE_URL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: apiKey,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      PexelsRateLimitTracker.updateFromHeaders(response.headers);

      if (response.status === 401) {
        throw new PexelsAuthenticationError();
      }
      if (response.status === 429) {
        throw new PexelsRateLimitError();
      }
      if (response.status === 404) {
        throw new PexelsNotFoundError();
      }
      if (!response.ok) {
        throw new PexelsError(`Pexels API HTTP ${response.status}`, 'PEXELS_HTTP_ERROR', response.status);
      }

      const data: T = await response.json();
      return data;
    } catch (err: any) {
      if (err instanceof PexelsError) throw err;
      if (err.name === 'AbortError') {
        throw new PexelsError('Pexels API request timed out after 15 seconds.', 'PEXELS_TIMEOUT', 408);
      }
      throw new PexelsError(`Pexels network error: ${err.message}`, 'PEXELS_NETWORK_ERROR', 500);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  static async search(query: string, page = 1, perPage = 15, orientation?: string): Promise<RawPexelsSearchResponse> {
    const params = new URLSearchParams({
      query: query.trim(),
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (orientation) params.append('orientation', orientation);

    return this.request<RawPexelsSearchResponse>(`/search?${params.toString()}`);
  }

  static async getCurated(page = 1, perPage = 15): Promise<RawPexelsSearchResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    return this.request<RawPexelsSearchResponse>(`/curated?${params.toString()}`);
  }

  static async getPhoto(id: string): Promise<RawPexelsPhoto> {
    return this.request<RawPexelsPhoto>(`/photos/${id}`);
  }

  static async getFeaturedCollections(page = 1, perPage = 15): Promise<RawPexelsCollectionsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    return this.request<RawPexelsCollectionsResponse>(`/collections/featured?${params.toString()}`);
  }

  static async getCollectionMedia(collectionId: string, page = 1, perPage = 15): Promise<RawPexelsSearchResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    return this.request<RawPexelsSearchResponse>(`/collections/${collectionId}?${params.toString()}`);
  }
}
