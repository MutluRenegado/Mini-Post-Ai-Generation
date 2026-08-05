import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { PostVisualBriefExtractor } from '../lib/ai-image-generator/images/PostVisualBriefExtractor';
import { StockSearchQueryBuilder } from '../lib/services/stockSearchQueryBuilder';

describe('Level 14: Final Post Analyzer and Visual Intelligence Brief Test Suite (15 Assertions)', () => {
  const postA = 'Announcing our new AI-driven cloud automation platform! Contact us at support@example.com or +1 555 123 4567. Visit https://example.com/blog?utm_source=twitter for details.';
  const postB = 'Quarterly financial report shows 45% revenue growth in enterprise software services.';

  test('1. Finalized post is required (empty content throws error)', () => {
    assert.throws(
      () => FinalPostAnalyzer.analyze({ postContent: '' }),
      (err: any) => err.message.includes('FINALIZED_POST_REQUIRED')
    );
  });

  test('2. Different posts produce different briefs and fingerprints', () => {
    const briefA = FinalPostAnalyzer.analyze({ postContent: postA, platform: 'LinkedIn' });
    const briefB = FinalPostAnalyzer.analyze({ postContent: postB, platform: 'LinkedIn' });

    assert.notStrictEqual(briefA.id, briefB.id);
    assert.notStrictEqual(briefA.deterministicFingerprint, briefB.deterministicFingerprint);
  });

  test('3. Identical posts produce deterministic briefs and fingerprints', () => {
    const b1 = FinalPostAnalyzer.analyze({ postContent: postA, platform: 'LinkedIn' });
    const b2 = FinalPostAnalyzer.analyze({ postContent: postA, platform: 'LinkedIn' });

    assert.strictEqual(b1.id, b2.id);
    assert.strictEqual(b1.deterministicFingerprint, b2.deterministicFingerprint);
  });

  test('4. Central message is extracted from post content', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: postB, platform: 'LinkedIn' });
    assert.strictEqual(brief.centralMessage.includes('Quarterly financial report'), true);
  });

  test('5. Primary subject is extracted', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: postB, platform: 'LinkedIn' });
    assert.strictEqual(typeof brief.primarySubject, 'string');
    assert.strictEqual(brief.primarySubject.length > 0, true);
  });

  test('6. Setting and action are extracted', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: postA, platform: 'LinkedIn' });
    assert.strictEqual(typeof brief.setting, 'string');
    assert.strictEqual(typeof brief.action, 'string');
  });

  test('7. Audience, mood, and tone are extracted', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: postA, platform: 'LinkedIn' });
    assert.strictEqual(typeof brief.audience, 'string');
    assert.strictEqual(typeof brief.mood, 'string');
    assert.strictEqual(typeof brief.tone, 'string');
  });

  test('8. Visual metaphor is produced', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: postA, platform: 'LinkedIn' });
    assert.strictEqual(typeof brief.visualMetaphor, 'string');
    assert.strictEqual(brief.visualMetaphor!.length > 0, true);
  });

  test('9. Platform affects aspect ratio and safe areas', () => {
    const storyBrief = FinalPostAnalyzer.analyze({ postContent: postA, platform: 'Instagram Story' });
    const liBrief = FinalPostAnalyzer.analyze({ postContent: postA, platform: 'LinkedIn' });

    assert.strictEqual(storyBrief.aspectRatio, '9:16');
    assert.strictEqual(storyBrief.safeAreas.top, 80);

    assert.strictEqual(liBrief.aspectRatio, '1.91:1');
    assert.strictEqual(liBrief.safeAreas.top, 20);
  });

  test('10. Brand context is preserved', () => {
    const brand = { brandId: 'brand_99', personality: 'Luxury', palette: ['#FF0055', '#000000'] };
    const brief = FinalPostAnalyzer.analyze({ postContent: postA, platform: 'LinkedIn', brandContext: brand });

    assert.strictEqual(brief.brandDirection?.brandId, 'brand_99');
    assert.strictEqual(brief.brandDirection?.personality, 'Luxury');
  });

  test('11. Sensitive PII data (emails, phone numbers) are stripped', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: postA, platform: 'LinkedIn' });

    assert.strictEqual(brief.sanitizedSourceSummary.includes('support@example.com'), false);
    assert.strictEqual(brief.sanitizedSourceSummary.includes('+1 555 123 4567'), false);
  });

  test('12. URLs and tracking parameters are stripped', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: postA, platform: 'LinkedIn' });

    assert.strictEqual(brief.sanitizedSourceSummary.includes('https://example.com'), false);
    assert.strictEqual(brief.sanitizedSourceSummary.includes('utm_source'), false);
  });

  test('13. Standalone image mode allows missing post content', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: '', standaloneImageMode: true, postTopic: 'Creative Studio', platform: 'Instagram' });
    assert.strictEqual(brief.aspectRatio, '1:1');
  });

  test('14. Existing stock-search pipeline remains compatible', () => {
    const oldBrief = PostVisualBriefExtractor.extract({
      operation: 'generate',
      postTopic: 'Tech',
      postContent: 'Cloud computing platform',
      platform: 'LinkedIn',
    });
    const built = StockSearchQueryBuilder.buildQuery(oldBrief);
    assert.strictEqual(typeof built.query, 'string');
  });

  test('15. VisualIntelligenceBrief Schema is validated cleanly', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: postB, platform: 'LinkedIn' });
    assert.strictEqual(typeof brief.generationTimestamp, 'string');
  });
});
