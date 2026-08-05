import fs from 'fs';
import path from 'path';

// Load .env.local
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

import { AIContentService } from '../src/studio/ai/ai-content.service';
import { FacebookPlatformService } from '../src/studio/platforms/facebook/facebook.service';

async function testBrowserRenderingDataFlow() {
  console.log('====================================================');
  console.log('  AUDITING INSTANT POST & STUDIO BROWSER IMAGE DATA');
  console.log('====================================================');

  const topic = 'AI E-Commerce Scaling Framework 2026';
  console.log(`[TEST 1] Generating Instant Content for topic: "${topic}"...`);

  const instantResult = await AIContentService.generateInstantContent({
    rawIdea: topic,
    goal: 'Brand Awareness',
    targetAudience: 'E-Commerce Executives',
    platforms: ['LinkedIn', 'Facebook', 'Twitter (X)'],
    tone: 'Professional',
  });

  console.log(`[TEST 1 SUCCESS] Instant Content Generated (${instantResult.platformVariations.length} variations)!`);
  instantResult.platformVariations.forEach((v) => {
    console.log(`  ├─ Platform: ${v.platform}`);
    console.log(`  │   ├─ Title: ${v.title.slice(0, 50)}...`);
    console.log(`  │   ├─ Media Type: ${v.media_asset.type}`);
    console.log(`  │   └─ Image URL: ${v.media_asset.url}`);

    if (!v.media_asset.url || !v.media_asset.url.startsWith('https://firebasestorage.googleapis.com/')) {
      throw new Error(`[CRITICAL] Broken or un-normalized image URL detected for platform "${v.platform}": "${v.media_asset.url}"`);
    }
  });

  console.log(`[TEST 2] Generating Facebook Multi-Asset Bundle for topic: "${topic}"...`);
  const fbBundle = await FacebookPlatformService.generateMultiAssetBundle(topic, 'lead_gen');

  console.log(`[TEST 2 SUCCESS] Facebook Multi-Asset Bundle Generated!`);
  console.log(`  ├─ Feed Image Status: ${fbBundle.feedAsset.imageStatus}`);
  console.log(`  └─ Feed Image URL: ${fbBundle.feedAsset.imageUrl}`);

  if (!fbBundle.feedAsset.imageUrl || !fbBundle.feedAsset.imageUrl.startsWith('https://firebasestorage.googleapis.com/')) {
    throw new Error(`[CRITICAL] Facebook Feed Asset URL invalid: "${fbBundle.feedAsset.imageUrl}"`);
  }

  console.log('====================================================');
  console.log('  ALL STUDIO MEDIA ASSET URLS ARE 100% STORED FIREBASE HTTPS URLS!');
  console.log('====================================================');
}

testBrowserRenderingDataFlow().catch((err) => {
  console.error('[AUDIT TEST ERROR]', err);
  process.exit(1);
});
