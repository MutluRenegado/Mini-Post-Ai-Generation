import {
  PixabayConfigurationError,
  PixabayAuthenticationError,
  PixabayRateLimitError,
  PixabayNotFoundError,
  PixabayValidationError,
  PixabayError,
} from './pixabay.errors';
import { PixabayRateLimitTracker } from './pixabay.rate-limit';
import { PixabayCacheManager } from './pixabay.cache';
import type { RawPixabaySearchResponse, PixabaySearchInput, RawPixabayPhotoHit } from './pixabay.types';

export class PixabayClient {
  private static BASE_URL = 'https://pixabay.com/api/';

  private static getApiKey(): string {
    const key = process.env.PIXABAY_API_KEY;
    if (!key || key.trim().length === 0) {
      throw new PixabayConfigurationError('PIXABAY_API_KEY is not defined in server environment secrets.');
    }
    return key.trim();
  }

  /**
   * Encapsulated server-side HTTP request execution with key redaction and 15s timeout
   */
  private static async request<T>(params: Record<string, string>): Promise<T> {
    if (PixabayRateLimitTracker.isExhausted()) {
      throw new PixabayRateLimitError('Pixabay API rate limit has been exhausted. Please wait until reset.');
    }

    const apiKey = this.getApiKey();
    const queryParams = new URLSearchParams({
      key: apiKey,
      ...params,
    });

    const url = `${this.BASE_URL}?${queryParams.toString()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      PixabayRateLimitTracker.updateFromHeaders(response.headers);

      if (response.status === 401 || response.status === 403) {
        throw new PixabayAuthenticationError();
      }
      if (response.status === 429) {
        throw new PixabayRateLimitError();
      }
      if (response.status === 404) {
        throw new PixabayNotFoundError();
      }
      if (!response.ok) {
        throw new PixabayError(`Pixabay API HTTP ${response.status}`, 'PIXABAY_HTTP_ERROR', response.status);
      }

      const data: T = await response.json();
      return data;
    } catch (err: any) {
      if (err instanceof PixabayError) throw err;
      if (err.name === 'AbortError') {
        throw new PixabayError('Pixabay API request timed out after 15 seconds.', 'PIXABAY_TIMEOUT', 408);
      }
      throw new PixabayError(`Pixabay network error: ${err.message}`, 'PIXABAY_NETWORK_ERROR', 500);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Main search endpoint with validation, normalization, 24-hour caching, and rate limiting
   */
  static async search(input: PixabaySearchInput): Promise<RawPixabaySearchResponse> {
    const rawQuery = (input.query || '').trim();
    if (!rawQuery) {
      throw new PixabayValidationError('Search query cannot be empty or whitespace only.');
    }

    // 1. Query length cap (maximum 100 characters)
    const truncatedQuery = rawQuery.slice(0, 100);

    // 2. Pagination validation
    const page = Math.max(input.page || 1, 1);
    const perPage = Math.max(3, Math.min(input.perPage || 20, 200));

    // 3. Orientation mapping
    let orientationParam = 'all';
    if (input.orientation === 'landscape') orientationParam = 'horizontal';
    else if (input.orientation === 'portrait') orientationParam = 'vertical';
    else if (input.orientation === 'square') orientationParam = 'all';

    // 4. Defaults
    const imageType = input.imageType || 'photo';
    const safeSearch = input.safeSearch !== false;
    const lang = input.lang || 'en';
    const order = input.order || 'popular';

    // 5. Generate 24-hour cache key
    const cacheKey = PixabayCacheManager.generateKey({
      query: truncatedQuery,
      page,
      perPage,
      orientation: orientationParam,
      colors: input.colors,
      safeSearch,
      lang,
      category: input.category,
      minWidth: input.minWidth,
      minHeight: input.minHeight,
      order,
      imageType,
    });

    // Check cache
    const cachedResponse = PixabayCacheManager.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Prepare URL params
    const requestParams: Record<string, string> = {
      q: truncatedQuery,
      page: page.toString(),
      per_page: perPage.toString(),
      image_type: imageType,
      safesearch: safeSearch ? 'true' : 'false',
      lang,
      order,
    };

    if (orientationParam !== 'all') requestParams.orientation = orientationParam;
    if (input.category) requestParams.category = input.category;
    if (input.colors) requestParams.colors = input.colors;
    if (input.minWidth) requestParams.min_width = input.minWidth.toString();
    if (input.minHeight) requestParams.min_height = input.minHeight.toString();

    // Execute server-side request
    const response = await this.request<RawPixabaySearchResponse>(requestParams);

    // Store in 24-hour cache
    PixabayCacheManager.set(cacheKey, response);

    return response;
  }

  /**
   * Single photo lookup helper
   */
  static async getPhoto(id: string | number): Promise<RawPixabayPhotoHit> {
    const photoId = typeof id === 'number' ? id.toString() : id.trim();
    if (!photoId) {
      throw new PixabayValidationError('Invalid photo ID provided.');
    }

    const response = await this.request<RawPixabaySearchResponse>({
      id: photoId,
    });

    if (!response.hits || response.hits.length === 0) {
      throw new PixabayNotFoundError(`Pixabay photo with ID ${photoId} was not found.`);
    }

    return response.hits[0];
  }
}
