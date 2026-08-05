/**
 * Pexels Stock Photo API Service
 * Interacts with Pexels API using process.env.PEXELS_API_KEY
 */

export interface PexelsPhotoSource {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: PexelsPhotoSource;
  liked: boolean;
  alt: string;
}

export interface PexelsSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  prev_page?: string;
  photos: PexelsPhoto[];
}

export interface PexelsSearchOptions {
  page?: number;
  perPage?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  size?: 'large' | 'medium' | 'small';
  color?: string;
  locale?: string;
}

export class PexelsService {
  private static BASE_URL = 'https://api.pexels.com/v1';

  private static getApiKey(): string {
    const key = process.env.PEXELS_API_KEY;
    if (!key) {
      throw new Error('PEXELS_API_KEY_MISSING: process.env.PEXELS_API_KEY is not defined in environment secrets.');
    }
    return key.trim();
  }

  /**
   * Search Pexels stock photos by keyword query.
   */
  static async searchPhotos(query: string, options: PexelsSearchOptions = {}): Promise<PexelsSearchResponse> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      throw new Error('INVALID_PEXELS_QUERY: Search query cannot be empty.');
    }

    const apiKey = this.getApiKey();

    const params = new URLSearchParams({
      query: cleanQuery,
      page: (options.page || 1).toString(),
      per_page: (options.perPage || 15).toString(),
    });

    if (options.orientation) params.append('orientation', options.orientation);
    if (options.size) params.append('size', options.size);
    if (options.color) params.append('color', options.color);
    if (options.locale) params.append('locale', options.locale);

    const targetUrl = `${this.BASE_URL}/search?${params.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          Authorization: apiKey,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`PEXELS_API_HTTP_ERROR: Pexels API returned status ${response.status}`);
      }

      const data: PexelsSearchResponse = await response.json();
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('PEXELS_API_TIMEOUT: Request to Pexels API timed out after 15 seconds.');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Get curated stock photos from Pexels.
   */
  static async getCuratedPhotos(options: PexelsSearchOptions = {}): Promise<PexelsSearchResponse> {
    const apiKey = this.getApiKey();

    const params = new URLSearchParams({
      page: (options.page || 1).toString(),
      per_page: (options.perPage || 15).toString(),
    });

    const targetUrl = `${this.BASE_URL}/curated?${params.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          Authorization: apiKey,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`PEXELS_API_HTTP_ERROR: Pexels API returned status ${response.status}`);
      }

      const data: PexelsSearchResponse = await response.json();
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('PEXELS_API_TIMEOUT: Request to Pexels API timed out after 15 seconds.');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Retrieve a single photo by Pexels Photo ID.
   */
  static async getPhotoById(id: number | string): Promise<PexelsPhoto> {
    const apiKey = this.getApiKey();

    const targetUrl = `${this.BASE_URL}/photos/${id}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          Authorization: apiKey,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`PEXELS_API_HTTP_ERROR: Pexels API returned status ${response.status}`);
      }

      const data: PexelsPhoto = await response.json();
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('PEXELS_API_TIMEOUT: Request to Pexels API timed out after 15 seconds.');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
