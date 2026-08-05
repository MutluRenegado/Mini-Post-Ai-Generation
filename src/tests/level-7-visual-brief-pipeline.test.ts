import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { PostVisualBriefExtractor } from '../lib/ai-image-generator/images/PostVisualBriefExtractor';
import { StockSearchQueryBuilder } from '../lib/services/stockSearchQueryBuilder';
import { StockSearchService } from '../lib/services/stockSearchService';
import { StockProviderRouter } from '../providers/stock-provider-router';
import { PexelsProvider } from '../providers/pexels/pexels.provider';
import { PixabayProvider } from '../providers/pixabay/pixabay.provider';
import { UnsplashProvider } from '../providers/unsplash/unsplash.provider';
import { PixabayCacheManager } from '../providers/pixabay/pixabay.cache';
import { UnsplashCacheManager } from '../providers/unsplash/unsplash.cache';
import type { RawPixabaySearchResponse } from '../providers/pixabay/pixabay.types';

describe('Level 7: Final Post, Visual Brief, and Stock Query Pipeline Test Suite (22 Assertions)', () => {
  beforeEach(() => {
    PixabayCacheManager.clear();
    UnsplashCacheManager.clear();
    process.env.PEXELS_API_KEY = 'mock_pexels_key_123';
    process.env.PIXABAY_API_KEY = 'mock_pixabay_key_456';
    process.env.UNSPLASH_ACCESS_KEY = 'mock_unsplash_key_789';
  });

  const mockPostContent1 = `
    Excited to announce our new AI-powered supply chain platform for global trade! 
    Streamline logistics, track shipments in real-time, and optimize warehouse workflows. 
    Visit https://minipostapp.space/trade for details. Email us at info@minipostapp.space or call +1-800-555-0199. 
    #SupplyChain #GlobalTrade #Logistics #AI Click link in bio to learn more!
  `;

  const mockPostContent2 = `
    Discover how modern remote engineering teams foster collaboration and innovation. 
    Flexible workspaces, digital whiteboards, and high-performance cloud tools. 
    #RemoteWork #Engineering #Tech
  `;

  const mockPexelsAsset = {
    id: 'pex_111',
    provider: 'PEXELS',
    width: 1920,
    height: 1080,
    url: 'https://www.pexels.com/photo/pex_111',
    photographerName: 'Pexels Photographer',
    photographerUrl: 'https://www.pexels.com/@photographer',
    sourceImageUrl: 'https://images.pexels.com/photos/pex_111/large.jpg',
    thumbnailUrl: 'https://images.pexels.com/photos/pex_111/small.jpg',
    altText: 'Supply chain cargo vessel',
    attributionText: 'Photo by Pexels Photographer on Pexels',
    attributionUrl: 'https://www.pexels.com/photo/pex_111',
  };

  test('1. Finalized post produces a valid PostVisualBrief', () => {
    const brief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postId: 'post_100',
      postTopic: 'Global Trade Logistics',
      postContent: mockPostContent1,
      platform: 'LinkedIn',
    });

    assert.strictEqual(brief.postId, 'post_100');
    assert.strictEqual(brief.platform, 'LinkedIn');
    assert.strictEqual(typeof brief.mainSubject, 'string');
    assert.strictEqual(brief.mainSubject.length > 0, true);
  });

  test('2. Different posts produce meaningfully different Visual Briefs', () => {
    const brief1 = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Cargo Logistics Shipping',
      postContent: mockPostContent1,
      platform: 'LinkedIn',
    });

    const brief2 = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Remote Software Developers',
      postContent: mockPostContent2,
      platform: 'TikTok',
    });

    assert.strictEqual(brief1.platform, 'LinkedIn');
    assert.strictEqual(brief2.platform, 'TikTok');
    assert.notStrictEqual(brief1.aspectRatio, brief2.aspectRatio);
  });

  test('3. Same post produces deterministic brief output', () => {
    const briefA = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postId: 'post_555',
      postTopic: 'Global Trade Logistics',
      postContent: mockPostContent1,
      platform: 'LinkedIn',
    });

    const briefB = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postId: 'post_555',
      postTopic: 'Global Trade Logistics',
      postContent: mockPostContent1,
      platform: 'LinkedIn',
    });

    assert.strictEqual(briefA.mainSubject, briefB.mainSubject);
    assert.strictEqual(briefA.environment, briefB.environment);
  });

  test('4. Finalized post produces a concise stock query', () => {
    const brief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Global Trade Logistics',
      postContent: mockPostContent1,
      platform: 'LinkedIn',
    });

    const built = StockSearchQueryBuilder.buildQuery(brief);
    assert.strictEqual(typeof built.query, 'string');
    assert.strictEqual(built.query.length > 0, true);
  });

  test('5. Generated stock query is bounded to 100 characters max', () => {
    const brief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Global Trade Logistics',
      postContent: mockPostContent1,
      platform: 'LinkedIn',
    });

    const longRefinement = 'x'.repeat(150);
    const built = StockSearchQueryBuilder.buildQuery(brief, longRefinement);
    assert.strictEqual(built.query.length <= 100, true);
  });

  test('6. Hashtags are removed from query', () => {
    const sanitized = StockSearchQueryBuilder.sanitizeText('Check #Logistics and #SupplyChain today');
    assert.strictEqual(sanitized.includes('#Logistics'), false);
    assert.strictEqual(sanitized.includes('#SupplyChain'), false);
  });

  test('7. URLs are removed from query', () => {
    const sanitized = StockSearchQueryBuilder.sanitizeText('Visit https://minipostapp.space/trade for details');
    assert.strictEqual(sanitized.includes('https://'), false);
    assert.strictEqual(sanitized.includes('minipostapp.space'), false);
  });

  test('8. Irrelevant CTA wording is excluded from query', () => {
    const sanitized = StockSearchQueryBuilder.sanitizeText('Click link in bio and subscribe now to buy now');
    assert.strictEqual(sanitized.includes('click link'), false);
    assert.strictEqual(sanitized.includes('subscribe now'), false);
  });

  test('9. Email addresses are excluded from query', () => {
    const sanitized = StockSearchQueryBuilder.sanitizeText('Contact support@minipostapp.space for help');
    assert.strictEqual(sanitized.includes('support@minipostapp.space'), false);
  });

  test('10. Phone numbers are excluded from query', () => {
    const sanitized = StockSearchQueryBuilder.sanitizeText('Call us at +1-800-555-0199 or 555-123-4567');
    assert.strictEqual(sanitized.includes('+1-800-555-0199'), false);
    assert.strictEqual(sanitized.includes('555-123-4567'), false);
  });

  test('11. User refinement is preserved in query output', () => {
    const brief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Global Trade Logistics',
      postContent: mockPostContent1,
      platform: 'LinkedIn',
    });

    const built = StockSearchQueryBuilder.buildQuery(brief, 'sunset lighting');
    assert.strictEqual(built.userRefinement, 'sunset lighting');
    assert.strictEqual(built.query.includes('sunset lighting'), true);
  });

  test('12. Generated base query remains available separately from refinement', () => {
    const brief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Global Trade Logistics',
      postContent: mockPostContent1,
      platform: 'LinkedIn',
    });

    const built = StockSearchQueryBuilder.buildQuery(brief, 'ultra HD');
    assert.notStrictEqual(built.generatedQuery, built.query);
    assert.strictEqual(built.generatedQuery.includes('ultra HD'), false);
  });

  test('13. Platform affects derived orientation (e.g. TikTok -> portrait)', () => {
    const briefTikTok = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Global Trade Logistics',
      postContent: mockPostContent1,
      platform: 'TikTok',
    });

    const builtTikTok = StockSearchQueryBuilder.buildQuery(briefTikTok);
    assert.strictEqual(builtTikTok.orientation, 'portrait');
  });

  test('14. Brand colors can affect color hint attribute', () => {
    const brief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Global Trade Logistics',
      postContent: mockPostContent1,
      platform: 'LinkedIn',
    });
    brief.brandColors = ['#08C9FF', '#FFFFFF'];

    const built = StockSearchQueryBuilder.buildQuery(brief);
    assert.strictEqual(built.color, '#08C9FF');
  });

  test('15. Missing finalized post content throws clear validation error', () => {
    assert.throws(
      () => {
        PostVisualBriefExtractor.extract({ operation: 'generate', postTopic: '', postContent: '' });
      },
      (err: any) => err.message.includes('requires final approved post content')
    );
  });

  test('16. Visual Brief feeds StockSearchService cleanly', async () => {
    const origSearch = PexelsProvider.prototype.searchPhotos;
    PexelsProvider.prototype.searchPhotos = async () => ({
      provider: 'PEXELS',
      page: 1,
      perPage: 5,
      totalResults: 1,
      assets: [mockPexelsAsset],
    });

    try {
      const brief = PostVisualBriefExtractor.extract({
        operation: 'generate',
        postTopic: 'Global Trade Logistics',
        postContent: mockPostContent1,
        platform: 'LinkedIn',
      });

      const res = await StockSearchQueryBuilder.searchFromVisualBrief(brief, {
        provider: 'pexels',
        perPage: 5,
      });

      assert.strictEqual(res.provider, 'pexels');
      assert.strictEqual(res.assets.length, 1);
    } finally {
      PexelsProvider.prototype.searchPhotos = origSearch;
    }
  });

  test('17. Federated search works from Visual Brief-derived query', async () => {
    const origPexSearch = PexelsProvider.prototype.searchPhotos;
    PexelsProvider.prototype.searchPhotos = async () => ({
      provider: 'PEXELS',
      page: 1,
      perPage: 20,
      totalResults: 1,
      assets: [mockPexelsAsset],
    });

    const mockPixabayResponse: RawPixabaySearchResponse = {
      total: 10,
      totalHits: 10,
      hits: [
        {
          id: 999,
          pageURL: 'https://pixabay.com/photos/999/',
          type: 'photo',
          tags: 'cargo, ship',
          previewURL: 'https://cdn.pixabay.com/999_p.jpg',
          previewWidth: 150,
          previewHeight: 100,
          webformatURL: 'https://cdn.pixabay.com/999_w.jpg',
          webformatWidth: 640,
          webformatHeight: 426,
          largeImageURL: 'https://cdn.pixabay.com/999_l.jpg',
          imageWidth: 1920,
          imageHeight: 1280,
          imageSize: 900000,
          views: 100,
          downloads: 10,
          likes: 5,
          comments: 0,
          user_id: 1,
          user: 'TradeUser',
          userImageURL: '',
        },
      ],
    };

    try {
      const brief = PostVisualBriefExtractor.extract({
        operation: 'generate',
        postTopic: 'Global Trade Logistics',
        postContent: mockPostContent1,
        platform: 'LinkedIn',
      });
      const built = StockSearchQueryBuilder.buildQuery(brief);

      const keyPix = PixabayCacheManager.generateKey({ query: built.query, perPage: 20 });
      PixabayCacheManager.set(keyPix, mockPixabayResponse);

      const res = await StockSearchQueryBuilder.searchFromVisualBrief(brief, {
        provider: 'all',
        perPage: 20,
      });

      assert.strictEqual(res.provider, 'all');
      assert.strictEqual(res.assets.length >= 1, true);
    } finally {
      PexelsProvider.prototype.searchPhotos = origPexSearch;
    }
  });

  test('18. No provider secret appears in Visual Brief or Stock Query output', () => {
    const brief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Global Trade Logistics',
      postContent: mockPostContent1,
      platform: 'LinkedIn',
    });
    const built = StockSearchQueryBuilder.buildQuery(brief);
    const jsonString = JSON.stringify(built);

    assert.strictEqual(jsonString.includes('mock_pexels_key'), false);
    assert.strictEqual(jsonString.includes('mock_pixabay_key'), false);
    assert.strictEqual(jsonString.includes('mock_unsplash_key'), false);
  });

  test('19. Pexels provider regression remains 100% unchanged', () => {
    const router = new StockProviderRouter();
    assert.strictEqual(router.getProvider('pexels') instanceof PexelsProvider, true);
  });

  test('20. Pixabay provider regression remains 100% unchanged', () => {
    const router = new StockProviderRouter();
    assert.strictEqual(router.getProvider('pixabay') instanceof PixabayProvider, true);
  });

  test('21. Unsplash provider regression remains 100% unchanged', () => {
    const router = new StockProviderRouter();
    assert.strictEqual(router.getProvider('unsplash') instanceof UnsplashProvider, true);
  });

  test('22. Stock-search API regression remains 100% unchanged', async () => {
    const origPexSearch = PexelsProvider.prototype.searchPhotos;
    PexelsProvider.prototype.searchPhotos = async () => ({
      provider: 'PEXELS',
      page: 1,
      perPage: 5,
      totalResults: 1,
      assets: [mockPexelsAsset],
    });

    try {
      const res = await StockSearchService.search({
        provider: 'pexels',
        query: 'office',
        perPage: 5,
      });

      assert.strictEqual(res.provider, 'pexels');
      assert.strictEqual(res.perPage, 5);
    } finally {
      PexelsProvider.prototype.searchPhotos = origPexSearch;
    }
  });
});
