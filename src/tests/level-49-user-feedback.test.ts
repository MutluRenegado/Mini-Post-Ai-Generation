import test from 'node:test';
import assert from 'node:assert/strict';
import { UserFeedbackEngine } from '../lib/ai-image-generator/images/UserFeedbackEngine';

test('Level 49: User Feedback and Controlled Improvement Engine Test Suite', async (t) => {
  await t.test('1. Records user generation feedback correctly with timestamp', () => {
    const record = UserFeedbackEngine.recordFeedback({
      feedbackId: 'fb_101',
      generationId: 'gen_202',
      scope: 'user_preference',
      scopeId: 'user_888',
      relevanceRating: 5,
      styleRating: 4,
      compositionRating: 5,
      regenerationRequested: false,
      timestamp: '2026-08-04T05:00:00.000Z',
    });

    assert.equal(record.feedbackId, 'fb_101');
    assert.equal(record.relevanceRating, 5);
  });

  await t.test('2. Aggregates feedback preferences while preserving canonical standards', () => {
    const preferences = UserFeedbackEngine.aggregatePreferences([
      {
        feedbackId: 'fb_1',
        generationId: 'gen_1',
        scope: 'brand_profile',
        scopeId: 'brand_tech',
        relevanceRating: 4,
        styleRating: 5,
        compositionRating: 4,
        rejectionReason: 'poor_lighting',
        regenerationRequested: true,
        timestamp: '2026-08-04T05:00:00.000Z',
      },
    ]);

    assert.equal(preferences.scope, 'brand_profile');
    assert.equal(preferences.averageRelevanceRating, 4);
    assert.equal(preferences.canonicalStandardsMutated, false); // Guarantee standards are unchanged!
    assert.equal(preferences.deterministicFingerprint.length, 64);
  });
});
