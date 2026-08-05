import fs from 'fs';
import path from 'path';

// Load .env.local for Firebase environment credentials
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

import { PostVisualBriefExtractor } from '../src/lib/ai-image-generator/images/PostVisualBriefExtractor';
import { ImagePromptBuilder } from '../src/lib/ai-image-generator/images/ImagePromptBuilder';
import { ImagePromptValidator } from '../src/lib/ai-image-generator/images/ImagePromptValidator';
import { CanonicalImageService } from '../src/lib/ai-image-generator/images/CanonicalImageService';
import { VisualDiversityTracker } from '../src/lib/ai-image-generator/images/VisualDiversityTracker';
import { ImageRecreationRequest } from '../src/lib/ai-image-generator/images/image.types';

async function runModernVisualSystemTestSuite() {
  console.log('================================================================');
  console.log(' 🧪 RUNNING MODERN, COLOURFUL & SHAREABLE VISUAL SYSTEM TESTS');
  console.log('================================================================\n');

  let totalPassed = 0;
  let totalFailed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(` ✅ PASS: ${testName}`);
      if (detail) console.log(`    └─ ${detail}`);
      totalPassed++;
    } else {
      console.error(` ❌ FAIL: ${testName}`);
      if (detail) console.error(`    └─ ERROR: ${detail}`);
      totalFailed++;
    }
  }

  // ---------------------------------------------------------------------------
  // Test 1: Default visual style is NOT dark cinematic
  // ---------------------------------------------------------------------------
  const req1: ImageRecreationRequest = {
    operation: 'generate',
    postTopic: 'Strategic Leadership in 2026',
    platform: 'LinkedIn',
  };
  const brief1 = PostVisualBriefExtractor.extract(req1);
  assert(
    brief1.visualStyle === 'colourful-professional' || brief1.visualStyle === 'modern-editorial',
    'Test 1: Default Visual Style is Modern / Colourful (not dark cinematic)',
    `Extracted default visualStyle: "${brief1.visualStyle}"`
  );

  // ---------------------------------------------------------------------------
  // Test 2: Color direction contains vibrant accents and daylight neutrals
  // ---------------------------------------------------------------------------
  assert(
    brief1.colorDirection.toLowerCase().includes('cyan') ||
      brief1.colorDirection.toLowerCase().includes('amber') ||
      brief1.colorDirection.toLowerCase().includes('vibrant') ||
      brief1.colorDirection.toLowerCase().includes('daylight'),
    'Test 2: Color Direction contains vibrant modern palette accents',
    `Color direction: "${brief1.colorDirection}"`
  );

  // ---------------------------------------------------------------------------
  // Test 3: Main focal subject is explicit and people are present for business topics
  // ---------------------------------------------------------------------------
  assert(
    brief1.mainSubject.length > 5 && (brief1.mainSubject.includes('Leaders') || brief1.mainSubject.includes('Team')),
    'Test 3: Focal Subject is explicit and includes realistic people for business/leadership topics',
    `Main subject: "${brief1.mainSubject}"`
  );

  // ---------------------------------------------------------------------------
  // Test 4: Provider prompt contains required 16 structured elements & negative constraints
  // ---------------------------------------------------------------------------
  const prompt1 = ImagePromptBuilder.buildPromptFromBrief(brief1);
  assert(
    prompt1.includes('Negative Constraints:') &&
      prompt1.includes('no dark empty office') &&
      prompt1.includes('no meaningless computer monitors') &&
      prompt1.includes('Social Shareability:'),
    'Test 4: Provider prompt incorporates modern shareability and negative constraints',
    `Prompt snippet: ${prompt1.slice(0, 150)}...`
  );

  // ---------------------------------------------------------------------------
  // Test 5: ImagePromptValidator accepts modern high-quality prompt
  // ---------------------------------------------------------------------------
  const val1 = ImagePromptValidator.validate(prompt1, brief1);
  assert(
    val1.valid && val1.modernityScore >= 75 && val1.shareabilityScore >= 75 && val1.colourScore >= 65,
    'Test 5: Validator approves modern high-scoring prompt',
    `Relevance: ${val1.relevanceScore}, Modernity: ${val1.modernityScore}, Shareability: ${val1.shareabilityScore}, Colour: ${val1.colourScore}`
  );

  // ---------------------------------------------------------------------------
  // Test 6: ImagePromptValidator rejects dark empty office prompt
  // ---------------------------------------------------------------------------
  const darkPrompt =
    'Cinematic dark empty office with moody low-light blue control room and empty monitor wall background';
  const valDark = ImagePromptValidator.validate(darkPrompt, brief1);
  assert(
    !valDark.valid && valDark.problems.some((p) => p.includes('DARK_DEFAULT_DETECTED')),
    'Test 6: Validator rejects dark empty office prompt',
    `Problems returned: ${valDark.problems.join(' | ')}`
  );

  // ---------------------------------------------------------------------------
  // Test 7: Low-modernity prompt (<75) is rejected
  // ---------------------------------------------------------------------------
  const lowModPrompt = 'A desaturated grey corporate interior with an old stock photo feel';
  const valLowMod = ImagePromptValidator.validate(lowModPrompt, brief1);
  assert(
    !valLowMod.valid && valLowMod.modernityScore < 75,
    'Test 7: Low modernity prompt (<75) is rejected',
    `Modernity score: ${valLowMod.modernityScore}/100`
  );

  // ---------------------------------------------------------------------------
  // Test 8: Explicit user choice of 'dark-cinematic' still works when requested
  // ---------------------------------------------------------------------------
  const darkReq: ImageRecreationRequest = {
    operation: 'generate',
    postTopic: 'Cybersecurity Night Ops',
    platform: 'LinkedIn',
    visualStyle: 'dark-cinematic',
  };
  const darkBrief = PostVisualBriefExtractor.extract(darkReq);
  const darkPromptExplicit = ImagePromptBuilder.buildPromptFromBrief(darkBrief);
  const valDarkExplicit = ImagePromptValidator.validate(darkPromptExplicit, darkBrief);
  assert(
    valDarkExplicit.valid,
    'Test 8: Explicit user-requested dark-cinematic style passes validation when explicitly selected',
    `Validation status: ${valDarkExplicit.valid}`
  );

  // ---------------------------------------------------------------------------
  // Test 9: Visual Diversity Tracker varies composition across platforms
  // ---------------------------------------------------------------------------
  VisualDiversityTracker.recordGeneration({
    topic: 'International Trade',
    platform: 'LinkedIn',
    environment: 'Env A',
    cameraAngle: 'Angle A',
    composition: 'Comp A',
    paletteName: 'Cyan & Amber',
  });
  const framingDiv = VisualDiversityTracker.diversifyFraming('LinkedIn', '1:1', 'International Trade');
  assert(
    framingDiv.composition !== undefined && framingDiv.cameraAngle !== undefined,
    'Test 9: Visual Diversity Tracker provides dynamic composition variations',
    `Diversified camera angle: "${framingDiv.cameraAngle}"`
  );

  // ---------------------------------------------------------------------------
  // Test 10: Manual Acceptance Test Scenario across 4 platforms
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 10: Manual Acceptance Test Case ---');
  const acceptanceTitle =
    'Strategic Risk Management: Deciphering Payment Terms in Global Trade';
  const acceptanceContent =
    'Finance and trade leaders must analyze international payment terms, balance commercial risk and cash flow, coordinate cross-border trade transactions, and choose appropriate payment terms.';

  const platforms = ['LinkedIn', 'X', 'Facebook', 'Instagram'];
  let acceptancePassed = true;

  for (const platform of platforms) {
    const accReq: ImageRecreationRequest = {
      operation: 'generate',
      postTopic: acceptanceTitle,
      postTitle: acceptanceTitle,
      postContent: acceptanceContent,
      platform,
    };

    const accBrief = PostVisualBriefExtractor.extract(accReq);
    const accPrompt = ImagePromptBuilder.buildPromptFromBrief(accBrief);
    const accVal = ImagePromptValidator.validate(accPrompt, accBrief);

    const positivePrompt = accPrompt.toLowerCase().split('negative constraints:')[0];

    const isModernAndRelevant =
      (accBrief.mainSubject.includes('Finance') || accBrief.mainSubject.includes('Trade')) &&
      accPrompt.includes('Strategic Risk Management: Deciphering Payment Terms in Global Trade') &&
      accVal.valid &&
      accVal.topicAccuracyScore >= 80 &&
      accVal.communicationClarityScore >= 80 &&
      accVal.primarySubjectProminenceScore >= 80 &&
      !positivePrompt.includes('warehouse corridor') &&
      !positivePrompt.includes('dark empty office');

    if (!isModernAndRelevant) {
      acceptancePassed = false;
      console.error(`  ❌ Platform ${platform} failed acceptance criteria!`, {
        valid: accVal.valid,
        topicAccuracy: accVal.topicAccuracyScore,
        communicationClarity: accVal.communicationClarityScore,
        subjectProminence: accVal.primarySubjectProminenceScore,
        problems: accVal.problems,
      });
    } else {
      console.log(`  ✅ Platform ${platform}: Valid modern editorial visual brief extracted.`);
      console.log(`     └─ Communication Goal: ${accBrief.communicationGoal}`);
      console.log(`     └─ Primary Subject: ${accBrief.mainSubject}`);
      console.log(`     └─ Supporting Objects: ${accBrief.supportingSubjects.slice(0, 3).join(', ')}`);
      console.log(`     └─ Background Environment: ${accBrief.environment}`);
      console.log(`     └─ Topic Accuracy: ${accVal.topicAccuracyScore}/100, Clarity: ${accVal.communicationClarityScore}/100, Subject Prominence: ${accVal.primarySubjectProminenceScore}/100`);
    }
  }

  assert(
    acceptancePassed,
    'Test 10: Manual Acceptance Test passed across LinkedIn, X, Facebook, Instagram',
    'All 4 platforms generated distinct, semantically relevant, bright, human-inclusive visual briefs.'
  );

  // ---------------------------------------------------------------------------
  // E2E Pipeline Run
  // ---------------------------------------------------------------------------
  console.log('\n--- Stage 11: E2E Canonical Image Pipeline Test ---');
  const contract = await CanonicalImageService.generateImageForPost(
    {
      operation: 'generate',
      postTopic: acceptanceTitle,
      postContent: acceptanceContent,
      platform: 'LinkedIn',
    },
    'test-user-system-upgrade'
  );

  const isSuccess = (contract.imageStatus === 'stored' || contract.imageStatus === 'generated') && !!contract.imageUrl;
  assert(
    isSuccess,
    'Test 11: Canonical Image Service E2E Execution & Storage',
    isSuccess ? `Image URL: ${contract.imageUrl?.slice(0, 75)}...` : `Error: ${contract.imageError}`
  );

  console.log('\n================================================================');
  console.log(` RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log('================================================================\n');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runModernVisualSystemTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
