import test from 'node:test';
import assert from 'node:assert/strict';
import { ImageSemanticEvaluationEngine } from '../lib/ai-image-generator/images/ImageSemanticEvaluationEngine';

test('Level 48: Image Evaluation and Semantic Relevance Engine Test Suite', async (t) => {
  await t.test('1. Returns UNAVAILABLE status for vision content score when vision model payload is missing', () => {
    const result = ImageSemanticEvaluationEngine.evaluate({
      postContent: 'Article on cloud infrastructure scalability',
      briefSummary: 'Cloud infrastructure server racks in data center',
      promptText: 'Professional photograph of cloud infrastructure server racks in clean data center',
    });

    assert.equal(result.imageContentVisionScore.status, 'UNAVAILABLE');
    assert.equal(result.imageContentVisionScore.score, 0);
    assert.ok(result.imageContentVisionScore.limitationsNote?.includes('REAL_VISION_UNAVAILABLE'));
    assert.equal(result.overallStatus, 'UNVERIFIED');
    assert.equal(result.isPassed, true); // Text-to-brief and brief-to-prompt passed
  });

  await t.test('2. Returns VERIFIED status when real vision analysis payload is provided', () => {
    const result = ImageSemanticEvaluationEngine.evaluate({
      postContent: 'Article on cloud infrastructure scalability',
      briefSummary: 'Cloud infrastructure server racks in data center',
      promptText: 'Professional photograph of cloud infrastructure server racks in clean data center',
      visionAnalysisPayload: {
        realScore: 92,
        realConfidence: 0.96,
        realEvidence: 'Vision model confirmed server racks and data center setting in image',
      },
    });

    assert.equal(result.imageContentVisionScore.status, 'VERIFIED');
    assert.equal(result.imageContentVisionScore.score, 92);
    assert.equal(result.overallStatus, 'VERIFIED');
  });
});
