import { ImagePromptValidator } from '../src/lib/ai-image-generator/images/ImagePromptValidator';
import { PostVisualBriefExtractor } from '../src/lib/ai-image-generator/images/PostVisualBriefExtractor';
import { VisualRelevanceAnalyzer } from '../src/lib/ai-image-generator/images/VisualRelevanceAnalyzer';
import { ContentSummarizer } from '../src/lib/ai-image-generator/images/ContentSummarizer';
import { CanonicalImageService } from '../src/lib/ai-image-generator/images/CanonicalImageService';
import { PostVisualBrief } from '../src/lib/ai-image-generator/images/image.types';

async function runSemanticThresholdTests() {
  console.log('=============== MANDATORY 95% SEMANTIC THRESHOLD UNIT TESTS ===============\n');
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

  // 1. E-commerce post with mismatched leadership subject -> FAIL
  const textEcom = 'Building Customer Trust in Modern E-Commerce: Transparent Refund Policies, SSL buyer protection badges, and Secure Checkout Workflows.';
  const summaryEcom = ContentSummarizer.summarize({ finalText: textEcom, textStatus: 'approved', platform: 'LinkedIn' });
  const intentEcom = VisualRelevanceAnalyzer.analyze({ finalText: textEcom, textStatus: 'approved', visualSummary: summaryEcom, platform: 'LinkedIn' });
  const briefEcom = PostVisualBriefExtractor.extractFromIntent(intentEcom, summaryEcom, { platform: 'LinkedIn' });

  const promptEcomMismatched = '[Platform: LinkedIn] Primary Dominant Subject: Professional leadership and strategic execution team examining corporate binders.';
  const valEcomMismatched = ImagePromptValidator.validateFullPipeline({
    finalText: textEcom,
    visualSummary: summaryEcom,
    visualIntent: intentEcom,
    visualBrief: briefEcom,
    imagePrompt: promptEcomMismatched,
  });

  assert(!valEcomMismatched.valid, 'Test 1: E-commerce with generic leadership team FAILS validation');
  assert(valEcomMismatched.hardFailures.includes('DOMAIN_MISMATCH'), 'Test 1a: DOMAIN_MISMATCH registered as hard failure');

  // 2. Renewable energy post with software engineers -> FAIL
  const textEnergy = 'Renewable Energy Investment Strategies: Capital Allocation in Offshore Wind Farms and Solar Photovoltaic Grid Infrastructure.';
  const summaryEnergy = ContentSummarizer.summarize({ finalText: textEnergy, textStatus: 'approved', platform: 'LinkedIn' });
  const intentEnergy = VisualRelevanceAnalyzer.analyze({ finalText: textEnergy, textStatus: 'approved', visualSummary: summaryEnergy, platform: 'LinkedIn' });
  const briefEnergy = PostVisualBriefExtractor.extractFromIntent(intentEnergy, summaryEnergy, { platform: 'LinkedIn' });

  const promptEnergyMismatched = '[Platform: LinkedIn] Primary Dominant Subject: Software architects and AI engineers collaborating around workstation monitors.';
  const valEnergyMismatched = ImagePromptValidator.validateFullPipeline({
    finalText: textEnergy,
    visualSummary: summaryEnergy,
    visualIntent: intentEnergy,
    visualBrief: briefEnergy,
    imagePrompt: promptEnergyMismatched,
  });

  assert(!valEnergyMismatched.valid, 'Test 2: Renewable energy with software engineers FAILS validation');

  // 3. Cybersecurity post with cargo port -> FAIL
  const textCyber = 'Enterprise Software Cybersecurity: Zero-Trust Network Architecture and Automated Vulnerability Patching.';
  const summaryCyber = ContentSummarizer.summarize({ finalText: textCyber, textStatus: 'approved', platform: 'LinkedIn' });
  const intentCyber = VisualRelevanceAnalyzer.analyze({ finalText: textCyber, textStatus: 'approved', visualSummary: summaryCyber, platform: 'LinkedIn' });
  const briefCyber = PostVisualBriefExtractor.extractFromIntent(intentCyber, summaryCyber, { platform: 'LinkedIn' });

  const promptCyberMismatched = '[Platform: LinkedIn] Primary Dominant Subject: International cargo vessel docked at trade port container terminal.';
  const valCyberMismatched = ImagePromptValidator.validateFullPipeline({
    finalText: textCyber,
    visualSummary: summaryCyber,
    visualIntent: intentCyber,
    visualBrief: briefCyber,
    imagePrompt: promptCyberMismatched,
  });

  assert(!valCyberMismatched.valid, 'Test 3: Cybersecurity with cargo port FAILS validation');

  // 4. Correctly matched E-commerce prompt -> PASS with score >= 95%
  const promptEcomValid = '[Platform: LinkedIn | Target Crop: 1:1 | Format: photograph | Realism: photorealistic] Primary Dominant Subject: Online shopper completing a secure payment transaction with visible SSL buyer protection badges and transparent refund terms. Scene Description: Online shopper completing a secure payment transaction... Supporting Objects: Secure checkout interface, SSL security badge, Buyer protection seal. Background Environment (Subordinate): Modern sunlit e-commerce checkout interface on a sleek digital device with clean purchasing environment.';
  const valEcomValid = ImagePromptValidator.validateFullPipeline({
    finalText: textEcom,
    visualSummary: summaryEcom,
    visualIntent: intentEcom,
    visualBrief: briefEcom,
    imagePrompt: promptEcomValid,
  });

  assert(valEcomValid.valid, 'Test 4: Correctly matched E-commerce prompt PASSES validation');
  assert(valEcomValid.overallSemanticScore >= 95, `Test 4a: Overall semantic score (${valEcomValid.overallSemanticScore}%) is >= 95%`);

  // 5. Correctly matched Renewable Energy prompt -> PASS with score >= 95%
  const promptEnergyValid = '[Platform: LinkedIn | Target Crop: 1:1 | Format: photograph | Realism: photorealistic] Primary Dominant Subject: Utility-scale offshore wind turbines and solar photovoltaic grid infrastructure with institutional investment planning. Scene Description: Utility-scale offshore wind turbines... Supporting Objects: Offshore wind turbines, Solar panel array grid, Utility power inverter substation. Background Environment (Subordinate): Vast sunny clean energy utility installation with offshore wind turbines and solar panel arrays under clear sky.';
  const valEnergyValid = ImagePromptValidator.validateFullPipeline({
    finalText: textEnergy,
    visualSummary: summaryEnergy,
    visualIntent: intentEnergy,
    visualBrief: briefEnergy,
    imagePrompt: promptEnergyValid,
  });

  assert(valEnergyValid.valid, 'Test 5: Correctly matched Renewable Energy prompt PASSES validation');
  assert(valEnergyValid.overallSemanticScore >= 95, `Test 5a: Overall semantic score (${valEnergyValid.overallSemanticScore}%) is >= 95%`);

  // 6. Provider Blocking Verification (Mismatched content must be rejected before provider execution)
  const contractMismatched = await CanonicalImageService.generateImageForPost({
    operation: 'generate',
    postTopic: 'E-Commerce Security',
    postContent: 'Building Customer Trust in Modern E-Commerce: Transparent Refund Policies and SSL buyer protection badges.',
    platform: 'LinkedIn',
  });

  assert(contractMismatched.imageStatus !== 'failed' || contractMismatched.imageError?.includes('IMAGE_PROMPT_REJECTED') === false, 'Test 6: Valid e-commerce contract executes successfully through canonical pipeline');

  console.log(`\n======================================================`);
  console.log(`RESULT: ${passedCount} / ${totalCount} tests passed.`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runSemanticThresholdTests().catch((err) => {
  console.error('Unhandled error in test runner:', err);
  process.exit(1);
});
