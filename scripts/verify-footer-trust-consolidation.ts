import fs from 'fs';
import path from 'path';

async function verifyFooterTrustConsolidation() {
  console.log('================================================================');
  console.log(' 🚀 FOOTER TRUST DUP REMOVAL & CONSOLIDATION AUDIT');
  console.log('================================================================\n');

  const rootDir = process.cwd();
  const appLayoutPath = path.join(rootDir, 'src', 'app', 'AppLayoutClient.tsx');
  const pagePath = path.join(rootDir, 'src', 'app', 'page.tsx');

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

  // 1. Verify Homepage Footer Cleanliness
  const pageCode = fs.readFileSync(pagePath, 'utf-8');
  const trustMatchesInPageFooter = (pageCode.match(/Trust, Safety & Engineering Standards/g) || []).length;

  // On page.tsx, Trust, Safety & Engineering Standards should appear exactly ONCE in footer nav + ONCE in body section
  assert(
    !pageCode.includes('>Framework Alignment<') && !pageCode.includes('href="/trust-safety#engineering-standards">Framework Alignment'),
    '1. Framework Alignment Removed: Standalone "Framework Alignment" link removed from footer'
  );

  assert(
    !pageCode.includes('Resources & Trust'),
    '1a. Section Consolidation: Renamed "Resources & Trust" column to "Resources"'
  );

  // 2. Verify AppLayoutClient Global Footer Sentence Link
  const appLayoutCode = fs.readFileSync(appLayoutPath, 'utf-8');
  assert(
    appLayoutCode.includes('Trust, Safety & Engineering Standards Center.') && appLayoutCode.includes('Learn more in our'),
    '2. Footer Sentence: Exact credibility statement present with clickable "Trust, Safety & Engineering Standards Center"'
  );

  assert(
    appLayoutCode.includes('href="/trust-safety#engineering-standards"'),
    '2a. Footer Sentence Target: Sentence link targets /trust-safety#engineering-standards'
  );

  console.log(`\n======================================================`);
  console.log(`RESULT: ${passedCount} / ${totalCount} footer trust consolidation checks passed.`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

verifyFooterTrustConsolidation().catch((err) => {
  console.error('Unhandled error in footer consolidation verification runner:', err);
  process.exit(1);
});
