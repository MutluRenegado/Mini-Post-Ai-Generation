import { ContentSummarizer } from '../src/lib/ai-image-generator/images/ContentSummarizer';
import { VisualRelevanceAnalyzer } from '../src/lib/ai-image-generator/images/VisualRelevanceAnalyzer';
import { PostVisualBriefExtractor } from '../src/lib/ai-image-generator/images/PostVisualBriefExtractor';
import { ImagePromptBuilder } from '../src/lib/ai-image-generator/images/ImagePromptBuilder';
import { ImagePromptValidator } from '../src/lib/ai-image-generator/images/ImagePromptValidator';
import { CanonicalImageService } from '../src/lib/ai-image-generator/images/CanonicalImageService';

async function runVisualRelevanceTests() {
  console.log('=============== REFACORED VISUAL RELEVANCE ANALYZER TEST SUITE ===============\n');
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

  // 1. E-commerce content produces e-commerce visual intent
  const textEcom = 'Building Customer Trust in Modern E-Commerce: Transparent Refund Policies, SSL buyer protection badges, and Secure Checkout Workflows for online shoppers.';
  const summaryEcom = ContentSummarizer.summarize({ finalText: textEcom, textStatus: 'approved', platform: 'LinkedIn' });
  const intentEcom = VisualRelevanceAnalyzer.analyze({ finalText: textEcom, textStatus: 'approved', visualSummary: summaryEcom, platform: 'LinkedIn' });

  assert(intentEcom.detectedDomain === 'e-commerce', 'Test 1: E-commerce text detected as e-commerce domain');
  assert(intentEcom.primarySubject.toLowerCase().includes('shopper') || intentEcom.primarySubject.toLowerCase().includes('checkout') || intentEcom.primarySubject.toLowerCase().includes('payment'), 'Test 1a: E-commerce primary subject relates to checkout/shopper');

  // 2. Renewable-energy content produces renewable-energy visual intent
  const textEnergy = 'Renewable Energy Investment Strategies: Capital Allocation in Offshore Wind Farms and Solar Photovoltaic Grid Infrastructure with long-term utility yield guarantees.';
  const summaryEnergy = ContentSummarizer.summarize({ finalText: textEnergy, textStatus: 'approved', platform: 'LinkedIn' });
  const intentEnergy = VisualRelevanceAnalyzer.analyze({ finalText: textEnergy, textStatus: 'approved', visualSummary: summaryEnergy, platform: 'LinkedIn' });

  assert(intentEnergy.detectedDomain === 'renewable-energy', 'Test 2: Renewable energy text detected as renewable-energy domain');
  assert(intentEnergy.primarySubject.toLowerCase().includes('wind') || intentEnergy.primarySubject.toLowerCase().includes('solar'), 'Test 2a: Renewable energy primary subject includes wind or solar');

  // 3. Renewable-energy content CANNOT produce software engineers
  assert(!intentEnergy.primarySubject.toLowerCase().includes('software architect'), 'Test 3: Renewable energy does NOT produce software architects');

  // 4. E-commerce trust content CANNOT produce generic leadership team
  assert(!intentEcom.primarySubject.toLowerCase().includes('leadership and strategic execution team'), 'Test 4: E-commerce trust does NOT produce generic leadership team');

  // 5. Domain mismatch causes hard validation failure
  const briefEcom = PostVisualBriefExtractor.extractFromIntent(intentEcom, summaryEcom, { platform: 'LinkedIn' });
  const promptMismatched = '[Platform: LinkedIn] Primary Dominant Subject: Professional leadership and strategic execution team reviewing corporate documents.';

  const valMismatch = ImagePromptValidator.validateFullPipeline({
    finalText: textEcom,
    visualSummary: summaryEcom,
    visualIntent: intentEcom,
    visualBrief: briefEcom,
    imagePrompt: promptMismatched,
  });

  assert(!valMismatch.valid, 'Test 5: Domain mismatch causes HARD validation failure');
  assert(valMismatch.problems.some((p) => p.includes('DOMAIN_MISMATCH') || p.includes('UNGROUNDED')), 'Test 5a: Specific DOMAIN_MISMATCH problem returned');

  // 6. Primary subjects require text provenance evidence
  assert(!!intentEnergy.groundedPrimarySubject, 'Test 6: VisualIntent contains groundedPrimarySubject');
  assert(intentEnergy.groundedPrimarySubject?.confidence! >= 0.90, 'Test 6a: Grounded primary subject has high confidence score');

  // 7. Unsupported people roles are rejected
  const textCyber = 'Enterprise Software Cybersecurity: Zero-Trust Network Architecture and Automated Vulnerability Patching across cloud microservices.';
  const summaryCyber = ContentSummarizer.summarize({ finalText: textCyber, textStatus: 'approved', platform: 'LinkedIn' });
  const intentCyber = VisualRelevanceAnalyzer.analyze({ finalText: textCyber, textStatus: 'approved', visualSummary: summaryCyber, platform: 'LinkedIn' });

  assert(!intentCyber.peopleRequired, 'Test 7: Cybersecurity technical prompt sets peopleRequired to false');

  // 8. Sequential state isolation (no state leakage between consecutive requests)
  const seqTopics = [
    { text: 'Enterprise Software Cybersecurity: Zero-Trust Network Architecture and Automated Vulnerability Patching.', domain: 'cybersecurity' },
    { text: 'Renewable Energy Investment Strategies: Capital Allocation in Offshore Wind Farms and Solar Photovoltaic Grid.', domain: 'renewable-energy' },
    { text: 'Building Customer Trust in Modern E-Commerce: Transparent Refund Policies and SSL Secure Checkout.', domain: 'e-commerce' },
    { text: 'International Trade & Incoterms Guide: Managing Cross-Border Logistics and Freight Shipping Manifests.', domain: 'international-trade' },
  ];

  let previousDomain = '';
  let isolationPassed = true;

  for (const item of seqTopics) {
    const sum = ContentSummarizer.summarize({ finalText: item.text, textStatus: 'approved', platform: 'LinkedIn' });
    const int = VisualRelevanceAnalyzer.analyze({ finalText: item.text, textStatus: 'approved', visualSummary: sum, platform: 'LinkedIn' });

    if (int.detectedDomain !== item.domain) {
      isolationPassed = false;
    }
    if (previousDomain && int.detectedDomain === previousDomain) {
      isolationPassed = false;
    }
    previousDomain = int.detectedDomain;
  }

  assert(isolationPassed, 'Test 8: Sequential requests maintain 100% clean state isolation');

  // 9. Generic fallback subjects are not used when specific content exists
  const textLeadership = 'The Architecture of Executive Vision: Cultivating Strategic Resilience, Organizational Agility, and High-Performance Team Dynamics.';
  const summaryLeadership = ContentSummarizer.summarize({ finalText: textLeadership, textStatus: 'approved', platform: 'LinkedIn' });
  const intentLeadership = VisualRelevanceAnalyzer.analyze({ finalText: textLeadership, textStatus: 'approved', visualSummary: summaryLeadership, platform: 'LinkedIn' });

  assert(intentLeadership.detectedDomain === 'leadership', 'Test 9: Executive leadership text detected as leadership domain');

  // 10. CanonicalImageService end-to-end execution with grounded VisualIntent
  const contract = await CanonicalImageService.generateImageForPost({
    operation: 'generate',
    postTopic: 'Renewable Energy Investment',
    postContent: textEnergy,
    platform: 'LinkedIn',
  });

  assert(contract.imageStatus !== 'failed', 'Test 10: CanonicalImageService succeeds for renewable energy');
  assert(contract.visualIntent?.detectedDomain === 'renewable-energy', 'Test 10a: Returned contract contains renewable-energy visual intent');

  console.log(`\n======================================================`);
  console.log(`RESULT: ${passedCount} / ${totalCount} tests passed.`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runVisualRelevanceTests().catch((err) => {
  console.error('Unhandled error in test runner:', err);
  process.exit(1);
});
