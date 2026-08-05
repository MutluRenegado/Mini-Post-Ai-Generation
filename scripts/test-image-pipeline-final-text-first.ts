import { ContentSummarizer } from '../src/lib/ai-image-generator/images/ContentSummarizer';
import { PostVisualBriefExtractor } from '../src/lib/ai-image-generator/images/PostVisualBriefExtractor';
import { ImagePromptBuilder } from '../src/lib/ai-image-generator/images/ImagePromptBuilder';
import { ImagePromptValidator } from '../src/lib/ai-image-generator/images/ImagePromptValidator';
import { CanonicalImageService } from '../src/lib/ai-image-generator/images/CanonicalImageService';

async function runTests() {
  console.log('=============== IMAGE PIPELINE FINAL TEXT FIRST TESTS ===============\n');
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalCount++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${detail || 'Assertion failed'}`);
    }
  }

  // 1. Image generation does not start before text approval (empty or unapproved text fails)
  try {
    ContentSummarizer.summarize({ finalText: '', textStatus: 'approved' });
    assert(false, 'Test 1: Empty final text should throw error');
  } catch (err: any) {
    assert(err.message.includes('IMAGE_PIPELINE_ERROR'), 'Test 1: Empty final text throws IMAGE_PIPELINE_ERROR');
  }

  try {
    ContentSummarizer.summarize({ finalText: 'Some post text', textStatus: 'draft' });
    assert(false, 'Test 1b: Unapproved textStatus should throw error');
  } catch (err: any) {
    assert(err.message.includes('IMAGE_PIPELINE_ERROR'), 'Test 1b: Draft textStatus throws IMAGE_PIPELINE_ERROR');
  }

  // 2. The original topic cannot bypass final-text summarization
  try {
    PostVisualBriefExtractor.extract({ operation: 'generate', postTopic: '', postContent: '' });
    assert(false, 'Test 2: Missing postContent and topic should throw error');
  } catch (err: any) {
    assert(err.message.includes('IMAGE_PIPELINE_ERROR'), 'Test 2: PostVisualBriefExtractor rejects empty content');
  }

  // 3. A changed final post produces a changed visual brief and image prompt
  const textA = 'A groundbreaking artificial intelligence model was deployed today to automate enterprise software architectures and monitor neural networks.';
  const textB = 'Global trade finance executives completed a major international supply chain agreement involving letters of credit and commercial risk balance.';

  const summaryA = ContentSummarizer.summarize({ finalText: textA, textStatus: 'approved', platform: 'LinkedIn' });
  const summaryB = ContentSummarizer.summarize({ finalText: textB, textStatus: 'approved', platform: 'LinkedIn' });

  const briefA = PostVisualBriefExtractor.extractFromSummary(summaryA, { platform: 'LinkedIn', postContent: textA });
  const briefB = PostVisualBriefExtractor.extractFromSummary(summaryB, { platform: 'LinkedIn', postContent: textB });

  const promptA = ImagePromptBuilder.buildPromptFromBrief(briefA);
  const promptB = ImagePromptBuilder.buildPromptFromBrief(briefB);

  assert(promptA !== promptB, 'Test 3: Different final posts produce different image prompts');
  assert(promptA.toLowerCase().includes('software') || promptA.toLowerCase().includes('tech') || promptA.toLowerCase().includes('architect'), 'Test 3a: Post A visual prompt contains tech keywords');
  assert(promptB.toLowerCase().includes('trade') || promptB.toLowerCase().includes('logistics') || promptB.toLowerCase().includes('finance'), 'Test 3b: Post B visual prompt contains trade/finance keywords');

  // 4. Unsupported visual elements are rejected by ImagePromptValidator
  const briefHealthcare = PostVisualBriefExtractor.extractFromSummary(
    ContentSummarizer.summarize({
      finalText: 'Leading medical doctors and clinical specialists published new hospital care guidelines for patient wellness.',
      textStatus: 'approved',
      platform: 'LinkedIn',
    }),
    { platform: 'LinkedIn' }
  );

  const hallucinatedPrompt = 'A cargo vessel container ship floating near trade manifest contracts in a dark empty office.';
  const validationResult = ImagePromptValidator.validateAgainstFinalText(
    hallucinatedPrompt,
    briefHealthcare,
    'Leading medical doctors and clinical specialists published new hospital care guidelines for patient wellness.'
  );

  assert(!validationResult.valid, 'Test 4: Hallucinated domain object and dark default prompt are rejected');
  assert(validationResult.problems.length > 0, 'Test 4a: Validation returns specific rejection problems');

  // 5. Empty final text prevents image generation in CanonicalImageService
  const emptyContract = await CanonicalImageService.generateImageForPost({
    operation: 'generate',
    postTopic: '',
    postContent: '',
  });
  assert(emptyContract.imageStatus === 'failed', 'Test 5: CanonicalImageService fails safely when postContent is empty');

  // 6. Valid final post content successfully generates valid image contract
  const validContract = await CanonicalImageService.generateImageForPost({
    operation: 'generate',
    postTopic: 'Artificial Intelligence in Modern Business',
    postContent: 'Our team of lead software engineers and AI architects successfully launched an automated enterprise neural network pipeline.',
    platform: 'LinkedIn',
  });

  const isSuccessOrRateLimited = validContract.imageStatus !== 'failed' || (validContract.imageError?.includes('HTTP 429') ?? false);
  assert(isSuccessOrRateLimited, 'Test 6: Valid post content produces successful image contract or handles rate limits safely');
  assert(!!validContract.visualBrief, 'Test 6a: Contract contains structured PostVisualBrief');
  assert(!!validContract.promptUsed, 'Test 6b: Contract contains generated prompt string');

  console.log(`\n======================================================`);
  console.log(`RESULT: ${passedCount} / ${totalCount} tests passed.`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unhandled error in test runner:', err);
  process.exit(1);
});
