import assert from 'assert';
import { test, describe } from 'node:test';
import {
  StockProviderRouter,
  ProviderUnknownError,
} from '../providers/stock-provider-router';
import { PexelsProvider } from '../providers/pexels/pexels.provider';
import { PixabayProvider } from '../providers/pixabay/pixabay.provider';
import { UnsplashProvider } from '../providers/unsplash/unsplash.provider';

describe('Level 3: Stock Provider Registry & Router Test Suite', () => {
  const router = new StockProviderRouter();

  test('1. Resolves real PexelsProvider instance by name (case-insensitive)', () => {
    const providerLower = router.getProvider('pexels');
    assert.strictEqual(providerLower instanceof PexelsProvider, true);
    assert.strictEqual(providerLower.providerId, 'PEXELS');

    const providerUpper = router.getProvider('PEXELS');
    assert.strictEqual(providerUpper instanceof PexelsProvider, true);
  });

  test('2. Recognizes pixabay and unsplash as valid provider names', () => {
    assert.strictEqual(router.isKnownProvider('pixabay'), true);
    assert.strictEqual(router.isKnownProvider('unsplash'), true);
    assert.strictEqual(router.isKnownProvider('PIXABAY'), true);
    assert.strictEqual(router.isKnownProvider('UNSPLASH'), true);
  });

  test('3. Resolves active PixabayProvider and UnsplashProvider instances', () => {
    const pixabay = router.getProvider('pixabay');
    assert.strictEqual(pixabay instanceof PixabayProvider, true);

    const unsplash = router.getProvider('unsplash');
    assert.strictEqual(unsplash instanceof UnsplashProvider, true);
  });

  test('4. Rejects unknown provider names with ProviderUnknownError', () => {
    assert.throws(
      () => {
        router.getProvider('unknown-provider-xyz');
      },
      (err: any) => err instanceof ProviderUnknownError && err.code === 'PROVIDER_UNKNOWN' && err.statusCode === 400
    );
  });

  test('5. Reports accurate provider status matrix', () => {
    const active = router.getActiveProviders();
    assert.deepStrictEqual(active.map((a) => a.toUpperCase()), ['PEXELS', 'PIXABAY', 'UNSPLASH']);

    const statuses = router.getProviderStatuses();
    assert.strictEqual(statuses.length, 3);
    
    const pexelsStatus = statuses.find((s) => s.provider === 'pexels');
    assert.strictEqual(pexelsStatus?.status, 'active');

    const pixabayStatus = statuses.find((s) => s.provider === 'pixabay');
    assert.strictEqual(pixabayStatus?.status, 'active');

    const unsplashStatus = statuses.find((s) => s.provider === 'unsplash');
    assert.strictEqual(unsplashStatus?.status, 'active');
  });
});
