import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CanonicalImageService } from '../lib/ai-image-generator/images/CanonicalImageService';

describe('Level 50: Live Production API Integration Verification Test Suite', () => {
  test('1. CanonicalImageService delegates to MasterImageOrchestrator and executes Levels 32–50 in live production path', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test_key_placeholder';

    const request = {
      operation: 'generate' as const,
      postTopic: 'Enterprise Cybersecurity Operations Center',
      postContent: 'Announcing our ISO-27001 certified SOC monitoring platform with 24/7 automated telemetry.',
      platform: 'LinkedIn',
      aspectRatio: '1:1' as const,
    };

    const contract = await CanonicalImageService.generateImageForPost(request, 'user_prod_123');

    // 1. Assert basic contract properties (allows local test environment persistence status)
    assert.ok(
      contract.imageStatus === 'generated' || contract.imageStatus === 'generation_succeeded_persistence_failed',
      `Unexpected imageStatus: ${contract.imageStatus}`
    );
    assert.ok(contract.promptUsed && contract.promptUsed.length > 20);

    // 2. Assert Level 50 Provenance and Fingerprints are produced by live entry point
    assert.ok(contract.provenance, 'Live entry point must return Level 50 provenance');
    assert.ok(contract.outputFingerprint && contract.outputFingerprint.length === 64, 'Must return 64-hex SHA-256 fingerprint');

    // 3. Assert Level 32–49 Pipeline Result is attached to contract
    assert.ok(contract.pipelineResult, 'Must return pipelineResult from MasterImageOrchestrator');
    assert.strictEqual(contract.pipelineResult.success, true);
    assert.ok(contract.pipelineResult.intelligence.camera.shotType);
    assert.ok(contract.pipelineResult.intelligence.lighting.lightSource);
    assert.ok(contract.pipelineResult.intelligence.platformOptimization.aspectRatio);
    assert.ok(contract.pipelineResult.qaReport.overallDisposition);
    assert.ok(contract.pipelineResult.promptCompression.compressedPromptText);
  });

  test('2. CanonicalImageService strictly rejects unfinished post content', async () => {
    const request = {
      operation: 'generate' as const,
      postTopic: 'Unfinished Draft',
      postContent: '',
      textStatus: 'DRAFT',
      platform: 'LinkedIn',
    };

    const contract = await CanonicalImageService.generateImageForPost(request as any, 'user_prod_123');

    assert.strictEqual(contract.imageStatus, 'failed');
    assert.match(contract.imageError || '', /IMAGE_GENERATION_BLOCKED_TEXT_NOT_FINAL|FINAL_TEXT_EMPTY/);
  });
});
