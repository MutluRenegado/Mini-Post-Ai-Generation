import { ImagePromptBuilder } from '../src/lib/ai-image-generator/images/ImagePromptBuilder';
import { ImageGenerationProvider } from '../src/lib/ai-image-generator/images/ImageGenerationProvider';
import { ImageResponseNormalizer } from '../src/lib/ai-image-generator/images/ImageResponseNormalizer';
import { ImageRecreationRequest } from '../src/lib/ai-image-generator/images/image.types';

async function testImageRecreationPipeline() {
  console.log('🧪 Starting Image Recreation & Regeneration Pipeline Automated Tests...\n');

  // Test 1: Prompt Construction for "generate"
  const genReq: ImageRecreationRequest = {
    operation: 'generate',
    postTopic: 'Autonomous AI Coding Assistant',
    platform: 'LinkedIn',
    aspectRatio: '1:1',
    visualStyle: 'colourful-professional',
  };
  const genPrompt = ImagePromptBuilder.buildPrompt(genReq);
  console.log('✅ Test 1 (Generate Prompt):', genPrompt);
  if (!genPrompt.includes('Autonomous AI Coding Assistant') || !genPrompt.includes('1:1')) {
    throw new Error('Test 1 Failed: Generate prompt missing topic or aspect ratio.');
  }

  // Test 2: Prompt Construction for "recreate"
  const recreateReq: ImageRecreationRequest = {
    operation: 'recreate',
    postTopic: 'Autonomous AI Coding Assistant',
    originalImagePrompt: 'Cyberpunk neon studio workspace with glowing cyan holographic display',
    platform: 'Instagram Story',
    aspectRatio: '9:16',
    recreationInstructions: 'Add purple matrix rain effect in background',
  };
  const recreatePrompt = ImagePromptBuilder.buildPrompt(recreateReq);
  console.log('✅ Test 2 (Recreate Prompt):', recreatePrompt);
  if (!recreatePrompt.includes('Recreate visual based on original concept') || !recreatePrompt.includes('matrix rain')) {
    throw new Error('Test 2 Failed: Recreate prompt missing original prompt or user instructions.');
  }

  // Test 3: Dimension Mapping & Provider Execution
  const dimensions = ImageGenerationProvider.getDimensionsFromAspectRatio('9:16');
  console.log('✅ Test 3 (Aspect Ratio Dimensions 9:16):', dimensions);
  if (dimensions.width !== 1080 || dimensions.height !== 1920) {
    throw new Error('Test 3 Failed: 9:16 dimensions should be 1080x1920.');
  }

  // Test 4: Provider Response & Normalization with Versioning
  const rawProviderOutput = await ImageGenerationProvider.generateImage(recreatePrompt, {
    width: dimensions.width,
    height: dimensions.height,
    aspectRatio: '9:16',
    versionId: 'v2_test_123',
  });

  const normalizedContract = ImageResponseNormalizer.normalize(rawProviderOutput, recreatePrompt, {
    versionId: 'v2_test_123',
  });

  console.log('✅ Test 4 (Normalized Versioned Contract):', {
    imageStatus: normalizedContract.imageStatus,
    imageSource: normalizedContract.imageSource,
    versionId: normalizedContract.versionId,
    url: normalizedContract.imageUrl?.slice(0, 80) + '...',
  });

  if (normalizedContract.imageStatus !== 'generated' || normalizedContract.versionId !== 'v2_test_123') {
    throw new Error('Test 4 Failed: Normalized contract status or versionId mismatch.');
  }

  console.log('\n🎉 ALL 4 IMAGE RECREATION PIPELINE AUTOMATED TESTS PASSED SUCCESSFULLY!');
}

testImageRecreationPipeline().catch((err) => {
  console.error('❌ Pipeline Test Error:', err);
  process.exit(1);
});
