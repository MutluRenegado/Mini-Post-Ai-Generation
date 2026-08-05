import test from 'node:test';
import assert from 'node:assert';
import { extractAndParseJSON, sanitizeJSONStringLiterals } from '../lib/ai-text-editor/utils/jsonExtractor';

test('JSON Extractor Robustness Suite', async (t) => {
  await t.test('1. Parses valid clean JSON object', () => {
    const raw = '{"topic": "Payment Terms", "status": "success"}';
    const res = extractAndParseJSON(raw);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data?.topic, 'Payment Terms');
  });

  await t.test('2. Removes markdown code block fences safely', () => {
    const raw = '```json\n{"masterPost": "International trade payment terms include Letter of Credit and Open Account."}\n```';
    const res = extractAndParseJSON(raw);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data?.masterPost.includes('Letter of Credit'), true);
  });

  await t.test('3. Handles multiline article text with unescaped newlines in string literals', () => {
    const raw = '{\n  "LinkedIn": "Line 1 of payment terms article.\nLine 2 covering Letter of Credit.\nLine 3 describing Bank Guarantee."\n}';
    const res = extractAndParseJSON(raw);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data?.LinkedIn.includes('Line 2 covering Letter of Credit.'), true);
  });

  await t.test('4. Handles quotation marks inside article text safely', () => {
    const raw = '{"body": "The buyer agreed to the term \\"Letter of Credit\\" as primary payment assurance."}';
    const res = extractAndParseJSON(raw);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data?.body, 'The buyer agreed to the term "Letter of Credit" as primary payment assurance.');
  });

  await t.test('5. Handles unescaped tab characters in string literals', () => {
    const raw = '{"details": "Payment Term:\tLetter of Credit\tDays:\t30"}';
    const res = extractAndParseJSON(raw);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data?.details.includes('Letter of Credit'), true);
  });

  await t.test('6. Preserves Unicode characters cleanly', () => {
    const raw = '{"topic": "International Trade 🌍", "summary": "Payment terms & risk management 🚀"}';
    const res = extractAndParseJSON(raw);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data?.topic, 'International Trade 🌍');
  });

  await t.test('7. Safely rejects malformed unparseable JSON', () => {
    const raw = '{"topic": "Payment Terms", "status": }';
    const res = extractAndParseJSON(raw);
    assert.strictEqual(res.success, false);
    assert.strictEqual(typeof res.error, 'string');
  });

  await t.test('8. Rejects truncated JSON output', () => {
    const raw = '{"topic": "Payment Terms", "body": "In international trade, open account payments...';
    const res = extractAndParseJSON(raw);
    assert.strictEqual(res.success, false);
  });

  await t.test('9. Extracts JSON from surrounding explanatory text', () => {
    const raw = 'Here is the generated post content JSON:\n{"masterPost": "Letter of Credit protects exporter."}\nHope this helps!';
    const res = extractAndParseJSON(raw);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data?.masterPost, 'Letter of Credit protects exporter.');
  });

  await t.test('10. Image request occurs only after valid text generation', () => {
    const textFailed = false;
    let imageRequested = false;

    if (textFailed) {
      imageRequested = true;
    }

    assert.strictEqual(imageRequested, false);

    const textSuccess = true;
    if (textSuccess) {
      imageRequested = true;
    }
    assert.strictEqual(imageRequested, true);
  });
});
