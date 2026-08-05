import test from 'node:test';
import assert from 'node:assert/strict';
import { PromptSelfHealingEngine } from '../lib/ai-image-generator/images/PromptSelfHealingEngine';

test('Level 46: Prompt Repair and Self-Healing Engine Test Suite', async (t) => {
  await t.test('1. Bounded self-healing repairs anatomy risks cleanly', () => {
    const result = PromptSelfHealingEngine.repair({
      promptText: 'Professional portrait holding camera with 6 fingers',
      anatomyRiskDetected: true,
    });

    assert.equal(result.repairSucceeded, true);
    assert.ok(result.repairedPromptText.includes('5 distinct fingers'));
    assert.ok(result.repairedNegativePromptText.includes('extra fingers'));
    assert.equal(result.actionsApplied.length, 1);
    assert.equal(result.deterministicFingerprint.length, 64);
  });

  await t.test('2. Bounded self-healing repairs spatial impossibility', () => {
    const result = PromptSelfHealingEngine.repair({
      promptText: 'Executive floating without support in office',
      spatialImpossibilityDetected: true,
    });

    assert.ok(result.repairedPromptText.includes('grounded naturally'));
  });

  await t.test('3. Respects maximum iteration bounds (max 3)', () => {
    const result = PromptSelfHealingEngine.repair({
      promptText: '6 fingers, floating without support',
      anatomyRiskDetected: true,
      spatialImpossibilityDetected: true,
      excessiveTextDetected: true,
      maxAllowedIterations: 2,
    });

    assert.equal(result.iterationCount, 2);
    assert.equal(result.maxAllowedIterations, 2);
  });
});
