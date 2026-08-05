import test from 'node:test';
import assert from 'node:assert/strict';
import { ProviderCompatibilityEngine } from '../lib/ai-image-generator/images/ProviderCompatibilityEngine';

test('Level 47: Provider and Model Compatibility Engine Test Suite', async (t) => {
  await t.test('1. Validates Google Imagen 3 capabilities correctly', () => {
    // Temporarily simulate key present for compatibility check test
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test_key_placeholder';

    const result = ProviderCompatibilityEngine.checkCompatibility({
      providerId: 'google',
      aspectRatio: '16:9',
      promptTextLength: 350,
    });

    assert.equal(result.providerId, 'google');
    assert.equal(result.isCompatible, true);
    assert.equal(result.secretsExposed, false);
    assert.equal(result.deterministicFingerprint.length, 64);
  });

  await t.test('2. Returns explicit typed failure when server API key is missing', () => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const result = ProviderCompatibilityEngine.checkCompatibility({
      providerId: 'google',
      aspectRatio: '1:1',
    });

    assert.equal(result.isCompatible, false);
    assert.equal(result.isRetryableFailure, false);
    assert.ok(result.incompatibilityReasons?.some((r) => r.includes('SERVER_SECRET_MISSING')));
  });

  await t.test('3. Detects unsupported negative prompt for DALL-E 3', () => {
    process.env.OPENAI_API_KEY = 'test_key_placeholder';

    const result = ProviderCompatibilityEngine.checkCompatibility({
      providerId: 'openai',
      aspectRatio: '1:1',
      negativePromptProvided: true,
    });

    assert.equal(result.isCompatible, false);
    assert.ok(result.incompatibilityReasons?.some((r) => r.includes('NEGATIVE_PROMPT_UNSUPPORTED')));
  });
});
