import test from 'node:test';
import assert from 'node:assert/strict';
import { LightingIntelligenceEngine } from '../lib/ai-image-generator/images/LightingIntelligenceEngine';

test('Level 33: Lighting Intelligence Test Suite', async (t) => {
  await t.test('1. Resolves default daylight studio lighting', () => {
    const result = LightingIntelligenceEngine.resolve({
      topic: 'Business strategy meeting',
      content: 'Discussion on corporate growth',
    });

    assert.equal(result.lightSource, 'diffused_studio');
    assert.equal(result.colorTemperatureK, 5600);
    assert.equal(result.isPhysicallyCoherent, true);
  });

  await t.test('2. Resolves golden hour lighting for sunset warm topics', () => {
    const result = LightingIntelligenceEngine.resolve({
      topic: 'Sunset over green energy farm',
      mood: 'warm golden hour sunset',
    });

    assert.equal(result.lightSource, 'golden_hour_sun');
    assert.equal(result.colorTemperatureK, 3200);
    assert.equal(result.timeOfDay, 'golden_hour');
  });

  await t.test('3. Resolves neon rim light for cybersecurity midnight topics', () => {
    const result = LightingIntelligenceEngine.resolve({
      topic: 'Cybersecurity SOC telemetry room',
      mood: 'future high tech neon night',
    });

    assert.equal(result.lightSource, 'neon_rim_light');
    assert.equal(result.colorTemperatureK, 7500);
    assert.equal(result.timeOfDay, 'midnight');
  });

  await t.test('4. Fingerprint is deterministic', () => {
    const input = { topic: 'Medical lab research', content: 'Clinical trial analysis' };
    const r1 = LightingIntelligenceEngine.resolve(input);
    const r2 = LightingIntelligenceEngine.resolve(input);

    assert.equal(r1.deterministicFingerprint, r2.deterministicFingerprint);
  });
});
