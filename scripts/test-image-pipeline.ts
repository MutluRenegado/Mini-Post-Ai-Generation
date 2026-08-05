import fs from 'fs';
import path from 'path';

// Load .env.local for environment
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

import { ImageGenerationProvider } from '../src/lib/ai-image-generator/images/ImageGenerationProvider';
import { ImageResponseNormalizer } from '../src/lib/ai-image-generator/images/ImageResponseNormalizer';
import { ImageStorageService } from '../src/lib/ai-image-generator/images/ImageStorageService';

async function testImagePipeline() {
  console.log('====================================================');
  console.log('  STARTING FIREBASE STORAGE IMAGE PIPELINE AUDIT');
  console.log('====================================================');

  const prompt = 'Photorealistic executive studio visual for AI E-Commerce Automation';
  console.log(`[STAGE 1] Requesting Image Generation for prompt: "${prompt}"...`);

  const rawImage = await ImageGenerationProvider.generateImage(prompt, { width: 800, height: 600 });
  console.log('[STAGE 2] Raw Image Provider Response Received!');
  console.log(`  └─ Base64 Payload Length: ${rawImage.base64?.length || 0} chars`);
  console.log(`  └─ Inline MimeType: ${rawImage.inlineData?.mimeType}`);

  console.log('[STAGE 3] Normalizing Provider Response via ImageResponseNormalizer...');
  const normalized = ImageResponseNormalizer.normalize(rawImage, prompt);
  console.log(`  └─ Image Status: ${normalized.imageStatus}`);
  console.log(`  └─ Image MimeType: ${normalized.imageMimeType}`);
  console.log(`  └─ Image Source: ${normalized.imageSource}`);

  if (normalized.imageStatus !== 'generated' || !normalized.imageUrl) {
    throw new Error(`Normalization failed: ${normalized.imageError}`);
  }

  console.log('[STAGE 4] Storing Image into Firebase Storage via ImageStorageService...');
  const stored = await ImageStorageService.storeImage(normalized, 'test-firebase-user');
  console.log(`  └─ Stored Image Status: ${stored.imageStatus}`);
  console.log(`  └─ Image Source: ${stored.imageSource}`);
  console.log(`  └─ Storage Path: ${stored.storagePath}`);
  console.log(`  └─ Stable Firebase HTTPS Image URL: ${stored.imageUrl}`);

  if (stored.imageStatus !== 'stored' || !stored.imageUrl || !stored.imageUrl.startsWith('https://firebasestorage.googleapis.com/')) {
    throw new Error(`Firebase Storage upload verification failed: ${stored.imageError || stored.imageUrl}`);
  }

  console.log('====================================================');
  console.log('  FIREBASE STORAGE IMAGE UPLOAD VERIFIED SUCCESSFULLY!');
  console.log('====================================================');
}

testImagePipeline().catch((err) => {
  console.error('[IMAGE PIPELINE TEST ERROR]', err);
  process.exit(1);
});
