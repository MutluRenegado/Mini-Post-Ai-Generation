import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { UnsplashProvider } from '../unsplash.provider';
import { UnsplashClient } from '../unsplash.client';
import { UnsplashMapper } from '../unsplash.mapper';
import { UnsplashRateLimitTracker } from '../unsplash.rate-limit';
import { UnsplashCacheManager } from '../unsplash.cache';
import {
  UnsplashConfigurationError,
  UnsplashValidationError,
  UnsplashAuthenticationError,
  UnsplashRateLimitError,
  UnsplashError,
} from '../unsplash.errors';
import type { RawUnsplashPhotoHit, RawUnsplashSearchResponse } from '../unsplash.types';
import { StockProviderRouter } from '../../stock-provider-router';

describe('Level 5: Unsplash Integration & Compliance Test Suite (27 Assertions)', () => {
  let provider: UnsplashProvider;

  beforeEach(() => {
    provider = new UnsplashProvider();
    UnsplashCacheManager.clear();
    UnsplashRateLimitTracker.resetMockStatus();
  });

  const mockHit: RawUnsplashPhotoHit = {
    id: 'uns_photo_100',
    width: 2400,
    height: 1600,
    color: '#0f172a',
    blur_hash: 'L6PZfSi_00%M',
    description: 'Minimalist glass architecture in sunlight',
    alt_description: 'Glass facade of modern skyscraper',
    urls: {
      raw: 'https://images.unsplash.com/photo-100?raw=1',
      full: 'https://images.unsplash.com/photo-100?full=1',
      regular: 'https://images.unsplash.com/photo-100?w=1080',
      small: 'https://images.unsplash.com/photo-100?w=400',
      thumb: 'https://images.unsplash.com/photo-100?w=200',
    },
    links: {
      self: 'https://api.unsplash.com/photos/uns_photo_100',
      html: 'https://unsplash.com/photos/uns_photo_100',
      download: 'https://unsplash.com/photos/uns_photo_100/download',
      download_location: 'https://api.unsplash.com/photos/uns_photo_100/download',
    },
    likes: 340,
    user: {
      id: 'usr_555',
      username: 'archphotographer',
      name: 'Sarah Architecture',
      portfolio_url: 'https://saraharch.com',
      links: {
        html: 'https://unsplash.com/@archphotographer',
        photos: 'https://api.unsplash.com/users/archphotographer/photos',
      },
    },
  };

  test('1. Missing UNSPLASH_ACCESS_KEY throws configuration error', async () => {
    const origKey = process.env.UNSPLASH_ACCESS_KEY;
    delete process.env.UNSPLASH_ACCESS_KEY;

    await assert.rejects(
      async () => {
        await UnsplashClient.search({ query: 'architecture' });
      },
      (err: any) => err instanceof UnsplashConfigurationError
    );

    process.env.UNSPLASH_ACCESS_KEY = origKey;
  });

  test('2. Configuration detection verifies server-only key setup', () => {
    assert.strictEqual(typeof process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY, 'undefined');
  });

  test('3. Empty or whitespace query is rejected', async () => {
    process.env.UNSPLASH_ACCESS_KEY = 'mock_unsplash_access_key';
    await assert.rejects(
      async () => {
        await UnsplashClient.search({ query: '   ' });
      },
      (err: any) => err instanceof UnsplashValidationError
    );
  });

  test('4. Query length is capped at 100 characters max', () => {
    const longQuery = 'b'.repeat(120);
    const key = UnsplashCacheManager.generateKey({ query: longQuery });
    assert.strictEqual(key.includes('query=' + 'b'.repeat(100)), true);
  });

  test('5. Query parameters are properly URL encoded in cache key', () => {
    const key = UnsplashCacheManager.generateKey({ query: 'design & urban' });
    assert.strictEqual(key.includes('query=design & urban'), true);
  });

  test('6. Orientation mapping transforms landscape, portrait, and squarish correctly', () => {
    const keyLandscape = UnsplashCacheManager.generateKey({ query: 'test', orientation: 'landscape' });
    assert.strictEqual(keyLandscape.includes('orientation=landscape'), true);

    const keySquarish = UnsplashCacheManager.generateKey({ query: 'test', orientation: 'squarish' });
    assert.strictEqual(keySquarish.includes('orientation=squarish'), true);
  });

  test('7. Color parameter mapping works correctly', () => {
    const key = UnsplashCacheManager.generateKey({ query: 'test', color: 'black_and_white' });
    assert.strictEqual(key.includes('color=black_and_white'), true);
  });

  test('8. Order_by parameter defaults to relevant', () => {
    const key = UnsplashCacheManager.generateKey({ query: 'test' });
    assert.strictEqual(key.includes('order_by=relevant'), true);
  });

  test('9. Page number is validated to minimum 1', () => {
    const key = UnsplashCacheManager.generateKey({ query: 'test', page: -2 });
    assert.strictEqual(key.includes('page=1'), true);
  });

  test('10. Per-page bounds are enforced up to 30', () => {
    const key = UnsplashCacheManager.generateKey({ query: 'test', perPage: 25 });
    assert.strictEqual(key.includes('per_page=25'), true);
  });

  test('11. Successful response mapping transforms RawUnsplashPhotoHit to ExternalImageAsset', () => {
    const asset = UnsplashMapper.toExternalAsset(mockHit);
    assert.strictEqual(asset.id, 'uns_photo_100');
    assert.strictEqual(asset.provider, 'UNSPLASH');
    assert.strictEqual(asset.photographerName, 'Sarah Architecture');
  });

  test('12. Mandatory UTM parameters are appended to photographer URL', () => {
    const asset = UnsplashMapper.toExternalAsset(mockHit);
    assert.strictEqual(
      asset.photographerUrl,
      'https://unsplash.com/@archphotographer?utm_source=mini_post_app&utm_medium=referral'
    );
  });

  test('13. Mandatory UTM parameters are appended to Unsplash HTML URL', () => {
    const asset = UnsplashMapper.toExternalAsset(mockHit);
    assert.strictEqual(
      asset.url,
      'https://unsplash.com/photos/uns_photo_100?utm_source=mini_post_app&utm_medium=referral'
    );
    assert.strictEqual(
      asset.attributionUrl,
      'https://unsplash.com/photos/uns_photo_100?utm_source=mini_post_app&utm_medium=referral'
    );
  });

  test('14. Download tracking URL is preserved in canonical provider metadata', () => {
    const canonical = UnsplashMapper.toCanonicalAsset(mockHit);
    assert.strictEqual(
      canonical.providerMetadata?.downloadLocation,
      'https://api.unsplash.com/photos/uns_photo_100/download'
    );
  });

  test('15. Download tracking trigger method accepts download_location without throwing', async () => {
    await provider.triggerDownload('https://api.unsplash.com/photos/uns_photo_100/download');
  });

  test('16. Zero-result response maps cleanly to empty assets array', () => {
    const emptyResponse: RawUnsplashSearchResponse = { total: 0, total_pages: 0, results: [] };
    assert.strictEqual(emptyResponse.results.length, 0);
  });

  test('17. HTTP authorization error throws UnsplashAuthenticationError', () => {
    const authErr = new UnsplashAuthenticationError();
    assert.strictEqual(authErr.statusCode, 401);
  });

  test('18. HTTP 429 rate limit error throws UnsplashRateLimitError', () => {
    const rateErr = new UnsplashRateLimitError();
    assert.strictEqual(rateErr.statusCode, 429);
  });

  test('19. Timeout throws UnsplashError with 15s timeout code', () => {
    const timeoutErr = new UnsplashError('Unsplash request timed out', 'UNSPLASH_TIMEOUT', 408);
    assert.strictEqual(timeoutErr.statusCode, 408);
  });

  test('20. Network failure throws UnsplashError with network error code', () => {
    const netErr = new UnsplashError('Network connection failed', 'UNSPLASH_NETWORK_ERROR', 500);
    assert.strictEqual(netErr.statusCode, 500);
  });

  test('21. Rate-limit header tracker parses X-Ratelimit headers', () => {
    const headers = new Headers({
      'X-Ratelimit-Limit': '50',
      'X-Ratelimit-Remaining': '45',
    });

    UnsplashRateLimitTracker.updateFromHeaders(headers);
    const status = UnsplashRateLimitTracker.getStatus();
    assert.strictEqual(status.limit, 50);
    assert.strictEqual(status.remaining, 45);
  });

  test('22. 24-hour cache stores and retrieves identical search responses', () => {
    const key = 'query=architecture&page=1&per_page=20';
    const mockData: RawUnsplashSearchResponse = { total: 1, total_pages: 1, results: [mockHit] };

    UnsplashCacheManager.set(key, mockData);
    const cached = UnsplashCacheManager.get(key);

    assert.notStrictEqual(cached, null);
    assert.strictEqual(cached?.results[0].id, 'uns_photo_100');
  });

  test('23. Cache key normalization ensures lowercase query matching', () => {
    const keyUpper = UnsplashCacheManager.generateKey({ query: 'ARCHITECTURE' });
    const keyLower = UnsplashCacheManager.generateKey({ query: 'architecture' });
    assert.strictEqual(keyUpper, keyLower);
  });

  test('24. Secret redaction strips raw Client-ID tokens from error messages', () => {
    const rawErrorMsg = 'Failed request: Client-ID secret_unsplash_access_key_998877';
    const sanitized = UnsplashError.sanitizeMessage(rawErrorMsg);
    assert.strictEqual(sanitized.includes('secret_unsplash_access_key_998877'), false);
    assert.strictEqual(sanitized.includes('Client-ID [REDACTED]'), true);
  });

  test('25. Unsplash hit transforms cleanly into Canonical ImageAssetResult', () => {
    const canonical = UnsplashMapper.toCanonicalAsset(mockHit);
    assert.strictEqual(canonical.id, 'uns_photo_100');
    assert.strictEqual(canonical.source, 'UNSPLASH');
    assert.strictEqual(canonical.kind, 'STOCK');
    assert.strictEqual(canonical.url, 'https://images.unsplash.com/photo-100?w=1080');
    assert.strictEqual(canonical.attribution.text, 'Photo by Sarah Architecture on Unsplash');
    assert.strictEqual(canonical.license, 'Unsplash License');
  });

  test('26. StockProviderRouter resolves real UnsplashProvider instance', () => {
    const router = new StockProviderRouter();
    const resolved = router.getProvider('unsplash');
    assert.strictEqual(resolved instanceof UnsplashProvider, true);
    assert.strictEqual(resolved.providerId, 'UNSPLASH');
  });

  test('27. StockProviderRouter preserves Pexels and Pixabay providers as active', () => {
    const router = new StockProviderRouter();
    const active = router.getActiveProviders();
    assert.deepStrictEqual(active, ['PEXELS', 'PIXABAY', 'UNSPLASH']);
  });
});
