import test from 'node:test';
import assert from 'node:assert/strict';
import { FacialIdentityEngine } from '../lib/ai-image-generator/images/FacialIdentityEngine';

test('Level 40: Facial Expression and Identity-Consistency Test Suite', async (t) => {
  await t.test('1. Resolves confident professional smile for default executive post', () => {
    const result = FacialIdentityEngine.resolve({
      primarySubject: 'Chief Executive Officer',
      content: 'Leading quarterly townhall update',
    });

    assert.equal(result.expression, 'confident_professional_smile');
    assert.equal(result.gazeTarget, 'viewer_direct');
    assert.equal(result.privacyContentPolicyCheckPassed, true);
    assert.ok(result.limitationReason !== undefined); // Default generic subject limitation
  });

  await t.test('2. Resolves focused concentration for technical tasks', () => {
    const result = FacialIdentityEngine.resolve({
      primarySubject: 'Cybersecurity Analyst',
      content: 'Inspecting analytical telemetry log stream',
    });

    assert.equal(result.expression, 'focused_concentration');
    assert.equal(result.gazeTarget, 'task_focused');
  });

  await t.test('3. Uses reference image constraints when available', () => {
    const result = FacialIdentityEngine.resolve({
      primarySubject: 'User Profile Subject',
      referenceImageAvailable: true,
    });

    assert.ok(result.referenceImageConstraint !== undefined);
  });
});
