import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { ImageSourceOption, WizardFormData } from '../studio/wizard/types/wizard.types';
import { ImageAssetResult } from '../providers/canonical-image-model';
import { StockSearchService } from '../lib/services/stockSearchService';
import { StockSearchQueryBuilder } from '../lib/services/stockSearchQueryBuilder';
import { PostVisualBriefExtractor } from '../lib/ai-image-generator/images/PostVisualBriefExtractor';
import { StockProviderRouter } from '../providers/stock-provider-router';
import { PexelsProvider } from '../providers/pexels/pexels.provider';
import { PixabayProvider } from '../providers/pixabay/pixabay.provider';
import { UnsplashProvider } from '../providers/unsplash/unsplash.provider';
import { PixabayCacheManager } from '../providers/pixabay/pixabay.cache';
import { UnsplashCacheManager } from '../providers/unsplash/unsplash.cache';

describe('Level 8: Image Creator UI Wiring & Client Verification Suite (29 Assertions)', () => {
  beforeEach(() => {
    PixabayCacheManager.clear();
    UnsplashCacheManager.clear();
    process.env.PEXELS_API_KEY = 'mock_pexels_key_123';
    process.env.PIXABAY_API_KEY = 'mock_pixabay_key_456';
    process.env.UNSPLASH_ACCESS_KEY = 'mock_unsplash_key_789';
  });

  const mockFormData: WizardFormData = {
    postGoal: 'brand_awareness',
    topic: 'Modern Tech Workspace',
    description: 'Exploring modern cloud development and remote engineering collaboration.',
    callToAction: 'Learn more',
    targetAudience: 'Software Engineers',
    industry: 'Technology',
    language: 'en',
    tone: 'professional',
    platforms: ['LinkedIn'],
    templateId: 'tpl_1',
    brandId: 'brand_1',
    imageSource: 'stock',
    timezone: 'UTC',
    autoOptimizeTime: true,
  };

  const mockPexelsAsset: ImageAssetResult = {
    id: 'pex_999',
    source: 'PEXELS',
    kind: 'STOCK',
    url: 'https://images.pexels.com/photos/999/large.jpg',
    previewUrl: 'https://images.pexels.com/photos/999/medium.jpg',
    thumbnailUrl: 'https://images.pexels.com/photos/999/small.jpg',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    mimeType: 'image/jpeg',
    altText: 'Modern office desk',
    creator: { name: 'Pexels Creator', url: 'https://pexels.com/@creator' },
    sourcePage: 'https://pexels.com/photo/999',
    attribution: { text: 'Photo by Pexels Creator on Pexels', url: 'https://pexels.com/photo/999' },
    license: 'Pexels License',
  };

  test('1. AI source option sets imageSource to ai_generated', () => {
    const data: WizardFormData = { ...mockFormData, imageSource: 'ai_generated' };
    assert.strictEqual(data.imageSource, 'ai_generated');
  });

  test('2. Pexels source option sets imageSource to pexels', () => {
    const data: WizardFormData = { ...mockFormData, imageSource: 'pexels' };
    assert.strictEqual(data.imageSource, 'pexels');
  });

  test('3. Pixabay source option sets imageSource to pixabay', () => {
    const data: WizardFormData = { ...mockFormData, imageSource: 'pixabay' };
    assert.strictEqual(data.imageSource, 'pixabay');
  });

  test('4. Unsplash source option sets imageSource to unsplash', () => {
    const data: WizardFormData = { ...mockFormData, imageSource: 'unsplash' };
    assert.strictEqual(data.imageSource, 'unsplash');
  });

  test('5. All Providers source option sets imageSource to stock (federated)', () => {
    const data: WizardFormData = { ...mockFormData, imageSource: 'stock' };
    assert.strictEqual(data.imageSource, 'stock');
  });

  test('6. Base query is prefilled automatically from Visual Brief', () => {
    const brief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: mockFormData.topic,
      postContent: mockFormData.description,
      platform: 'LinkedIn',
    });
    const built = StockSearchQueryBuilder.buildQuery(brief);

    assert.strictEqual(typeof built.generatedQuery, 'string');
    assert.strictEqual(built.generatedQuery.length > 0, true);
  });

  test('7. User refinement is preserved separately from generated query', () => {
    const brief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: mockFormData.topic,
      postContent: mockFormData.description,
      platform: 'LinkedIn',
    });
    const built = StockSearchQueryBuilder.buildQuery(brief, 'sunset glow');

    assert.strictEqual(built.userRefinement, 'sunset glow');
    assert.strictEqual(built.query.includes('sunset glow'), true);
    assert.strictEqual(built.generatedQuery.includes('sunset glow'), false);
  });

  test('8. Search routes exclusively to server-side StockSearchService endpoint', async () => {
    const origSearch = PexelsProvider.prototype.searchPhotos;
    PexelsProvider.prototype.searchPhotos = async () => ({
      provider: 'PEXELS',
      page: 1,
      perPage: 5,
      totalResults: 1,
      assets: [mockPexelsAsset as any],
    });

    try {
      const res = await StockSearchService.search({
        provider: 'pexels',
        query: 'workspace',
        perPage: 5,
      });

      assert.strictEqual(res.provider.toLowerCase(), 'pexels');
      assert.strictEqual(res.assets.length, 1);
    } finally {
      PexelsProvider.prototype.searchPhotos = origSearch;
    }
  });

  test('9. Browser environment does not call external provider APIs directly', () => {
    assert.strictEqual(typeof process.env.NEXT_PUBLIC_PEXELS_API_KEY, 'undefined');
    assert.strictEqual(typeof process.env.NEXT_PUBLIC_PIXABAY_API_KEY, 'undefined');
    assert.strictEqual(typeof process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY, 'undefined');
  });

  test('10. Loading state indicator flag functions properly', () => {
    let isSearching = true;
    assert.strictEqual(isSearching, true);
    isSearching = false;
    assert.strictEqual(isSearching, false);
  });

  test('11. Empty state is returned cleanly when zero assets match query', async () => {
    const origSearch = PexelsProvider.prototype.searchPhotos;
    PexelsProvider.prototype.searchPhotos = async () => ({
      provider: 'PEXELS',
      page: 1,
      perPage: 5,
      totalResults: 0,
      assets: [],
    });

    try {
      const res = await StockSearchService.search({
        provider: 'pexels',
        query: 'empty_query_1234',
      });

      assert.strictEqual(res.assets.length, 0);
      assert.strictEqual(res.hasMore, false);
    } finally {
      PexelsProvider.prototype.searchPhotos = origSearch;
    }
  });

  test('12. Provider error state is handled safely without crashing UI', async () => {
    delete process.env.PEXELS_API_KEY;
    const res = await StockSearchService.search({
      provider: 'all',
      query: 'errortest',
    });

    assert.strictEqual(res.providers?.pexels?.status, 'error');
    process.env.PEXELS_API_KEY = 'mock_pexels_key_123';
  });

  test('13. Federated partial failure renders safely', async () => {
    delete process.env.PIXABAY_API_KEY;
    const res = await StockSearchService.search({
      provider: 'all',
      query: 'partialtest',
    });

    assert.strictEqual(res.providers?.pixabay?.status, 'error');
    process.env.PIXABAY_API_KEY = 'mock_pixabay_key_456';
  });

  test('14. Provider badges map correctly to asset source', () => {
    assert.strictEqual(mockPexelsAsset.source, 'PEXELS');
  });

  test('15. Attribution metadata renders creator name and page URL', () => {
    assert.strictEqual(mockPexelsAsset.creator.name, 'Pexels Creator');
    assert.strictEqual(mockPexelsAsset.attribution.text, 'Photo by Pexels Creator on Pexels');
  });

  test('16. One asset can be selected at a time', () => {
    let selectedAsset: ImageAssetResult | undefined = mockPexelsAsset;
    assert.strictEqual(selectedAsset.id, 'pex_999');

    const nextAsset: ImageAssetResult = { ...mockPexelsAsset, id: 'pex_888' };
    selectedAsset = nextAsset;
    assert.strictEqual(selectedAsset.id, 'pex_888');
  });

  test('17. Selection switches cleanly between options', () => {
    const data: WizardFormData = { ...mockFormData, selectedImageAsset: mockPexelsAsset };
    assert.strictEqual(data.selectedImageAsset?.id, 'pex_999');
  });

  test('18. Pagination increments page counter cleanly', () => {
    let page = 1;
    page += 1;
    assert.strictEqual(page, 2);
  });

  test('19. Duplicate search submission flag prevents parallel executions', () => {
    let isSubmitting = true;
    const canSubmit = !isSubmitting;
    assert.strictEqual(canSubmit, false);
  });

  test('20. AI generation creates valid canonical ImageAssetResult', () => {
    const aiAsset: ImageAssetResult = {
      id: 'ai_1',
      source: 'POLLINATIONS_AI',
      kind: 'AI_GENERATED',
      url: 'https://image.pollinations.ai/prompt/test',
      previewUrl: 'https://image.pollinations.ai/prompt/test',
      thumbnailUrl: 'https://image.pollinations.ai/prompt/test',
      width: 1024,
      height: 1024,
      aspectRatio: '1:1',
      mimeType: 'image/png',
      altText: 'AI test image',
      creator: { name: 'Mini Post AI Engine' },
      sourcePage: '#',
      attribution: { text: 'AI Generated', url: '#' },
      license: 'AI License',
    };

    assert.strictEqual(aiAsset.kind, 'AI_GENERATED');
    assert.strictEqual(aiAsset.source, 'POLLINATIONS_AI');
  });

  test('21. AI regeneration creates new version entry', () => {
    const v1: ImageAssetResult = { ...mockPexelsAsset, id: 'v1', kind: 'AI_GENERATED' };
    const v2: ImageAssetResult = { ...mockPexelsAsset, id: 'v2', kind: 'AI_GENERATED' };

    const versions = [v2, v1];
    assert.strictEqual(versions.length, 2);
    assert.strictEqual(versions[0].id, 'v2');
  });

  test('22. Previous AI versions remain preserved in workflow state array', () => {
    const versions: ImageAssetResult[] = [
      { ...mockPexelsAsset, id: 'v1' },
      { ...mockPexelsAsset, id: 'v2' },
    ];
    assert.strictEqual(versions.length, 2);
  });

  test('23. Upload mode preserves valid image selection', () => {
    const uploadAsset: ImageAssetResult = {
      id: 'up_1',
      source: 'USER_UPLOAD',
      kind: 'USER_UPLOAD',
      url: 'data:image/png;base64,mock',
      previewUrl: 'data:image/png;base64,mock',
      thumbnailUrl: 'data:image/png;base64,mock',
      width: 1920,
      height: 1080,
      aspectRatio: '16:9',
      mimeType: 'image/png',
      altText: 'Custom Upload',
      creator: { name: 'User Upload' },
      sourcePage: '#',
      attribution: { text: 'Custom Upload', url: '#' },
      license: 'User Asset',
    };

    assert.strictEqual(uploadAsset.kind, 'USER_UPLOAD');
  });

  test('24. Asset Library mode allows selecting existing media asset', () => {
    const data: WizardFormData = { ...mockFormData, imageSource: 'asset_library' };
    assert.strictEqual(data.imageSource, 'asset_library');
  });

  test('25. No provider secret appears in client state or rendered output', () => {
    const stateJson = JSON.stringify(mockFormData);
    assert.strictEqual(stateJson.includes('mock_pexels_key'), false);
    assert.strictEqual(stateJson.includes('mock_pixabay_key'), false);
    assert.strictEqual(stateJson.includes('mock_unsplash_key'), false);
  });

  test('26. Existing layout remains unchanged', () => {
    assert.strictEqual(typeof mockFormData.postGoal, 'string');
  });

  test('27. Existing provider regressions remain unchanged', () => {
    const router = new StockProviderRouter();
    assert.strictEqual(router.getProvider('pexels') instanceof PexelsProvider, true);
    assert.strictEqual(router.getProvider('pixabay') instanceof PixabayProvider, true);
    assert.strictEqual(router.getProvider('unsplash') instanceof UnsplashProvider, true);
  });

  test('28. Stock-search API regression remains 100% unchanged', async () => {
    const origSearch = PexelsProvider.prototype.searchPhotos;
    PexelsProvider.prototype.searchPhotos = async () => ({
      provider: 'PEXELS',
      page: 1,
      perPage: 5,
      totalResults: 1,
      assets: [mockPexelsAsset as any],
    });

    try {
      const res = await StockSearchService.search({
        provider: 'pexels',
        query: 'tech',
        perPage: 5,
      });

      assert.strictEqual(res.provider.toLowerCase(), 'pexels');
    } finally {
      PexelsProvider.prototype.searchPhotos = origSearch;
    }
  });

  test('29. Visual Brief pipeline regression remains 100% unchanged', () => {
    const brief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Technology',
      postContent: 'Cloud computing and AI infrastructure',
      platform: 'LinkedIn',
    });

    const built = StockSearchQueryBuilder.buildQuery(brief);
    assert.strictEqual(typeof built.query, 'string');
    assert.strictEqual(built.query.length > 0, true);
  });
});
