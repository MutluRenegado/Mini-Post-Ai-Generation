import { StandardsValidator } from '../src/standards/standards-validator';

async function runRuntimeIntegrationVerification() {
  console.log('================================================================');
  console.log(' 🚀 RUNTIME STANDARDS ENFORCEMENT & INTEGRATION SUITE');
  console.log('================================================================\n');

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

  // 1. AI Writing Prohibited Phrase
  const validAIWriting = StandardsValidator.validateAIWriting('Our team implemented a high-performance content engine.');
  const invalidAIWriting = StandardsValidator.validateAIWriting('Let us delve into this tapestry of features.');
  assert(validAIWriting.valid, '1. AI Writing Valid: Clean text passes validation');
  assert(!invalidAIWriting.valid && invalidAIWriting.code === 'PROHIBITED_AI_PHRASE', '1a. AI Writing Failure: Prohibited phrase "delve" rejected');

  // 2. Prompt Length
  const validPrompt = StandardsValidator.validatePromptInput('A concise campaign prompt.');
  const invalidPrompt = StandardsValidator.validatePromptInput('P'.repeat(4097));
  assert(validPrompt.valid, '2. Prompt Length Valid: Prompt <= 4096 chars passes');
  assert(!invalidPrompt.valid && invalidPrompt.code === 'PROMPT_TOO_LONG', '2a. Prompt Length Failure: Prompt > 4096 chars rejected');

  // 3. Facebook Character Limit
  const validFBPost = StandardsValidator.validatePostLength('facebook', 'A concise Facebook update.');
  const invalidFBPost = StandardsValidator.validatePostLength('facebook', 'A'.repeat(63207));
  assert(validFBPost.valid, '3. FB Post Valid: Post within 63,206 limit passes');
  assert(!invalidFBPost.valid && invalidFBPost.code === 'FB_CHAR_LIMIT_EXCEEDED', '3a. FB Post Failure: Post exceeding 63,206 limit rejected');

  // 4. X Character Limit
  const validXPost = StandardsValidator.validatePostLength('x', 'A short X tweet under 280 characters.');
  const invalidXPost = StandardsValidator.validatePostLength('x', 'B'.repeat(281));
  assert(validXPost.valid, '4. X Post Valid: Tweet within 280 limit passes');
  assert(!invalidXPost.valid && invalidXPost.code === 'X_CHAR_LIMIT_EXCEEDED', '4a. X Post Failure: Tweet exceeding 280 limit rejected');

  // 5. Instagram Character Limit
  const validIGPost = StandardsValidator.validatePostLength('instagram', 'Instagram caption text');
  const invalidIGPost = StandardsValidator.validatePostLength('instagram', 'I'.repeat(2201));
  assert(validIGPost.valid, '5. IG Post Valid: Caption within 2,200 limit passes');
  assert(!invalidIGPost.valid && invalidIGPost.code === 'IG_CHAR_LIMIT_EXCEEDED', '5a. IG Post Failure: Caption > 2,200 limit rejected');

  // 6. Image 95% Semantic Acceptance Threshold
  const validImage = StandardsValidator.validateImageSemanticScore(98);
  const invalidImage = StandardsValidator.validateImageSemanticScore(84);
  assert(validImage.valid, '6. Image Score Valid: 98% semantic score passes (>= 95%)');
  assert(!invalidImage.valid && invalidImage.code === 'IMAGE_SEMANTIC_SCORE_BELOW_THRESHOLD', '6a. Image Score Failure: 84% score rejected (< 95%)');

  // 7. Aspect Ratio Sizing Validation
  const validRatio = StandardsValidator.validateAspectRatio('16:9');
  const invalidRatio = StandardsValidator.validateAspectRatio('1:5');
  assert(validRatio.valid, '7. Aspect Ratio Valid: 16:9 ratio passes');
  assert(!invalidRatio.valid && invalidRatio.code === 'INVALID_ASPECT_RATIO', '7a. Aspect Ratio Failure: Invalid 1:5 ratio rejected');

  // 8. Video Shorts Specs
  const validShorts = StandardsValidator.validateVideoSpecs('shorts', 45, '9:16', -14);
  const invalidShortsDuration = StandardsValidator.validateVideoSpecs('shorts', 75, '9:16', -14);
  const invalidShortsRatio = StandardsValidator.validateVideoSpecs('shorts', 45, '16:9', -14);
  assert(validShorts.valid, '8. Shorts Specs Valid: 45s, 9:16 ratio passes');
  assert(!invalidShortsDuration.valid && invalidShortsDuration.code === 'SHORTS_DURATION_EXCEEDED', '8a. Shorts Duration Failure: 75s duration rejected (> 60s)');
  assert(!invalidShortsRatio.valid && invalidShortsRatio.code === 'INVALID_SHORTS_ASPECT_RATIO', '8b. Shorts Aspect Ratio Failure: 16:9 ratio rejected for Shorts');

  // 9. SEO Title & Meta Description
  const validSEO = StandardsValidator.validateSEO('Creator Studio Title', 'A concise meta description.');
  const invalidSEOTitle = StandardsValidator.validateSEO('T'.repeat(61), 'Description');
  assert(validSEO.valid, '9. SEO Valid: Title <= 60 chars passes');
  assert(!invalidSEOTitle.valid && invalidSEOTitle.code === 'SEO_TITLE_TOO_LONG', '9a. SEO Failure: Title > 60 chars rejected');

  // 10. Hashtag Anti-Spam Validation
  const validHashtags = StandardsValidator.validateHashtags(['#Marketing', '#SaaS']);
  const invalidHashtags = StandardsValidator.validateHashtags(['#follow4follow']);
  assert(validHashtags.valid, '10. Hashtags Valid: Standard hashtags pass');
  assert(!invalidHashtags.valid && invalidHashtags.code === 'PROHIBITED_HASHTAG', '10a. Hashtags Failure: Prohibited hashtag "#follow4follow" rejected');

  // 11. Scheduling Advance Limit
  const validScheduling = StandardsValidator.validateScheduling(30);
  const invalidScheduling = StandardsValidator.validateScheduling(3);
  assert(validScheduling.valid, '11. Scheduling Valid: 30 mins in advance passes (>= 10 mins)');
  assert(!invalidScheduling.valid && invalidScheduling.code === 'SCHEDULE_TOO_SOON', '11a. Scheduling Failure: 3 mins in advance rejected (< 10 mins)');

  // 12. Publishing Payload Limit
  const validPayload = StandardsValidator.validatePublishingPayload(5000000);
  const invalidPayload = StandardsValidator.validatePublishingPayload(15000000);
  assert(validPayload.valid, '12. Payload Valid: 5MB payload passes (<= 10MB)');
  assert(!invalidPayload.valid && invalidPayload.code === 'PAYLOAD_TOO_LARGE', '12a. Payload Failure: 15MB payload rejected (> 10MB)');

  // 13. WCAG 2.2 AA Accessibility Contrast
  const validContrast = StandardsValidator.validateAccessibilityContrast(6.5);
  const invalidContrast = StandardsValidator.validateAccessibilityContrast(2.8);
  assert(validContrast.valid, '13. Contrast Valid: 6.5:1 contrast ratio passes (>= 4.5:1)');
  assert(!invalidContrast.valid && invalidContrast.code === 'WCAG_CONTRAST_FAIL', '13a. Contrast Failure: 2.8:1 contrast ratio rejected (< 4.5:1)');

  // 14. Layout Safe Zone
  const validSafeZone = StandardsValidator.validateLayoutSafeZone(32);
  const invalidSafeZone = StandardsValidator.validateLayoutSafeZone(8);
  assert(validSafeZone.valid, '14. Safe Zone Valid: 32px padding passes (>= 24px)');
  assert(!invalidSafeZone.valid && invalidSafeZone.code === 'SAFE_ZONE_VIOLATION', '14a. Safe Zone Failure: 8px padding rejected (< 24px)');

  console.log(`\n======================================================`);
  console.log(`RESULT: ${passedCount} / ${totalCount} runtime enforcement tests passed.`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runRuntimeIntegrationVerification().catch((err) => {
  console.error('Unhandled error in runtime integration test suite:', err);
  process.exit(1);
});
