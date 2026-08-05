import test from 'node:test';
import assert from 'node:assert/strict';
import { BrandConsistencyEngine } from '../lib/ai-image-generator/images/BrandConsistencyEngine';

test('Level 42: Brand Consistency Intelligence Test Suite', async (t) => {
  await t.test('1. Resolves neutral professional fallback when no user brand kit exists', () => {
    const result = BrandConsistencyEngine.resolve({});

    assert.equal(result.brandKitActive, false);
    assert.equal(result.fallbackUsed, true);
    assert.equal(result.miniPostAppBrandingInjected, false); // Never inject app branding into user content!
  });

  await t.test('2. Applies user brand kit colors and typography when provided', () => {
    const result = BrandConsistencyEngine.resolve({
      userBrandKit: {
        brandId: 'brand_acme',
        brandName: 'Acme Corp',
        primaryColorHex: '#FF5733',
        secondaryColorHex: '#33FF57',
        accentColorHex: '#3357FF',
        fontFamily: 'Inter',
      },
    });

    assert.equal(result.brandKitActive, true);
    assert.equal(result.fallbackUsed, false);
    assert.equal(result.resolvedColors.primary, '#FF5733');
    assert.equal(result.typographyStyle, 'Inter');
    assert.equal(result.miniPostAppBrandingInjected, false);
  });
});
