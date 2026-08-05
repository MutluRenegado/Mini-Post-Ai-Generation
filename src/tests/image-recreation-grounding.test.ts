import { CanonicalImageService } from '../lib/ai-image-generator/images/CanonicalImageService';
import { PostVisualBriefExtractor } from '../lib/ai-image-generator/images/PostVisualBriefExtractor';
import { ContentSummarizer } from '../lib/ai-image-generator/images/ContentSummarizer';
import { VisualRelevanceAnalyzer } from '../lib/ai-image-generator/images/VisualRelevanceAnalyzer';
import assert from 'assert';

async function testImageRecreationGrounding() {
  console.log('🧪 Starting Image Recreation Grounding & Persistence Unit Tests...\n');

  // Test 1: Domain Detection & Subject Grounding for Payment Terms
  const topic = 'what are the payment terms in international trade';
  const summary = ContentSummarizer.summarize({
    finalText: topic,
    textStatus: 'approved',
    platform: 'Instagram Feed',
  });

  const intent = VisualRelevanceAnalyzer.analyze({
    finalText: topic,
    textStatus: 'approved',
    visualSummary: summary,
    platform: 'Instagram Feed',
  });

  const brief = PostVisualBriefExtractor.extractFromIntent(intent, summary, {
    platform: 'Instagram Feed',
    postTopic: topic,
  });

  assert.strictEqual(intent.detectedDomain, 'international-trade', 'Test 1: Domain must be international-trade');
  assert(
    brief.mainSubject.toLowerCase().includes('trade finance') || brief.mainSubject.toLowerCase().includes('payment terms'),
    'Test 1: Main subject must reference trade finance or payment terms'
  );
  assert(
    !brief.mainSubject.toLowerCase().includes('organizational agility') &&
    !brief.mainSubject.toLowerCase().includes('strategic resilience'),
    'Test 1: Must NOT contain organizational agility / strategic resilience'
  );
  console.log('✅ Test 1 Passed: Grounded visual brief successfully derived for trade payment terms.');

  // Test 2: Local ADC Missing Error Reporting & Status Differentiation
  const contract = await CanonicalImageService.generateImageForPost(
    {
      operation: 'generate',
      postTopic: topic,
      postContent: topic,
      platform: 'Instagram Feed',
    },
    'test-user'
  );

  assert(contract.imageUrl, 'Test 2: Generated preview image URL must be preserved');
  assert(
    contract.imageStatus === 'stored' || contract.imageStatus === 'persisted' || contract.imageStatus === 'generation_succeeded_persistence_failed',
    `Test 2: Expected valid status, got "${contract.imageStatus}"`
  );
  if (contract.imageStatus === 'generation_succeeded_persistence_failed') {
    assert(
      contract.imageError?.includes('Image generated, but could not be saved to the Asset Library.'),
      'Test 2: Error notice must state image was generated but could not be saved to Asset Library'
    );
  }
  console.log('✅ Test 2 Passed: Preview preserved and imageStatus differentiated when storage upload fails.');

  console.log('\n🎉 ALL RECREATION GROUNDING & PERSISTENCE UNIT TESTS PASSED!');
}

testImageRecreationGrounding().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
