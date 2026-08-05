import test from 'node:test';
import assert from 'node:assert/strict';
import { CameraViewpointEngine } from '../lib/ai-image-generator/images/CameraViewpointEngine';

test('Level 32: Camera and Viewpoint Intelligence Test Suite', async (t) => {
  await t.test('1. Resolves default eye-level medium shot correctly', () => {
    const result = CameraViewpointEngine.resolve({
      topic: 'General corporate update',
      content: 'Company reaches major milestones this quarter.',
      platform: 'LinkedIn',
    });

    assert.equal(result.shotType, 'medium_shot');
    assert.equal(result.viewpoint, 'eye_level');
    assert.equal(result.isPhysicallyCoherent, true);
    assert.equal(result.deterministicFingerprint.length, 64);
  });

  await t.test('2. Resolves macro perspective for detail topics', () => {
    const result = CameraViewpointEngine.resolve({
      topic: 'Microchip manufacturing detail',
      content: 'Inspecting silicon wafer microchip textures.',
      platform: 'Instagram',
    });

    assert.equal(result.shotType, 'macro');
    assert.equal(result.lensCharacteristic, 'macro_100mm');
    assert.equal(result.isPhysicallyCoherent, true);
  });

  await t.test('3. Resolves portrait lens for executive portrait', () => {
    const result = CameraViewpointEngine.resolve({
      topic: 'Executive profile',
      primarySubject: 'Chief Medical Officer Doctor',
      platform: 'LinkedIn',
    });

    assert.equal(result.shotType, 'medium_close_up');
    assert.equal(result.lensCharacteristic, 'portrait_85mm');
    assert.equal(result.isPhysicallyCoherent, true);
  });

  await t.test('4. Resolves platform framing for vertical video formats', () => {
    const result = CameraViewpointEngine.resolve({
      topic: 'Reels video post',
      platform: 'TikTok',
    });

    assert.ok(result.platformFraming.includes('9:16 Vertical'));
  });

  await t.test('5. Same input produces 100% identical fingerprint', () => {
    const input = { topic: 'Solar farm architecture', content: 'Clean energy aerial view', platform: 'X' };
    const r1 = CameraViewpointEngine.resolve(input);
    const r2 = CameraViewpointEngine.resolve(input);

    assert.equal(r1.deterministicFingerprint, r2.deterministicFingerprint);
  });
});
