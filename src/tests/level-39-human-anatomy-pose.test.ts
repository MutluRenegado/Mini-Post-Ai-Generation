import test from 'node:test';
import assert from 'node:assert/strict';
import { HumanAnatomyPoseEngine } from '../lib/ai-image-generator/images/HumanAnatomyPoseEngine';

test('Level 39: Human Pose, Anatomy, and Body-Consistency Test Suite', async (t) => {
  await t.test('1. Resolves front-facing 3/4 professional standing posture', () => {
    const result = HumanAnatomyPoseEngine.resolve({
      primarySubject: 'Software Architect',
      action: 'standing in office',
    });

    assert.equal(result.bodyOrientation, 'front_facing_34');
    assert.equal(result.handPlacement.explicitFiveFingersRequired, true);
    assert.equal(result.isAnatomicallySound, true);
    assert.ok(result.prohibitedMalformedBodyNegativePrompts.includes('extra fingers'));
  });

  await t.test('2. Resolves seated ergonomic posture for typing tasks', () => {
    const result = HumanAnatomyPoseEngine.resolve({
      primarySubject: 'Data Engineer',
      action: 'seated typing at workstation desk',
    });

    assert.equal(result.bodyOrientation, 'seated_ergonomic');
  });

  await t.test('3. Flags anatomy risks when text prompt contains malformed instructions', () => {
    const result = HumanAnatomyPoseEngine.resolve({
      action: 'holding camera with 6 fingers',
    });

    assert.equal(result.isAnatomicallySound, false);
    assert.ok(result.anatomyRiskWarnings !== undefined);
  });
});
