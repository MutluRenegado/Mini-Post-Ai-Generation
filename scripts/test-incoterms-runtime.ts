import { CanonicalImageService } from '../src/lib/ai-image-generator/images/CanonicalImageService';
import { PostVisualBriefExtractor } from '../src/lib/ai-image-generator/images/PostVisualBriefExtractor';
import { ContentSummarizer } from '../src/lib/ai-image-generator/images/ContentSummarizer';
import { VisualRelevanceAnalyzer } from '../src/lib/ai-image-generator/images/VisualRelevanceAnalyzer';
import assert from 'assert';

async function runRuntimeTest() {
  console.log('=== RUNTIME TEST: International Trade Payment Terms ===\n');

  const topic = 'what are the payment terms in international trade';
  console.log('1. Testing Semantic Grounding for Topic:', topic);

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

  console.log('  ├─ Detected Domain:', intent.detectedDomain);
  console.log('  ├─ Main Subject:', brief.mainSubject);
  console.log('  ├─ Supporting Objects:', brief.keyObjects);
  console.log('  └─ Visual Story:', brief.visualStory);

  assert.strictEqual(intent.detectedDomain, 'international-trade', 'Domain should be international-trade');
  assert(
    brief.mainSubject.toLowerCase().includes('trade finance') || brief.mainSubject.toLowerCase().includes('payment terms'),
    `Subject should reference trade finance or payment terms (got: "${brief.mainSubject}")`
  );
  assert(
    !brief.mainSubject.toLowerCase().includes('organizational agility') &&
    !brief.mainSubject.toLowerCase().includes('strategic resilience'),
    'Subject must NOT contain unrelated organizational agility / strategic resilience strings'
  );

  console.log('\n2. Testing End-to-End Canonical Image Generation for Topic:', topic);
  const contract = await CanonicalImageService.generateImageForPost(
    {
      operation: 'generate',
      postTopic: topic,
      postContent: topic,
      platform: 'Instagram Feed',
      aspectRatio: '1:1',
      versionId: `test_run_${Date.now()}`,
    },
    'local-test-user'
  );

  console.log('  ├─ Image Status:', contract.imageStatus);
  console.log('  ├─ Image Source:', contract.imageSource);
  console.log('  ├─ Prompt Used (first 120 chars):', contract.promptUsed?.slice(0, 120) + '...');
  console.log('  ├─ Preview Image Bytes Present:', Boolean(contract.imageUrl));
  console.log('  ├─ Preview URL Prefix:', contract.imageUrl?.slice(0, 40) + '...');
  if (contract.imageError) {
    console.log('  └─ Image Error Notice:', contract.imageError);
  }

  assert(
    contract.imageStatus === 'stored' || contract.imageStatus === 'persisted' || contract.imageStatus === 'generation_succeeded_persistence_failed',
    `Expected valid generation status, received "${contract.imageStatus}"`
  );
  assert(contract.imageUrl && contract.imageUrl.length > 100, 'Real image preview bytes (data URL) must be returned');
  assert(
    contract.promptUsed?.toLowerCase().includes('trade') || contract.promptUsed?.toLowerCase().includes('payment'),
    'Prompt must reference trade or payment'
  );

  console.log('\n=== RUNTIME TEST COMPLETED SUCCESSFULLY ===');
}

runRuntimeTest().catch((err) => {
  console.error('❌ Runtime test failed:', err);
  process.exit(1);
});

