import assert from 'assert';
import { test, describe } from 'node:test';
import {
  ImageAssetResult,
  ImageAssetResultSchema,
  externalAssetToCanonical,
  aiResultToCanonical,
} from '../providers/canonical-image-model';
import type { ExternalImageAsset } from '../providers/external-image-provider.interface';

describe('Level 2: Canonical Image Domain Model & Validation Test Suite', () => {
  const mockPexelsAsset: ExternalImageAsset = {
    id: '998877',
    provider: 'PEXELS',
    width: 1920,
    height: 1080,
    url: 'https://www.pexels.com/photo/998877',
    photographerName: 'Alex Creator',
    photographerUrl: 'https://www.pexels.com/@alexcreator',
    sourceImageUrl: 'https://images.pexels.com/photos/998877/large2x.jpg',
    thumbnailUrl: 'https://images.pexels.com/photos/998877/medium.jpg',
    altText: 'Modern office desk with laptop',
    averageColor: '#1e293b',
    attributionText: 'Photo by Alex Creator on Pexels',
    attributionUrl: 'https://www.pexels.com/photo/998877',
    raw: { id: 998877, photographer: 'Alex Creator' },
  };

  test('1. Pexels ExternalImageAsset transforms to Canonical ImageAssetResult correctly', () => {
    const canonical = externalAssetToCanonical(mockPexelsAsset);
    assert.strictEqual(canonical.id, '998877');
    assert.strictEqual(canonical.source, 'PEXELS');
    assert.strictEqual(canonical.kind, 'STOCK');
    assert.strictEqual(canonical.url, 'https://images.pexels.com/photos/998877/large2x.jpg');
    assert.strictEqual(canonical.thumbnailUrl, 'https://images.pexels.com/photos/998877/medium.jpg');
    assert.strictEqual(canonical.creator.name, 'Alex Creator');
    assert.strictEqual(canonical.creator.url, 'https://www.pexels.com/@alexcreator');
    assert.strictEqual(canonical.attribution.text, 'Photo by Alex Creator on Pexels');
    assert.strictEqual(canonical.license, 'PEXELS License');
  });

  test('2. AI-generated image result transforms to Canonical ImageAssetResult correctly', () => {
    const canonical = aiResultToCanonical({
      id: 'ai_123',
      source: 'POLLINATIONS_AI',
      url: 'https://image.pollinations.ai/prompt/futuristic%20city',
      width: 1024,
      height: 1024,
      aspectRatio: '1:1',
      prompt: 'Futuristic smart city skyline at night',
    });

    assert.strictEqual(canonical.id, 'ai_123');
    assert.strictEqual(canonical.source, 'POLLINATIONS_AI');
    assert.strictEqual(canonical.kind, 'AI_GENERATED');
    assert.strictEqual(canonical.prompt, 'Futuristic smart city skyline at night');
    assert.strictEqual(canonical.license, 'AI Generated License');
  });

  test('3. Future Pixabay and Unsplash assets validate against ImageAssetResultSchema', () => {
    const pixabayCanonical: ImageAssetResult = {
      id: 'pix_456',
      source: 'PIXABAY',
      kind: 'STOCK',
      url: 'https://cdn.pixabay.com/photo/large.jpg',
      previewUrl: 'https://cdn.pixabay.com/photo/webformat.jpg',
      thumbnailUrl: 'https://cdn.pixabay.com/photo/preview.jpg',
      width: 1280,
      height: 720,
      aspectRatio: '16:9',
      mimeType: 'image/jpeg',
      altText: 'Sunset over mountains',
      creator: { name: 'NaturePhotographer', url: 'https://pixabay.com/users/nature' },
      sourcePage: 'https://pixabay.com/photos/sunset-456',
      attribution: { text: 'Image by NaturePhotographer from Pixabay', url: 'https://pixabay.com/photos/sunset-456' },
      license: 'Pixabay Content License',
    };

    const unsplashCanonical: ImageAssetResult = {
      id: 'uns_789',
      source: 'UNSPLASH',
      kind: 'STOCK',
      url: 'https://images.unsplash.com/photo-789',
      previewUrl: 'https://images.unsplash.com/photo-789?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-789?w=200',
      width: 2400,
      height: 1600,
      aspectRatio: '3:2',
      mimeType: 'image/jpeg',
      altText: 'Minimalist architecture detail',
      creator: { name: 'ArchDesign', url: 'https://unsplash.com/@archdesign?utm_source=mini_post_app&utm_medium=referral' },
      sourcePage: 'https://unsplash.com/photos/789',
      attribution: { text: 'Photo by ArchDesign on Unsplash', url: 'https://unsplash.com/photos/789' },
      license: 'Unsplash License',
    };

    const parsePixabay = ImageAssetResultSchema.safeParse(pixabayCanonical);
    assert.strictEqual(parsePixabay.success, true);

    const parseUnsplash = ImageAssetResultSchema.safeParse(unsplashCanonical);
    assert.strictEqual(parseUnsplash.success, true);
  });
});
