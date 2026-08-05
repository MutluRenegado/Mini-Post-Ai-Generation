import test from 'node:test';
import assert from 'node:assert/strict';
import { MaterialTextureEngine } from '../lib/ai-image-generator/images/MaterialTextureEngine';

test('Level 36: Material, Texture, and Surface Intelligence Test Suite', async (t) => {
  await t.test('1. Resolves default composite laminate material', () => {
    const result = MaterialTextureEngine.resolve({
      topic: 'General corporate update',
    });

    assert.equal(result.primarySurface.material, 'smooth_composite');
    assert.equal(result.isPhysicallyCoherent, true);
    assert.equal(result.deterministicFingerprint.length, 64);
  });

  await t.test('2. Resolves photovoltaic silicon for solar energy domain', () => {
    const result = MaterialTextureEngine.resolve({
      domain: 'renewable-energy',
      topic: 'Solar panel installation',
    });

    assert.equal(result.primarySurface.material, 'photovoltaic_silicon');
    assert.ok(result.primarySurface.reflectivityPercentage > 50);
  });

  await t.test('3. Resolves brushed metal for factory machinery', () => {
    const result = MaterialTextureEngine.resolve({
      topic: 'Factory automated machinery unit',
    });

    assert.equal(result.primarySurface.material, 'brushed_metal');
    assert.equal(result.primarySurface.surfaceWearState, 'subtle_patina');
  });
});
