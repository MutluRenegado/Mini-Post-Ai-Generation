import test from 'node:test';
import assert from 'node:assert/strict';
import { ImageQualityAssuranceEngine } from '../lib/ai-image-generator/images/ImageQualityAssuranceEngine';

test('Level 44: Image Quality Assurance and Standards Validation Test Suite', async (t) => {
  await t.test('1. Returns PASS for clean valid inputs', () => {
    const report = ImageQualityAssuranceEngine.evaluate({
      promptText: 'Clean professional executive in sunlit modern office',
      isAnatomicallySound: true,
      isPhysicallyPlausible: true,
      contrastRatio: 7.0,
      fingerprint: 'abc123456789',
    });

    assert.equal(report.overallDisposition, 'PASS');
    assert.equal(report.failedCount, 0);
    assert.equal(report.provenanceComplete, true);
    assert.equal(report.deterministicFingerprint.length, 64);
  });

  await t.test('2. Rejects prompts with anatomical defects', () => {
    const report = ImageQualityAssuranceEngine.evaluate({
      promptText: 'Person with 6 fingers',
      isAnatomicallySound: false,
    });

    assert.equal(report.overallDisposition, 'FAIL');
    assert.ok(report.findings.some((f) => f.ruleId === 'QA_ANATOMY_001' && f.disposition === 'REJECTED'));
  });

  await t.test('3. Rejects inaccessible contrast (< 4.5:1)', () => {
    const report = ImageQualityAssuranceEngine.evaluate({
      promptText: 'Headline overlay text',
      contrastRatio: 2.5,
    });

    assert.equal(report.overallDisposition, 'FAIL');
    assert.ok(report.findings.some((f) => f.ruleId === 'QA_ACCESSIBILITY_001' && f.disposition === 'REJECTED'));
  });
});
