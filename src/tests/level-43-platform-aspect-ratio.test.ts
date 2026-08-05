import test from 'node:test';
import assert from 'node:assert/strict';
import { PlatformAspectRatioEngine } from '../lib/ai-image-generator/images/PlatformAspectRatioEngine';

test('Level 43: Platform and Aspect-Ratio Optimisation Test Suite', async (t) => {
  await t.test('1. Resolves LinkedIn 1.91:1 standard dimensions', () => {
    const result = PlatformAspectRatioEngine.resolve({
      platform: 'LinkedIn',
      primarySubject: 'Executive',
    });

    assert.equal(result.aspectRatio, '1.91:1');
    assert.equal(result.compositionFormat, 'landscape');
    assert.equal(result.deterministicFingerprint.length, 64);
  });

  await t.test('2. Resolves Instagram Square 1:1 dimensions', () => {
    const result = PlatformAspectRatioEngine.resolve({
      platform: 'Instagram Feed',
    });

    assert.equal(result.aspectRatio, '1:1');
    assert.equal(result.compositionFormat, 'square');
  });

  await t.test('3. Resolves TikTok / Reels 9:16 vertical dimensions and safe zones', () => {
    const result = PlatformAspectRatioEngine.resolve({
      platform: 'TikTok',
    });

    assert.equal(result.aspectRatio, '9:16');
    assert.equal(result.dimensionsPx.width, 1080);
    assert.equal(result.dimensionsPx.height, 1920);
    assert.equal(result.safeZones.top, 80);
    assert.equal(result.safeZones.bottom, 120);
  });
});
