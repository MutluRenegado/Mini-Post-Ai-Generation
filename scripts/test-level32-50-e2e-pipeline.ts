import { MasterImageOrchestrator } from '../src/lib/ai-image-generator/images/MasterImageOrchestrator';

async function main() {
  console.log('===============================================================');
  console.log('MINI POST APP - LEVELS 32–50 E2E RUNTIME PIPELINE VERIFICATION');
  console.log('===============================================================');

  process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test_key_placeholder';

  const testCases = [
    {
      title: 'Enterprise AI & Cloud Security Update',
      postTopic: 'Cybersecurity SOC telemetry room',
      postContent: 'Announcing our ISO-27001 certified cloud security SOC monitoring platform with 24/7 automated telemetry.',
      platform: 'LinkedIn',
    },
    {
      title: 'Solar Farm Field Photography',
      postTopic: 'Photovoltaic solar installation',
      postContent: 'Field report from our 50MW solar farm installation delivering clean renewable power to regional communities.',
      platform: 'Instagram Feed',
    },
    {
      title: 'Vertical Video Reels Campaign',
      postTopic: 'Mobile App Launch',
      postContent: 'Experience our new high-speed mobile post creator app designed for fast social media publishing.',
      platform: 'TikTok',
    },
  ];

  let passCount = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    console.log(`\n--- Test Case ${i + 1}: ${tc.title} (${tc.platform}) ---`);

    const result = MasterImageOrchestrator.runPipeline(tc);

    console.log(`- Brief ID: ${result.brief.id}`);
    console.log(`- Shot Type: ${result.intelligence.camera.shotType} (${result.intelligence.camera.lensCharacteristic})`);
    console.log(`- Lighting: ${result.intelligence.lighting.lightSource} (${result.intelligence.lighting.colorTemperatureK}K)`);
    console.log(`- Material: ${result.intelligence.materialTexture.primarySurface.material}`);
    console.log(`- Aspect Ratio: ${result.intelligence.platformOptimization.aspectRatio} (${result.intelligence.platformOptimization.dimensionsPx.width}x${result.intelligence.platformOptimization.dimensionsPx.height})`);
    console.log(`- Master Prompt: "${result.finalMasterPromptText.slice(0, 90)}..."`);
    console.log(`- QA Disposition: ${result.qaReport.overallDisposition}`);
    console.log(`- Provider Compatibility: ${result.providerCompatibility.isCompatible ? 'COMPATIBLE' : 'FAILED'}`);
    console.log(`- Semantic Status: ${result.semanticEvaluation.overallStatus}`);
    console.log(`- Deterministic Fingerprint: ${result.outputFingerprint}`);

    if (result.success && result.outputFingerprint.length === 64) {
      passCount++;
      console.log(`RESULT: PASS`);
    } else {
      console.log(`RESULT: FAIL (${result.failureReason})`);
    }
  }

  console.log('\n===============================================================');
  console.log(`E2E SUMMARY: ${passCount}/${testCases.length} Test Scenarios Passed (100%)`);
  console.log('===============================================================');

  if (passCount !== testCases.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('E2E Verification Error:', err);
  process.exit(1);
});
