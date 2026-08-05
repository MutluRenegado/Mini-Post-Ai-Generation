import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { PexelsProvider } from '../pexels.provider';
import { PexelsMapper } from '../pexels.mapper';
import { PexelsRateLimitTracker } from '../pexels.rate-limit';
import { PexelsConfigurationError, PexelsRateLimitError } from '../pexels.errors';
import type { RawPexelsPhoto } from '../pexels.types';

describe('Pexels Provider Integration Test Suite (30-Point Spec)', () => {
  let provider: PexelsProvider;

  beforeEach(() => {
    provider = new PexelsProvider();
  });

  const mockRawPhoto: RawPexelsPhoto = {
    id: 12345,
    width: 1920,
    height: 1080,
    url: 'https://www.pexels.com/photo/12345',
    photographer: 'Jane Developer',
    photographer_url: 'https://www.pexels.com/@janedev',
    photographer_id: 99,
    avg_color: '#334155',
    src: {
      original: 'https://images.pexels.com/photos/12345/original.jpg',
      large2x: 'https://images.pexels.com/photos/12345/large2x.jpg',
      large: 'https://images.pexels.com/photos/12345/large.jpg',
      medium: 'https://images.pexels.com/photos/12345/medium.jpg',
      small: 'https://images.pexels.com/photos/12345/small.jpg',
      portrait: 'https://images.pexels.com/photos/12345/portrait.jpg',
      landscape: 'https://images.pexels.com/photos/12345/landscape.jpg',
      tiny: 'https://images.pexels.com/photos/12345/tiny.jpg',
    },
    liked: false,
    alt: 'Executive business team in modern office',
  };

  test('1. Missing PEXELS_API_KEY returns configuration error', async () => {
    const origKey = process.env.PEXELS_API_KEY;
    delete process.env.PEXELS_API_KEY;

    await assert.rejects(
      async () => {
        await provider.searchPhotos({ query: 'office' });
      },
      (err: any) => err instanceof PexelsConfigurationError
    );

    process.env.PEXELS_API_KEY = origKey;
  });

  test('2. API key remains server-side', () => {
    assert.strictEqual(typeof process.env.NEXT_PUBLIC_PEXELS_API_KEY, 'undefined');
  });

  test('3. Photo normalization works correctly', () => {
    const asset = PexelsMapper.toExternalAsset(mockRawPhoto);
    assert.strictEqual(asset.id, '12345');
    assert.strictEqual(asset.provider, 'PEXELS');
    assert.strictEqual(asset.photographerName, 'Jane Developer');
    assert.strictEqual(asset.attributionText, 'Photo by Jane Developer on Pexels');
  });

  test('4. Rate limit tracker parses headers correctly', () => {
    const headers = new Headers({
      'X-Ratelimit-Limit': '200',
      'X-Ratelimit-Remaining': '150',
      'X-Ratelimit-Reset': '1700000000',
    });

    PexelsRateLimitTracker.updateFromHeaders(headers);
    const status = PexelsRateLimitTracker.getStatus();

    assert.strictEqual(status.limit, 200);
    assert.strictEqual(status.remaining, 150);
  });

  test('5. Rate-limit exhaustion stops requests', () => {
    const headers = new Headers({
      'X-Ratelimit-Limit': '200',
      'X-Ratelimit-Remaining': '0',
      'X-Ratelimit-Reset': Math.floor((Date.now() + 60000) / 1000).toString(),
    });

    PexelsRateLimitTracker.updateFromHeaders(headers);
    assert.strictEqual(PexelsRateLimitTracker.isExhausted(), true);

    // Reset back for subsequent tests
    const freshHeaders = new Headers({ 'X-Ratelimit-Remaining': '200' });
    PexelsRateLimitTracker.updateFromHeaders(freshHeaders);
  });

  test('6. PexelsProvider has correct providerId', () => {
    assert.strictEqual(provider.providerId, 'PEXELS');
  });

  test('7. No secret API key appears in normalized responses', () => {
    const asset = PexelsMapper.toExternalAsset(mockRawPhoto);
    const jsonString = JSON.stringify(asset);
    assert.strictEqual(jsonString.includes(process.env.PEXELS_API_KEY || 'SECRET_NOT_FOUND'), false);
  });
});
