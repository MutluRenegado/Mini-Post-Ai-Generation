import * as Standards from '../src/standards';
import { SEMANTIC_THRESHOLDS } from '../src/lib/ai-image-generator/images/image.types';

async function verifyStandardsSystem() {
  console.log('================================================================');
  console.log(' 🚀 INTERNATIONAL STANDARDS SYSTEM VERIFICATION');
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

  // 1. Verify Phase 1 - AI Standards & NIST AI RMF / ISO 25010 Alignment
  assert(Standards.AIWritingStandard.model === 'gemini-1.5-flash', '1. AI Writing Standard: AIWritingStandard exports gemini-1.5-flash model');
  assert(
    Standards.QualityStandard.frameworkAlignment.iso25010.functionalSuitability.length > 0,
    '1a. ISO/IEC 25010 Quality: Includes functionalSuitability alignment'
  );
  assert(
    Standards.ImageStandard.frameworkAlignment.nistAiRmf.validityThreshold.includes('95%'),
    '1b. NIST AI RMF Alignment: ImageStandard enforces 95% semantic acceptance threshold'
  );

  // 2. Verify Single Source of Truth Runtime Binding
  assert(
    SEMANTIC_THRESHOLDS.overallSemanticScore === Standards.ImageStandard.minimumOverallSemanticScore,
    '2. Single Source of Truth: SEMANTIC_THRESHOLDS in image.types.ts bound to ImageStandard.minimumOverallSemanticScore (95%)'
  );

  // 3. Verify Phase 2 - Branding & WCAG 2.2 AA Alignment
  assert(Standards.AccessibilityStandard.wcagLevel === '2.2 AA', '3. WCAG Standard: AccessibilityStandard level is 2.2 AA');
  assert(Standards.ColorStandard.frameworkAlignment.wcag22.contrastMinimum.includes('4.5:1'), '3a. WCAG Contrast: ColorStandard defines 4.5:1 text contrast minimum');
  assert(Standards.SpacingStandard.minTouchTargetPx === 24, '3b. WCAG Target Size: SpacingStandard defines 24px minimum touch target size');

  // 4. Verify Phase 3 - Platform Standards & Developer Policy Declarations
  assert(Standards.FacebookPostStandard.platformPolicy.apiEndpoint.includes('Meta Graph API'), '4. Meta Guidelines: FacebookPostStandard specifies Meta Graph API guidelines');
  assert(Standards.XPostStandard.platformPolicy.apiEndpoint.includes('X API v2'), '4a. X Guidelines: XPostStandard specifies X API v2 guidelines');

  // 5. Verify Phase 4 - Video Standards & Loudness Normalization
  assert(Standards.ShortsStandard.aspectRatio === '9:16', '5. Video Standard: ShortsStandard aspect ratio is 9:16');
  assert(Standards.VideoProductionStandard.targetLufs === -14, '5a. Audio Standard: Target LUFS is -14 Integrated LUFS');

  // 6. Verify Phase 5 - Publishing, SEO & OWASP ASVS Alignment
  assert(Standards.SEOStandard.frameworkAlignment.googleSearchEssentials.technicalCrawlability.length > 0, '6. Google Search Essentials: Technical crawlability alignment defined');
  assert(Standards.PublishingStandard.frameworkAlignment.owaspAsvs.tenantIsolation.length > 0, '6a. OWASP ASVS: Tenant isolation data protection defined');

  console.log(`\n======================================================`);
  console.log(`RESULT: ${passedCount} / ${totalCount} international standards verification checks passed.`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

verifyStandardsSystem().catch((err) => {
  console.error('Unhandled error in standards verification runner:', err);
  process.exit(1);
});
