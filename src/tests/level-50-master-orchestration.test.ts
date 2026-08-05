import test from 'node:test';
import assert from 'node:assert/strict';
import { MasterImageOrchestrator } from '../lib/ai-image-generator/images/MasterImageOrchestrator';

test('Level 50: Master Image-Generation Orchestrator Integration Test Suite', async (t) => {
  await t.test('1. Runs full 16-step text-first pipeline successfully for valid post', () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test_key_placeholder';

    const result = MasterImageOrchestrator.runPipeline({
      postTopic: 'Solar Farm Energy Expansion',
      postContent: 'We are proud to announce our new 50MW solar farm installation delivering clean renewable energy to 20,000 households.',
      platform: 'LinkedIn',
    });

    assert.equal(result.success, true);
    assert.ok(result.brief.id.startsWith('vib_'));
    assert.equal(result.intelligence.camera.isPhysicallyCoherent, true);
    assert.equal(result.intelligence.lighting.lightSource, 'natural_sunlight');
    assert.equal(result.intelligence.materialTexture.primarySurface.material, 'photovoltaic_silicon');
    assert.equal(result.intelligence.platformOptimization.aspectRatio, '1.91:1');
    assert.equal(result.qaReport.overallDisposition, 'PASS');
    assert.equal(result.promptCompression.providerTokenLimitCompliant, true);
    assert.equal(result.providerCompatibility.isCompatible, true);
    assert.equal(result.outputFingerprint.length, 64);
    assert.equal(result.provenance.standardIdentifiers.length, 5);
  });

  await t.test('2. Rejects unfinished post draft content', () => {
    assert.throws(() => {
      MasterImageOrchestrator.runPipeline({
        postTopic: 'Draft topic',
        postContent: '',
      });
    }, /UNFINISHED_TEXT_REJECTED/);
  });

  await t.test('3. Triggers self-healing prompt repair when anatomy risk is present', () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test_key_placeholder';

    const result = MasterImageOrchestrator.runPipeline({
      postTopic: 'Executive portrait',
      postContent: 'Executive holding camera with 6 fingers in studio',
      platform: 'LinkedIn',
    });

    assert.ok(result.promptRepair !== undefined);
    assert.ok(result.promptRepair.repairedPromptText.includes('5 distinct fingers'));
    assert.ok(result.promptRepair.repairedNegativePromptText.includes('extra fingers'));
  });

  await t.test('4. Fingerprint is deterministic across repeated runs', () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test_key_placeholder';

    const input = {
      postTopic: 'AI Cloud Platform',
      postContent: 'Deploying machine learning models to secure cloud infrastructure.',
      platform: 'X',
    };

    const r1 = MasterImageOrchestrator.runPipeline(input);
    const r2 = MasterImageOrchestrator.runPipeline(input);

    assert.equal(r1.outputFingerprint, r2.outputFingerprint);
    assert.equal(r1.provenance.inputFingerprint, r2.provenance.inputFingerprint);
  });
});
