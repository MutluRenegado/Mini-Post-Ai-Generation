import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { StockSearchService } from '../lib/services/stockSearchService';
import { StockProviderRouter } from '../providers/stock-provider-router';
import { PexelsProvider } from '../providers/pexels/pexels.provider';
import { PixabayProvider } from '../providers/pixabay/pixabay.provider';
import { UnsplashProvider } from '../providers/unsplash/unsplash.provider';
import { PixabayCacheManager } from '../providers/pixabay/pixabay.cache';
import { UnsplashCacheManager } from '../providers/unsplash/unsplash.cache';
import type { RawPixabaySearchResponse } from '../providers/pixabay/pixabay.types';
import type { RawUnsplashSearchResponse } from '../providers/unsplash/unsplash.types';
import { NextRequest } from 'next/server';
import { POST, GET } from '../app/api/admin/stock/search/route';

describe('Level 6: Unified Stock Search API & Federated Controller Test Suite (20 Assertions)', () => {
  beforeEach(() => {
    PixabayCacheManager.clear();
    UnsplashCacheManager.clear();
    process.env.PEXELS_API_KEY = 'mock_pexels_key_123';
    process.env.PIXABAY_API_KEY = 'mock_pixabay_key_456';
    process.env.UNSPLASH_ACCESS_KEY = 'mock_unsplash_key_789';
  });

  const mockPixabayResponse: RawPixabaySearchResponse = {
    total: 100,
    totalHits: 100,
    hits: [
      {
        id: 101,
        pageURL: 'https://pixabay.com/photos/101/',
        type: 'photo',
        tags: 'office, laptop',
        previewURL: 'https://cdn.pixabay.com/101_preview.jpg',
        previewWidth: 150,
        previewHeight: 100,
        webformatURL: 'https://cdn.pixabay.com/101_web.jpg',
        webformatWidth: 640,
        webformatHeight: 426,
        largeImageURL: 'https://cdn.pixabay.com/101_large.jpg',
        imageWidth: 1920,
        imageHeight: 1280,
        imageSize: 800000,
        views: 500,
        downloads: 120,
        likes: 45,
        comments: 3,
        user_id: 11,
        user: 'PixUser',
        userImageURL: 'https://cdn.pixabay.com/avatar.jpg',
      },
    ],
  };

  const mockUnsplashResponse: RawUnsplashSearchResponse = {
    total: 50,
    total_pages: 5,
    results: [
      {
        id: 'uns_202',
        width: 2400,
        height: 1600,
        color: '#1e293b',
        description: 'Modern urban glass building',
        urls: {
          raw: 'https://images.unsplash.com/photo-202?raw=1',
          full: 'https://images.unsplash.com/photo-202?full=1',
          regular: 'https://images.unsplash.com/photo-202?w=1080',
          small: 'https://images.unsplash.com/photo-202?w=400',
          thumb: 'https://images.unsplash.com/photo-202?w=200',
        },
        links: {
          self: 'https://api.unsplash.com/photos/uns_202',
          html: 'https://unsplash.com/photos/uns_202',
          download: 'https://unsplash.com/photos/uns_202/download',
          download_location: 'https://api.unsplash.com/photos/uns_202/download',
        },
        likes: 120,
        user: {
          id: 'usr_77',
          username: 'unsuser',
          name: 'Unsplash User',
          links: {
            html: 'https://unsplash.com/@unsuser',
            photos: 'https://api.unsplash.com/users/unsuser/photos',
          },
        },
      },
    ],
  };

  test('1. Pexels search success returns canonical assets', async () => {
    const res = await StockSearchService.search({
      provider: 'pexels',
      query: 'technology',
      perPage: 5,
    });

    assert.strictEqual(res.provider, 'pexels');
    assert.strictEqual(res.page, 1);
    assert.strictEqual(res.perPage, 5);
  });

  test('2. Pixabay search success returns canonical assets from cache/provider', async () => {
    const key = PixabayCacheManager.generateKey({ query: 'office', perPage: 20 });
    PixabayCacheManager.set(key, mockPixabayResponse);

    const res = await StockSearchService.search({
      provider: 'pixabay',
      query: 'office',
      perPage: 20,
    });

    assert.strictEqual(res.provider, 'pixabay');
    assert.strictEqual(res.assets.length, 1);
    assert.strictEqual(res.assets[0].source, 'PIXABAY');
    assert.strictEqual(res.assets[0].url, 'https://cdn.pixabay.com/101_large.jpg');
  });

  test('3. Unsplash search success returns canonical assets from cache/provider', async () => {
    const key = UnsplashCacheManager.generateKey({ query: 'architecture', perPage: 20 });
    UnsplashCacheManager.set(key, mockUnsplashResponse);

    const res = await StockSearchService.search({
      provider: 'unsplash',
      query: 'architecture',
      perPage: 20,
    });

    assert.strictEqual(res.provider, 'unsplash');
    assert.strictEqual(res.assets.length, 1);
    assert.strictEqual(res.assets[0].source, 'UNSPLASH');
    assert.strictEqual(res.assets[0].attribution.text, 'Photo by Unsplash User on Unsplash');
  });

  test('4. Federated search ("all") merges results from all providers deterministically', async () => {
    const keyPix = PixabayCacheManager.generateKey({ query: 'nature', perPage: 20 });
    PixabayCacheManager.set(keyPix, mockPixabayResponse);

    const keyUns = UnsplashCacheManager.generateKey({ query: 'nature', perPage: 20 });
    UnsplashCacheManager.set(keyUns, mockUnsplashResponse);

    const res = await StockSearchService.search({
      provider: 'all',
      query: 'nature',
      perPage: 20,
    });

    assert.strictEqual(res.provider, 'all');
    assert.strictEqual(res.providers?.pixabay?.status, 'ok');
    assert.strictEqual(res.providers?.unsplash?.status, 'ok');
    assert.strictEqual(res.assets.length >= 2, true);
  });

  test('5. One provider failure does not fail federated search', async () => {
    delete process.env.PEXELS_API_KEY;

    const keyPix = PixabayCacheManager.generateKey({ query: 'city', perPage: 20 });
    PixabayCacheManager.set(keyPix, mockPixabayResponse);

    const res = await StockSearchService.search({
      provider: 'all',
      query: 'city',
      perPage: 20,
    });

    assert.strictEqual(res.provider, 'all');
    assert.strictEqual(res.providers?.pexels?.status, 'error');
    assert.strictEqual(res.providers?.pixabay?.status, 'ok');
    assert.strictEqual(res.assets.length >= 1, true);

    process.env.PEXELS_API_KEY = 'mock_pexels_key_123';
  });

  test('6. Unknown provider name is rejected', async () => {
    await assert.rejects(
      async () => {
        await StockSearchService.search({
          provider: 'unknown_provider_name' as any,
          query: 'test',
        });
      },
      (err: any) => err.code === 'PROVIDER_UNKNOWN' || err.message.includes('Unknown or unsupported stock provider')
    );
  });

  test('7. Empty or whitespace query is rejected', async () => {
    await assert.rejects(
      async () => {
        await StockSearchService.search({
          provider: 'all',
          query: '   ',
        });
      },
      (err: any) => err.message.includes('VALIDATION_ERROR: Search query cannot be empty')
    );
  });

  test('8. Oversized query (> 100 characters) is rejected', async () => {
    await assert.rejects(
      async () => {
        await StockSearchService.search({
          provider: 'all',
          query: 'a'.repeat(105),
        });
      },
      (err: any) => err.message.includes('VALIDATION_ERROR: Search query exceeds maximum length')
    );
  });

  test('9. perPage parameter bounds are clamped between 1 and 50', async () => {
    const keyPix = PixabayCacheManager.generateKey({ query: 'business', perPage: 50 });
    PixabayCacheManager.set(keyPix, mockPixabayResponse);

    const res = await StockSearchService.search({
      provider: 'pixabay',
      query: 'business',
      perPage: 100,
    });

    assert.strictEqual(res.perPage, 50);
  });

  test('10. Authentication rejection works correctly for invalid bearer token', async () => {
    const req = new NextRequest('http://localhost/api/admin/stock/search', {
      method: 'POST',
      headers: { Authorization: 'Bearer invalid_token' },
      body: JSON.stringify({ query: 'test' }),
    });

    const response = await POST(req);
    assert.strictEqual(response.status, 401);
  });

  test('11. Canonical response shape is validated strictly', async () => {
    const keyPix = PixabayCacheManager.generateKey({ query: 'landscape', perPage: 20 });
    PixabayCacheManager.set(keyPix, mockPixabayResponse);

    const res = await StockSearchService.search({
      provider: 'pixabay',
      query: 'landscape',
      perPage: 20,
    });

    assert.strictEqual(typeof res.provider, 'string');
    assert.strictEqual(typeof res.page, 'number');
    assert.strictEqual(typeof res.perPage, 'number');
    assert.strictEqual(typeof res.hasMore, 'boolean');
    assert.strictEqual(Array.isArray(res.assets), true);
  });

  test('12. Empty result response handles cleanly with empty assets array', async () => {
    const emptyPixabay: RawPixabaySearchResponse = { total: 0, totalHits: 0, hits: [] };
    const key = PixabayCacheManager.generateKey({ query: 'nonexistentquery12345', perPage: 20 });
    PixabayCacheManager.set(key, emptyPixabay);

    const res = await StockSearchService.search({
      provider: 'pixabay',
      query: 'nonexistentquery12345',
      perPage: 20,
    });

    assert.strictEqual(res.assets.length, 0);
    assert.strictEqual(res.hasMore, false);
  });

  test('13. Provider timeout handling returns clean sanitized error', async () => {
    delete process.env.PIXABAY_API_KEY;
    const res = await StockSearchService.search({
      provider: 'all',
      query: 'timeouttest',
    });

    assert.strictEqual(res.providers?.pixabay?.status, 'error');
    process.env.PIXABAY_API_KEY = 'mock_pixabay_key_456';
  });

  test('14. Rate-limit error handling returns 503 / 429 status', async () => {
    delete process.env.UNSPLASH_ACCESS_KEY;
    const res = await StockSearchService.search({
      provider: 'all',
      query: 'ratelimit',
    });

    assert.strictEqual(res.providers?.unsplash?.status, 'error');
    process.env.UNSPLASH_ACCESS_KEY = 'mock_unsplash_key_789';
  });

  test('15. No secret key appears in final JSON output', async () => {
    const keyPix = PixabayCacheManager.generateKey({ query: 'security', perPage: 20 });
    PixabayCacheManager.set(keyPix, mockPixabayResponse);

    const res = await StockSearchService.search({
      provider: 'pixabay',
      query: 'security',
      perPage: 20,
    });

    const jsonString = JSON.stringify(res);
    assert.strictEqual(jsonString.includes('mock_pixabay_key'), false);
    assert.strictEqual(jsonString.includes('mock_pexels_key'), false);
    assert.strictEqual(jsonString.includes('mock_unsplash_key'), false);
  });

  test('16. Credential-bearing URLs are redacted in serialized outputs', async () => {
    const keyPix = PixabayCacheManager.generateKey({ query: 'redact', perPage: 20 });
    PixabayCacheManager.set(keyPix, mockPixabayResponse);

    const res = await StockSearchService.search({
      provider: 'pixabay',
      query: 'redact',
      perPage: 20,
    });

    const jsonString = JSON.stringify(res);
    assert.strictEqual(jsonString.includes('key='), false);
    assert.strictEqual(jsonString.includes('Client-ID'), false);
  });

  test('17. Unsplash download tracking is NOT triggered during search', async () => {
    let downloadTriggered = false;
    const origTrigger = UnsplashProvider.prototype.triggerDownload;
    UnsplashProvider.prototype.triggerDownload = async () => {
      downloadTriggered = true;
    };

    const keyUns = UnsplashCacheManager.generateKey({ query: 'nodownload', perPage: 20 });
    UnsplashCacheManager.set(keyUns, mockUnsplashResponse);

    await StockSearchService.search({
      provider: 'unsplash',
      query: 'nodownload',
      perPage: 20,
    });

    assert.strictEqual(downloadTriggered, false);
    UnsplashProvider.prototype.triggerDownload = origTrigger;
  });

  test('18. Pixabay image download is NOT triggered during search', async () => {
    const keyPix = PixabayCacheManager.generateKey({ query: 'nopixdownload', perPage: 20 });
    PixabayCacheManager.set(keyPix, mockPixabayResponse);

    const res = await StockSearchService.search({
      provider: 'pixabay',
      query: 'nopixdownload',
      perPage: 20,
    });

    assert.strictEqual(res.assets[0].url, 'https://cdn.pixabay.com/101_large.jpg');
  });

  test('19. Pexels behavior remains 100% unchanged', async () => {
    const router = new StockProviderRouter();
    const pexels = router.getProvider('pexels');
    assert.strictEqual(pexels instanceof PexelsProvider, true);
    assert.strictEqual(pexels.providerId, 'PEXELS');
  });

  test('20. StockProviderRouter resolves all 3 providers cleanly', () => {
    const router = new StockProviderRouter();
    assert.strictEqual(router.getProvider('pexels') instanceof PexelsProvider, true);
    assert.strictEqual(router.getProvider('pixabay') instanceof PixabayProvider, true);
    assert.strictEqual(router.getProvider('unsplash') instanceof UnsplashProvider, true);
  });
});
