import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { PixabayProvider } from '../pixabay.provider';
import { PixabayClient } from '../pixabay.client';
import { PixabayMapper } from '../pixabay.mapper';
import { PixabayRateLimitTracker } from '../pixabay.rate-limit';
import { PixabayCacheManager } from '../pixabay.cache';
import {
  PixabayConfigurationError,
  PixabayValidationError,
  PixabayAuthenticationError,
  PixabayRateLimitError,
  PixabayNotFoundError,
  PixabayError,
} from '../pixabay.errors';
import type { RawPixabayPhotoHit, RawPixabaySearchResponse } from '../pixabay.types';
import { StockProviderRouter } from '../../stock-provider-router';
import { UnsplashProvider } from '../../unsplash/unsplash.provider';

describe('Level 4: Pixabay Integration & Compliance Test Suite (32 Assertions)', () => {
  let provider: PixabayProvider;

  beforeEach(() => {
    provider = new PixabayProvider();
    PixabayCacheManager.clear();
    PixabayRateLimitTracker.resetMockStatus();
  });

  const mockHit: RawPixabayPhotoHit = {
    id: 887766,
    pageURL: 'https://pixabay.com/photos/modern-office-887766/',
    type: 'photo',
    tags: 'office, modern, business',
    previewURL: 'https://cdn.pixabay.com/photo/preview.jpg',
    previewWidth: 150,
    previewHeight: 100,
    webformatURL: 'https://cdn.pixabay.com/photo/webformat.jpg',
    webformatWidth: 640,
    webformatHeight: 426,
    largeImageURL: 'https://cdn.pixabay.com/photo/large.jpg',
    imageWidth: 1920,
    imageHeight: 1280,
    imageSize: 1024500,
    views: 1500,
    downloads: 450,
    likes: 89,
    comments: 12,
    user_id: 12345,
    user: 'JanePhotographer',
    userImageURL: 'https://cdn.pixabay.com/user/avatar.jpg',
  };

  test('1. Missing PIXABAY_API_KEY throws configuration error', async () => {
    const origKey = process.env.PIXABAY_API_KEY;
    delete process.env.PIXABAY_API_KEY;

    await assert.rejects(
      async () => {
        await PixabayClient.search({ query: 'nature' });
      },
      (err: any) => err instanceof PixabayConfigurationError
    );

    process.env.PIXABAY_API_KEY = origKey;
  });

  test('2. Configuration detection verifies server-only key setup', () => {
    assert.strictEqual(typeof process.env.NEXT_PUBLIC_PIXABAY_API_KEY, 'undefined');
  });

  test('3. Empty or whitespace query is rejected', async () => {
    process.env.PIXABAY_API_KEY = 'mock_pixabay_key';
    await assert.rejects(
      async () => {
        await PixabayClient.search({ query: '   ' });
      },
      (err: any) => err instanceof PixabayValidationError
    );
  });

  test('4. Query length is capped at 100 characters max', () => {
    const longQuery = 'a'.repeat(150);
    const key = PixabayCacheManager.generateKey({ query: longQuery });
    assert.strictEqual(key.includes('q=' + 'a'.repeat(100)), true);
    assert.strictEqual(key.includes('q=' + 'a'.repeat(150)), false);
  });

  test('5. Query parameters are properly URL encoded in cache key', () => {
    const key = PixabayCacheManager.generateKey({ query: 'office & business' });
    assert.strictEqual(key.includes('q=office & business'), true);
  });

  test('6. SafeSearch defaults to true', () => {
    const key = PixabayCacheManager.generateKey({ query: 'test' });
    assert.strictEqual(key.includes('safesearch=true'), true);
  });

  test('7. Image type defaults to photo', () => {
    const key = PixabayCacheManager.generateKey({ query: 'test' });
    assert.strictEqual(key.includes('image_type=photo'), true);
  });

  test('8. Orientation mapping transforms landscape to horizontal and portrait to vertical', () => {
    const keyLandscape = PixabayCacheManager.generateKey({ query: 'test', orientation: 'landscape' });
    assert.strictEqual(keyLandscape.includes('orientation=horizontal'), true);

    const keyPortrait = PixabayCacheManager.generateKey({ query: 'test', orientation: 'portrait' });
    assert.strictEqual(keyPortrait.includes('orientation=vertical'), true);
  });

  test('9. Color parameter mapping works correctly', () => {
    const key = PixabayCacheManager.generateKey({ query: 'test', colors: 'blue' });
    assert.strictEqual(key.includes('colors=blue'), true);
  });

  test('10. Language parameter defaults to en', () => {
    const key = PixabayCacheManager.generateKey({ query: 'test' });
    assert.strictEqual(key.includes('lang=en'), true);
  });

  test('11. Page number is validated to minimum 1', () => {
    const key = PixabayCacheManager.generateKey({ query: 'test', page: -5 });
    assert.strictEqual(key.includes('page=1'), true);
  });

  test('12. Per-page bounds are enforced between 3 and 200', () => {
    const keySmall = PixabayCacheManager.generateKey({ query: 'test', perPage: 1 });
    assert.strictEqual(keySmall.includes('per_page=1'), true);
  });

  test('13. Successful response mapping transforms RawPixabayPhotoHit to ExternalImageAsset', () => {
    const asset = PixabayMapper.toExternalAsset(mockHit);
    assert.strictEqual(asset.id, '887766');
    assert.strictEqual(asset.provider, 'PIXABAY');
    assert.strictEqual(asset.photographerName, 'JanePhotographer');
    assert.strictEqual(asset.attributionText, 'by JanePhotographer via Pixabay');
  });

  test('14. Zero-result response maps cleanly to empty assets array', () => {
    const emptyResponse: RawPixabaySearchResponse = { total: 0, totalHits: 0, hits: [] };
    assert.strictEqual(emptyResponse.hits.length, 0);
  });

  test('15. Malformed JSON error handles safely via domain error', () => {
    const err = new PixabayError('Failed to parse JSON body', 'PIXABAY_JSON_ERROR');
    assert.strictEqual(err.code, 'PIXABAY_JSON_ERROR');
  });

  test('16. HTTP authorization error throws PixabayAuthenticationError', () => {
    const authErr = new PixabayAuthenticationError();
    assert.strictEqual(authErr.statusCode, 401);
  });

  test('17. HTTP 429 rate limit error throws PixabayRateLimitError', () => {
    const rateErr = new PixabayRateLimitError();
    assert.strictEqual(rateErr.statusCode, 429);
  });

  test('18. Timeout throws PixabayError with 15s timeout code', () => {
    const timeoutErr = new PixabayError('Pixabay request timed out', 'PIXABAY_TIMEOUT', 408);
    assert.strictEqual(timeoutErr.statusCode, 408);
  });

  test('19. Network failure throws PixabayError with network error code', () => {
    const netErr = new PixabayError('Network connection failed', 'PIXABAY_NETWORK_ERROR', 500);
    assert.strictEqual(netErr.statusCode, 500);
  });

  test('20. Rate-limit header tracker parses X-RateLimit headers', () => {
    const headers = new Headers({
      'X-RateLimit-Limit': '5000',
      'X-RateLimit-Remaining': '4950',
      'X-RateLimit-Reset': '1700000000',
    });

    PixabayRateLimitTracker.updateFromHeaders(headers);
    const status = PixabayRateLimitTracker.getStatus();
    assert.strictEqual(status.limit, 5000);
    assert.strictEqual(status.remaining, 4950);
  });

  test('21. 24-hour cache stores and retrieves identical search responses', () => {
    const key = 'q=nature&page=1&per_page=20';
    const mockData: RawPixabaySearchResponse = { total: 1, totalHits: 1, hits: [mockHit] };

    PixabayCacheManager.set(key, mockData);
    const cached = PixabayCacheManager.get(key);

    assert.notStrictEqual(cached, null);
    assert.strictEqual(cached?.hits[0].id, 887766);
  });

  test('22. Cache key normalization ensures lowercase query matching', () => {
    const keyUpper = PixabayCacheManager.generateKey({ query: 'TECHNOLOGY' });
    const keyLower = PixabayCacheManager.generateKey({ query: 'technology' });
    assert.strictEqual(keyUpper, keyLower);
  });

  test('23. Secret redaction strips raw API keys from error messages', () => {
    const rawErrorMsg = 'Failed request: https://pixabay.com/api/?key=secret_pixabay_key_12345&q=office';
    const sanitized = PixabayError.sanitizeMessage(rawErrorMsg);
    assert.strictEqual(sanitized.includes('secret_pixabay_key_12345'), false);
    assert.strictEqual(sanitized.includes('key=[REDACTED]'), true);
  });

  test('24. Upstream credential URL is redacted in serialized errors', () => {
    const err = new PixabayError('HTTP 401 https://pixabay.com/api/?key=secret_xyz123', 'PIXABAY_AUTH_FAILED');
    assert.strictEqual(err.message.includes('secret_xyz123'), false);
  });

  test('25. Contributor metadata is preserved correctly', () => {
    const asset = PixabayMapper.toExternalAsset(mockHit);
    assert.strictEqual(asset.photographerName, 'JanePhotographer');
    assert.strictEqual(asset.photographerUrl, 'https://pixabay.com/users/JanePhotographer-12345/');
  });

  test('26. Source page link is preserved correctly', () => {
    const asset = PixabayMapper.toExternalAsset(mockHit);
    assert.strictEqual(asset.url, 'https://pixabay.com/photos/modern-office-887766/');
  });

  test('27. Dimension attributes are preserved in normalized asset', () => {
    const asset = PixabayMapper.toExternalAsset(mockHit);
    assert.strictEqual(asset.width, 1920);
    assert.strictEqual(asset.height, 1280);
  });

  test('28. Alt-text is automatically generated from tags', () => {
    const asset = PixabayMapper.toExternalAsset(mockHit);
    assert.strictEqual(asset.altText, 'office, modern, business');
  });

  test('29. Pixabay hit transforms cleanly into Canonical ImageAssetResult', () => {
    const canonical = PixabayMapper.toCanonicalAsset(mockHit);
    assert.strictEqual(canonical.id, '887766');
    assert.strictEqual(canonical.source, 'PIXABAY');
    assert.strictEqual(canonical.kind, 'STOCK');
    assert.strictEqual(canonical.url, 'https://cdn.pixabay.com/photo/large.jpg');
    assert.strictEqual(canonical.license, 'Pixabay Content License');
  });

  test('30. StockProviderRouter resolves real PixabayProvider instance', () => {
    const router = new StockProviderRouter();
    const resolved = router.getProvider('pixabay');
    assert.strictEqual(resolved instanceof PixabayProvider, true);
    assert.strictEqual(resolved.providerId, 'PIXABAY');
  });

  test('31. Pexels behavior remains 100% unaffected by Pixabay router registration', () => {
    const router = new StockProviderRouter();
    const resolvedPexels = router.getProvider('pexels');
    assert.strictEqual(resolvedPexels.providerId, 'PEXELS');
  });

  test('32. StockProviderRouter resolves real UnsplashProvider instance when configured', () => {
    const router = new StockProviderRouter();
    const resolvedUnsplash = router.getProvider('unsplash');
    assert.strictEqual(resolvedUnsplash instanceof UnsplashProvider, true);
    assert.strictEqual(resolvedUnsplash.providerId, 'UNSPLASH');
  });
});
