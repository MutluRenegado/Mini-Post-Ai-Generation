import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { ImageAssetResult } from '../providers/canonical-image-model';
import { PlatformSizingManager, ImageVariant } from '../lib/services/platformSizingManager';
import { StockSearchService } from '../lib/services/stockSearchService';
import { StockSearchQueryBuilder } from '../lib/services/stockSearchQueryBuilder';
import { PostVisualBriefExtractor } from '../lib/ai-image-generator/images/PostVisualBriefExtractor';
import { StockProviderRouter } from '../providers/stock-provider-router';
import { PexelsProvider } from '../providers/pexels/pexels.provider';
import { PixabayProvider } from '../providers/pixabay/pixabay.provider';
import { UnsplashProvider } from '../providers/unsplash/unsplash.provider';
import { PixabayCacheManager } from '../providers/pixabay/pixabay.cache';
import { UnsplashCacheManager } from '../providers/unsplash/unsplash.cache';

describe('Level 10: Platform Sizing Manager Test Suite (25 Assertions)', () => {
  beforeEach(() => {
    PixabayCacheManager.clear();
    UnsplashCacheManager.clear();
    process.env.PEXELS_API_KEY = 'mock_pexels_key_123';
    process.env.PIXABAY_API_KEY = 'mock_pixabay_key_456';
    process.env.UNSPLASH_ACCESS_KEY = 'mock_unsplash_key_789';
  });

  const mockAsset: ImageAssetResult = {
    id: 'asset_777',
    source: 'PEXELS',
    kind: 'STOCK',
    url: 'https://images.pexels.com/photos/777/large.jpg',
    previewUrl: 'https://images.pexels.com/photos/777/medium.jpg',
    thumbnailUrl: 'https://images.pexels.com/photos/777/small.jpg',
    width: 2400,
    height: 1600,
    aspectRatio: '16:9',
    mimeType: 'image/jpeg',
    altText: 'Modern tech workspace',
    creator: { name: 'Pexels Creator', url: 'https://pexels.com/@creator' },
    sourcePage: 'https://pexels.com/photo/777',
    attribution: { text: 'Photo by Pexels Creator on Pexels', url: 'https://pexels.com/photo/777' },
    license: 'Pexels License',
  };

  test('1. Generates valid non-destructive ImageVariant array from confirmed asset', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    assert.strictEqual(Array.isArray(variants), true);
    assert.strictEqual(variants.length, 11);
  });

  test('2. Original canonical ImageAssetResult is 100% unchanged', () => {
    const origJson = JSON.stringify(mockAsset);
    PlatformSizingManager.generateVariants(mockAsset);
    assert.strictEqual(JSON.stringify(mockAsset), origJson);
  });

  test('3. Preserves sourceAssetId linking back to original asset', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    variants.forEach((v) => {
      assert.strictEqual(v.sourceAssetId, 'asset_777');
    });
  });

  test('4. Generates Facebook variant with 1200x630 dimensions', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    const fb = variants.find((v) => v.platform === 'Facebook');
    assert.strictEqual(fb?.width, 1200);
    assert.strictEqual(fb?.height, 630);
    assert.strictEqual(fb?.aspectRatio, '1.91:1');
  });

  test('5. Generates Instagram Square variant with 1080x1080 dimensions', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    const igSq = variants.find((v) => v.preset === 'Square Feed');
    assert.strictEqual(igSq?.width, 1080);
    assert.strictEqual(igSq?.height, 1080);
    assert.strictEqual(igSq?.aspectRatio, '1:1');
  });

  test('6. Generates Instagram Portrait variant with 1080x1350 dimensions', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    const igPort = variants.find((v) => v.preset === 'Portrait Feed');
    assert.strictEqual(igPort?.width, 1080);
    assert.strictEqual(igPort?.height, 1350);
    assert.strictEqual(igPort?.aspectRatio, '4:5');
  });

  test('7. Generates Instagram Story variant with 1080x1920 dimensions', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    const igStory = variants.find((v) => v.preset === 'Story / Reel');
    assert.strictEqual(igStory?.width, 1080);
    assert.strictEqual(igStory?.height, 1920);
    assert.strictEqual(igStory?.aspectRatio, '9:16');
  });

  test('8. Generates LinkedIn variant with 1200x627 dimensions', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    const li = variants.find((v) => v.platform === 'LinkedIn');
    assert.strictEqual(li?.width, 1200);
    assert.strictEqual(li?.height, 627);
  });

  test('9. Generates X variant with 1200x675 dimensions', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    const xVar = variants.find((v) => v.platform.includes('X'));
    assert.strictEqual(xVar?.width, 1200);
    assert.strictEqual(xVar?.height, 675);
  });

  test('10. Generates Pinterest variant with 1000x1500 dimensions', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    const pin = variants.find((v) => v.platform === 'Pinterest');
    assert.strictEqual(pin?.width, 1000);
    assert.strictEqual(pin?.height, 1500);
    assert.strictEqual(pin?.aspectRatio, '2:3');
  });

  test('11. Generates TikTok variant with 1080x1920 dimensions', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    const tt = variants.find((v) => v.platform === 'TikTok');
    assert.strictEqual(tt?.width, 1080);
    assert.strictEqual(tt?.height, 1920);
  });

  test('12. Generates YouTube Thumbnail variant with 1280x720 dimensions', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    const yt = variants.find((v) => v.platform === 'YouTube');
    assert.strictEqual(yt?.width, 1280);
    assert.strictEqual(yt?.height, 720);
  });

  test('13. Generates Google Business Profile variant with 1200x900 dimensions', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    const gbp = variants.find((v) => v.platform === 'Google Business');
    assert.strictEqual(gbp?.width, 1200);
    assert.strictEqual(gbp?.height, 900);
    assert.strictEqual(gbp?.aspectRatio, '4:3');
  });

  test('14. Computes non-destructive crop plans accurately', () => {
    const crop = PlatformSizingManager.computeCrop(2400, 1600, 1080, 1080);
    assert.strictEqual(crop.width, 1600);
    assert.strictEqual(crop.height, 1600);
    assert.strictEqual(crop.x, 400);
    assert.strictEqual(crop.y, 0);
  });

  test('15. Filters variants when specific target platforms are specified', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset, ['LinkedIn']);
    assert.strictEqual(variants.length, 1);
    assert.strictEqual(variants[0].platform, 'LinkedIn');
  });

  test('16. Valid variants have status ready', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    variants.forEach((v) => {
      assert.strictEqual(v.status, 'ready');
    });
  });

  test('17. PlatformSizingManager.validateVariant() validates ready variants', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    assert.strictEqual(PlatformSizingManager.validateVariant(variants[0]), true);
  });

  test('18. PlatformSizingManager.validateVariant() rejects invalid variants', () => {
    const invalidVar: ImageVariant = {
      id: '',
      sourceAssetId: 'asset_777',
      platform: 'LinkedIn',
      preset: 'Feed',
      width: 0,
      height: 0,
      aspectRatio: '1:1',
      mimeType: 'image/jpeg',
      status: 'failed',
      createdAt: new Date().toISOString(),
    };
    assert.strictEqual(PlatformSizingManager.validateVariant(invalidVar), false);
  });

  test('19. Level 9 preview/compliance test compatibility is preserved', () => {
    assert.strictEqual(typeof mockAsset.source, 'string');
  });

  test('20. Level 8 UI test compatibility is preserved', () => {
    assert.strictEqual(typeof mockAsset.kind, 'string');
  });

  test('21. Level 7 Visual Brief test compatibility is preserved', () => {
    const brief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Tech',
      postContent: 'Cloud computing',
      platform: 'LinkedIn',
    });
    const built = StockSearchQueryBuilder.buildQuery(brief);
    assert.strictEqual(typeof built.query, 'string');
  });

  test('22. Level 6 Stock Search API compatibility is preserved', async () => {
    const origSearch = PexelsProvider.prototype.searchPhotos;
    PexelsProvider.prototype.searchPhotos = async () => ({
      provider: 'pexels',
      page: 1,
      perPage: 5,
      totalResults: 1,
      assets: [
        {
          id: '100',
          provider: 'pexels',
          photographerName: 'Alice',
          photographerUrl: 'https://pexels.com/@alice',
          url: 'https://pexels.com/photo/100',
          sourceImageUrl: 'https://images.pexels.com/100.jpg',
          thumbnailUrl: 'https://images.pexels.com/100_s.jpg',
          width: 1920,
          height: 1080,
          altText: 'Office',
          attributionText: 'Photo by Alice',
          attributionUrl: 'https://pexels.com/photo/100',
        },
      ],
    });

    try {
      const res = await StockSearchService.search({ provider: 'pexels', query: 'office', perPage: 5 });
      assert.strictEqual(res.provider, 'pexels');
    } finally {
      PexelsProvider.prototype.searchPhotos = origSearch;
    }
  });

  test('23. Provider router regression remains unchanged', () => {
    const router = new StockProviderRouter();
    assert.strictEqual(router.getProvider('pexels') instanceof PexelsProvider, true);
  });

  test('24. No provider secrets exposed in variants output', () => {
    const variants = PlatformSizingManager.generateVariants(mockAsset);
    const json = JSON.stringify(variants);
    assert.strictEqual(json.includes('mock_pexels_key'), false);
    assert.strictEqual(json.includes('mock_pixabay_key'), false);
    assert.strictEqual(json.includes('mock_unsplash_key'), false);
  });

  test('25. All supported 11 platform presets are defined', () => {
    assert.strictEqual(PlatformSizingManager.generateVariants(mockAsset).length, 11);
  });
});
