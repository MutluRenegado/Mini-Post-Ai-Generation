import test from 'node:test';
import assert from 'node:assert/strict';
import { PromptCompressionEngine } from '../lib/ai-image-generator/images/PromptCompressionEngine';

test('Level 45: Prompt Compression and Optimisation Test Suite', async (t) => {
  await t.test('1. Removes redundant quality Buzzwords and filler adjectives', () => {
    const raw = 'Very highly realistic executive portrait, 8k, ultra masterpiece, highly detailed';
    const result = PromptCompressionEngine.compress(raw);

    assert.ok(!result.compressedPromptText.includes('very'));
    assert.ok(!result.compressedPromptText.includes('8k'));
    assert.ok(result.delta.removedRedundantTokens.length > 0);
    assert.equal(result.providerTokenLimitCompliant, true);
  });

  await t.test('2. Deduplicates repeated phrases cleanly', () => {
    const raw = 'Data center server racks, modern lighting, Data center server racks, clean studio';
    const result = PromptCompressionEngine.compress(raw);

    assert.equal(result.compressedPromptText.split('Data center server racks').length - 1, 1);
  });

  await t.test('3. Computes deterministic fingerprints for before and after states', () => {
    const raw = 'Clean solar panel array with bright sunlight';
    const r1 = PromptCompressionEngine.compress(raw);
    const r2 = PromptCompressionEngine.compress(raw);

    assert.equal(r1.originalPromptFingerprint, r2.originalPromptFingerprint);
    assert.equal(r1.compressedPromptFingerprint, r2.compressedPromptFingerprint);
  });
});
