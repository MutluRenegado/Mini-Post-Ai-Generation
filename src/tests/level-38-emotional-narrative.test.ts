import test from 'node:test';
import assert from 'node:assert/strict';
import { EmotionalNarrativeEngine } from '../lib/ai-image-generator/images/EmotionalNarrativeEngine';

test('Level 38: Emotional Narrative and Storytelling Test Suite', async (t) => {
  await t.test('1. Resolves default authoritative trust emotion', () => {
    const result = EmotionalNarrativeEngine.resolve({
      topic: 'Quarterly financial earnings report',
    });

    assert.equal(result.intendedEmotion, 'authoritative_trust');
    assert.equal(result.toneConsistencyScore, 92);
  });

  await t.test('2. Resolves innovative excitement for AI breakthrough topic', () => {
    const result = EmotionalNarrativeEngine.resolve({
      topic: 'AI model breakthrough innovation',
    });

    assert.equal(result.intendedEmotion, 'innovative_excitement');
    assert.ok(result.symbolicElements.length > 0);
  });

  await t.test('3. Resolves optimistic growth for scaling topics', () => {
    const result = EmotionalNarrativeEngine.resolve({
      topic: 'Company expansion and future scale',
    });

    assert.equal(result.intendedEmotion, 'optimistic_growth');
  });
});
