import test from 'node:test';
import assert from 'node:assert/strict';
import { CompositionHierarchyEngine } from '../lib/ai-image-generator/images/CompositionHierarchyEngine';

test('Level 34: Composition and Visual Hierarchy Intelligence Test Suite', async (t) => {
  await t.test('1. Resolves rule of thirds composition for default post', () => {
    const result = CompositionHierarchyEngine.resolve({
      primarySubject: 'Chief Technology Officer',
      secondarySubjects: ['Cloud Server Rack'],
      environment: 'Data Center',
      platform: 'LinkedIn',
    });

    assert.equal(result.focalPlacement, 'rule_of_thirds_left');
    assert.equal(result.hierarchy.length, 3);
    assert.equal(result.hierarchy[0].tier, 1);
    assert.equal(result.deterministicFingerprint.length, 64);
  });

  await t.test('2. Allocates increased negative space when text overlay is requested', () => {
    const result = CompositionHierarchyEngine.resolve({
      primarySubject: 'Solar Panel Array',
      textOverlayRequested: true,
      platform: 'LinkedIn',
    });

    assert.ok(result.negativeSpacePercentage >= 40);
    assert.ok(result.embeddedTextCanvasAllocation !== undefined);
  });

  await t.test('3. Applies platform safe zone margins for TikTok/Reels vertical video', () => {
    const result = CompositionHierarchyEngine.resolve({
      primarySubject: 'Presenter',
      platform: 'TikTok',
    });

    assert.equal(result.platformSafeZoneMargins.top, 80);
    assert.equal(result.platformSafeZoneMargins.bottom, 120);
  });
});
