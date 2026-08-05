import { PostVisualBriefExtractor } from '../src/lib/ai-image-generator/images/PostVisualBriefExtractor';
import { ImagePromptBuilder } from '../src/lib/ai-image-generator/images/ImagePromptBuilder';
import { ImagePromptValidator } from '../src/lib/ai-image-generator/images/ImagePromptValidator';
import { CanonicalImageService } from '../src/lib/ai-image-generator/images/CanonicalImageService';
import { ImageRecreationRequest } from '../src/lib/ai-image-generator/images/image.types';

async function testImageRelevanceAndPipeline() {
  console.log('🧪 Starting Post-to-Image Relevance & Canonical Pipeline E2E Tests...\n');

  // Manual Acceptance Scenario Post Content
  const testPostTitle = 'Five Essential Pillars for Building a Sustainable Startup';
  const testPostContent =
    'A sustainable startup requires product-market fit, disciplined financial management, operational resilience, continuous customer feedback, and scalable go-to-market mechanics.';

  const request: ImageRecreationRequest = {
    operation: 'generate',
    postId: 'post_startup_101',
    postTopic: testPostTitle,
    postTitle: testPostTitle,
    postContent: testPostContent,
    platform: 'LinkedIn',
    aspectRatio: '1:1',
    visualStyle: 'colourful-professional',
  };

  // Stage 1: Post Meaning & Visual Brief Extraction
  console.log('🔹 Stage 1: Extracting PostVisualBrief from finished post content...');
  const brief = PostVisualBriefExtractor.extract(request);
  console.log('  Primary Topic:', brief.primaryTopic);
  console.log('  Main Subject:', brief.mainSubject);
  console.log('  Concrete Scene:', brief.actionOrSituation);
  console.log('  Key Concepts:', brief.keyConcepts.join(', '));

  if (!brief.actionOrSituation.includes('startup leadership team') || !brief.actionOrSituation.includes('strategy table')) {
    throw new Error('Stage 1 Failed: Visual brief did not extract concrete startup strategy scene.');
  }
  console.log('  ✅ Stage 1 PASS: Concrete visual brief successfully extracted.\n');

  // Stage 2: Prompt Construction from Visual Brief
  console.log('🔹 Stage 2: Constructing structured provider prompt...');
  const prompt = ImagePromptBuilder.buildPromptFromBrief(brief);
  console.log('  Sanitized Provider Prompt:\n', prompt, '\n');

  if (prompt.includes('Create an image for this post') || prompt.includes('generic business image')) {
    throw new Error('Stage 2 Failed: Constructed prompt contains generic phrases.');
  }
  console.log('  ✅ Stage 2 PASS: Non-generic concrete provider prompt assembled.\n');

  // Stage 3: Prompt Relevance & Specificity Validation
  console.log('🔹 Stage 3: Running ImagePromptValidator relevance checks...');
  const validation = ImagePromptValidator.validate(prompt, brief);
  console.log('  Validation Result:', {
    valid: validation.valid,
    relevanceScore: validation.relevanceScore,
    specificityScore: validation.specificityScore,
    platformScore: validation.platformScore,
    brandScore: validation.brandScore,
  });

  if (!validation.valid || validation.relevanceScore < 80) {
    throw new Error(`Stage 3 Failed: Prompt validation failed (score ${validation.relevanceScore}/100).`);
  }

  // Reject generic prompt test
  const genericTest = ImagePromptValidator.validate('Create a professional social media image for this post.', brief);
  console.log('  Generic Prompt Rejection Check:', { valid: genericTest.valid, relevanceScore: genericTest.relevanceScore });
  if (genericTest.valid) {
    throw new Error('Stage 3 Failed: Generic prompt was improperly accepted.');
  }
  console.log('  ✅ Stage 3 PASS: Relevance validation & generic rejection verified.\n');

  // Stage 4: Canonical Image Service E2E Pipeline Execution
  console.log('🔹 Stage 4: Executing CanonicalImageService pipeline...');
  const contract = await CanonicalImageService.generateImageForPost(request, 'test-user-001');

  console.log('  Canonical Service Result:', {
    imageStatus: contract.imageStatus,
    imageSource: contract.imageSource,
    versionId: contract.versionId,
    storagePath: contract.storagePath,
    imageUrl: contract.imageUrl?.slice(0, 90) + '...',
  });

  if (contract.imageStatus === 'failed' || !contract.imageUrl) {
    throw new Error(`Stage 4 Failed: Canonical image service failed: ${contract.imageError}`);
  }

  console.log('  ✅ Stage 4 PASS: Image generated, stored, and versioned successfully.\n');
  console.log('🎉 ALL POST-TO-IMAGE RELEVANCE E2E VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

testImageRelevanceAndPipeline().catch((err) => {
  console.error('❌ Relevance Test Error:', err);
  process.exit(1);
});
