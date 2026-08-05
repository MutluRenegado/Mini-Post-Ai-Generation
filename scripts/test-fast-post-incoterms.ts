import fs from 'fs';
import path from 'path';

// Manually load .env.local for standalone test runner
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

import { generateMultiPlatformPostsAction } from '../src/modules/ai/actions/generate-post.action';
import { GeminiProvider } from '../src/lib/ai-text-editor/providers/GeminiProvider';
import { GEMINI_TEXT_MODEL } from '../src/lib/gemini';

async function testFastPostIncoterms() {
  console.log(`[TEST] Configured model: ${GEMINI_TEXT_MODEL}`);

  // Test 1: Direct GeminiProvider call
  const provider = new GeminiProvider();
  console.log('[TEST] Executing GeminiProvider request with topic: "How important are Incoterms in international trade?"...');

  const providerRes = await provider.generate(
    'Write a short strategic breakdown: How important are Incoterms in international trade?'
  );

  console.log(`[TEST] Provider model used: ${providerRes.model}`);
  console.log(`[TEST] Provider response length: ${providerRes.text.length} chars`);
  console.log(`[TEST] Preview: ${providerRes.text.slice(0, 150)}...`);

  if (!providerRes.text || providerRes.text.length < 50) {
    throw new Error('GeminiProvider returned empty or truncated response.');
  }

  // Test 2: Multi-Platform Action call
  console.log('[TEST] Executing generateMultiPlatformPostsAction server action...');
  const actionRes = await generateMultiPlatformPostsAction(
    'How important are Incoterms in international trade?',
    'test-user',
    'pro'
  );

  if (!actionRes.success || !actionRes.data) {
    throw new Error(`Action failed: ${actionRes.error}`);
  }

  console.log('[TEST] Action returned platform adaptations successfully!');
  console.log(`  └─ Master Post Preview: ${actionRes.data.master_post?.slice(0, 120)}...`);
  console.log(`  └─ LinkedIn Preview: ${actionRes.data.linkedin?.slice(0, 120)}...`);
  console.log(`  └─ Twitter Preview: ${actionRes.data.twitter?.slice(0, 120)}...`);

  console.log('====================================================');
  console.log('  TEST SUCCESS: Real AI content returned cleanly!');
  console.log('====================================================');
}

testFastPostIncoterms().catch((err) => {
  console.error('[TEST ERROR]', err);
  process.exit(1);
});
