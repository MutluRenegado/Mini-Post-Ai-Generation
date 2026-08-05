import test from 'node:test';
import assert from 'node:assert/strict';
import { TypographyEmbeddedTextEngine } from '../lib/ai-image-generator/images/TypographyEmbeddedTextEngine';

test('Level 41: Typography and Embedded-Text Safety Test Suite', async (t) => {
  await t.test('1. Default mode returns pure text-free visual imagery', () => {
    const result = TypographyEmbeddedTextEngine.resolve({});

    assert.equal(result.embeddedTextAllowed, false);
    assert.equal(result.fallbackToTextFreeImage, true);
    assert.equal(result.wcagClassification, 'WCAG_2.2_AAA');
  });

  await t.test('2. Classifies 4.5:1 contrast correctly as WCAG 2.2 AA (not AAA)', () => {
    const result = TypographyEmbeddedTextEngine.resolve({
      requestedText: 'Future AI',
      postContent: 'Article discussing Future AI models',
      contrastRatio: 4.5,
      explicitTextMode: true,
    });

    assert.equal(result.embeddedTextAllowed, true);
    assert.equal(result.wcagClassification, 'WCAG_2.2_AA');
    assert.notEqual(result.wcagClassification, 'WCAG_2.2_AAA');
  });

  await t.test('3. Classifies 7.5:1 contrast as WCAG 2.2 AAA', () => {
    const result = TypographyEmbeddedTextEngine.resolve({
      requestedText: 'Cloud Stack',
      postContent: 'Article on Cloud Stack architecture',
      contrastRatio: 7.5,
      explicitTextMode: true,
    });

    assert.equal(result.wcagClassification, 'WCAG_2.2_AAA');
  });

  await t.test('4. Rejects text exceeding 5 words and falls back to text-free imagery', () => {
    const result = TypographyEmbeddedTextEngine.resolve({
      requestedText: 'This long headline has way too many words for an image overlay',
      contrastRatio: 5.0,
      explicitTextMode: true,
    });

    assert.equal(result.embeddedTextAllowed, false);
    assert.equal(result.fallbackToTextFreeImage, true);
    assert.ok(result.reason.includes('TEXT_TOO_LONG'));
  });

  await t.test('5. Rejects low contrast (< 4.5) and falls back to text-free imagery', () => {
    const result = TypographyEmbeddedTextEngine.resolve({
      requestedText: 'Low Contrast',
      postContent: 'Low Contrast test',
      contrastRatio: 3.2,
      explicitTextMode: true,
    });

    assert.equal(result.embeddedTextAllowed, false);
    assert.equal(result.wcagClassification, 'FAIL');
    assert.ok(result.reason.includes('INSUFFICIENT_CONTRAST'));
  });
});
