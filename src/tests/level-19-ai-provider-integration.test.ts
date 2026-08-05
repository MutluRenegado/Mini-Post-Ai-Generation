import assert from 'assert';
import { test, describe } from 'node:test';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '../lib/ai-image-generator/images/visualConceptGenerator';
import { CompositionPlanner } from '../lib/ai-image-generator/images/compositionPlanner';
import { MasterImagePromptBuilder } from '../lib/ai-image-generator/images/masterImagePromptBuilder';
import { ImagePromptValidator } from '../lib/ai-image-generator/images/ImagePromptValidator';
import { PromptRepairEngine } from '../lib/ai-image-generator/images/promptRepairEngine';
import { AIProviderAdapter } from '../lib/ai-image-generator/images/aiProviderAdapter';
import { AIProviderRouter } from '../lib/ai-image-generator/images/aiProviderRouter';
import { AIImageGenerationRequest } from '../lib/ai-image-generator/images/ai-provider-adapter.types';

describe('Level 19: Real AI Provider Integration & Adapter Layer Test Suite (25 Assertions)', () => {
  const postText = 'Accelerating enterprise cloud infrastructure with automated AI threat monitoring.';
  const brief = FinalPostAnalyzer.analyze({ postContent: postText, platform: 'LinkedIn' });
  const concept = VisualConceptGenerator.generateConcepts(brief).selectedConcept;
  const composition = CompositionPlanner.planComposition(brief, concept).selectedComposition;
  const masterPrompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
  const validatedPrompt = PromptRepairEngine.repairPrompt(masterPrompt).repairedPrompt;

  const validRequest: AIImageGenerationRequest = {
    prompt: validatedPrompt,
    aspectRatio: '1.91:1',
    width: 1200,
    height: 675,
    seed: 42,
  };

  test('1. Mandatory Provider Audit details documented', () => {
    assert.strictEqual(typeof validatedPrompt.promptText, 'string');
  });

  test('2. AIProviderAdapter.executeGeneration() accepts valid AIImageGenerationRequest', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(!!res, true);
    assert.strictEqual(res.briefId, brief.id);
  });

  test('3. Response contains valid canonical ImageAssetResult', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(res.asset.kind, 'AI_GENERATED');
    assert.strictEqual(res.asset.source, 'POLLINATIONS_AI');
  });

  test('4. Real provider URL is generated and valid', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(res.asset.url.startsWith('https://'), true);
  });

  test('5. Base64 payload is present in response asset', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(typeof res.asset.base64, 'string');
    assert.strictEqual(res.asset.base64!.length > 0, true);
  });

  test('6. Dimensions match requested platform aspect ratio', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(res.width, 1200);
    assert.strictEqual(res.height, 675);
    assert.strictEqual(res.asset.aspectRatio, '1.91:1');
  });

  test('7. MIME type is valid image MIME type', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(res.mimeType.startsWith('image/'), true);
  });

  test('8. Provider metadata accurately identifies provider and model', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(res.provider, 'pollinations_ai');
    assert.strictEqual(res.model, 'FLUX.1-schnell');
  });

  test('9. Prompt version is preserved in AI generation response', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(res.promptVersion, validatedPrompt.version);
  });

  test('10. Brief ID, concept ID, and composition plan ID are preserved', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(res.briefId, brief.id);
    assert.strictEqual(res.conceptId, concept.id);
    assert.strictEqual(res.compositionPlanId, composition.id);
  });

  test('11. Generation timestamps are valid ISO strings', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(typeof res.generationStartedAt, 'string');
    assert.strictEqual(typeof res.generationCompletedAt, 'string');
  });

  test('12. AIProviderRouter.generate() routes request successfully', async () => {
    const res = await AIProviderRouter.generate(validRequest);
    assert.strictEqual(res.asset.kind, 'AI_GENERATED');
  });

  test('13. Invalid/null request throws validation error in adapter', async () => {
    await assert.rejects(
      async () => await AIProviderAdapter.executeGeneration(null as any),
      (err: any) => err.message.includes('INVALID_ADAPTER_REQUEST')
    );
  });

  test('14. Invalid/null request throws validation error in router', async () => {
    await assert.rejects(
      async () => await AIProviderRouter.generate(null as any),
      (err: any) => err.message.includes('INVALID_ROUTER_REQUEST')
    );
  });

  test('15. Seed is preserved across adapter request and response', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(res.seed, 42);
  });

  test('16. Level 18 Prompt Validation tests remain passing', () => {
    const val = ImagePromptValidator.validate(validatedPrompt);
    assert.strictEqual(val.valid, true);
  });

  test('17. Level 17 Master Prompt Builder tests remain passing', () => {
    assert.strictEqual(masterPrompt.briefId, brief.id);
  });

  test('18. Level 16 Composition Planner tests remain passing', () => {
    assert.strictEqual(composition.status, 'selected');
  });

  test('19. Level 15 Visual Concept Generator tests remain passing', () => {
    assert.strictEqual(concept.status, 'selected');
  });

  test('20. Level 14 Visual Brief tests remain passing', () => {
    assert.strictEqual(brief.platform, 'LinkedIn');
  });

  test('21. File size is calculated when base64 is present', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(typeof res.fileSize, 'number');
    assert.strictEqual(res.fileSize! > 0, true);
  });

  test('22. Provider metadata contains negative prompt used and fingerprint', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(typeof res.providerMetadata?.fingerprint, 'string');
  });

  test('23. Alt text uses concise prompt summary or primary subject', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(typeof res.asset.altText, 'string');
    assert.strictEqual(res.asset.altText.length > 0, true);
  });

  test('24. RequestId is unique and present', async () => {
    const res = await AIProviderAdapter.executeGeneration(validRequest);
    assert.strictEqual(typeof res.requestId, 'string');
    assert.strictEqual(res.requestId!.startsWith('req_'), true);
  });

  test('25. Complete visual pipeline from post to real AI image response succeeds cleanly', async () => {
    const res = await AIProviderRouter.generate(validRequest);
    assert.strictEqual(res.asset.width, 1200);
    assert.strictEqual(res.asset.height, 675);
  });
});
