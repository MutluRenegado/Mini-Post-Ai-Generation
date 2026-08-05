import fs from 'fs';
import path from 'path';

async function verifyTrustSafetyUpdate() {
  console.log('================================================================');
  console.log(' 🚀 TRUST PAGE & ENGINEERING STANDARDS LINKING AUDIT');
  console.log('================================================================\n');

  const rootDir = process.cwd();
  const trustSafetyPath = path.join(rootDir, 'src', 'app', 'trust-safety', 'page.tsx');
  const appLayoutPath = path.join(rootDir, 'src', 'app', 'AppLayoutClient.tsx');

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

  // 1. Verify Page File Exists & Metadata Title
  const pageExists = fs.existsSync(trustSafetyPath);
  assert(pageExists, '1. Page File: Public Trust page exists at src/app/trust-safety/page.tsx');

  const pageCode = fs.readFileSync(trustSafetyPath, 'utf-8');
  assert(
    pageCode.includes('Trust, Safety & Engineering Standards | Mini Post App'),
    '1a. Metadata Title: Browser title updated to "Trust, Safety & Engineering Standards | Mini Post App"'
  );
  assert(
    pageCode.includes('id="engineering-standards"'),
    '1b. Anchor Section: Contains id="engineering-standards" anchor ID'
  );
  assert(
    pageCode.includes('scroll-mt-36'),
    '1c. Anchor Offset: Uses scroll-mt-36 so header does not obscure section heading'
  );

  // 2. Verify Public Route Layout & Global Footer Sentence
  const appLayoutCode = fs.readFileSync(appLayoutPath, 'utf-8');
  const includesTrustSafetyInPublicRoutes =
    appLayoutCode.includes("'/trust-safety'") && appLayoutCode.includes('publicRoutes');
  assert(
    includesTrustSafetyInPublicRoutes,
    '2. Public Layout: /trust-safety registered in publicRoutes array (renders Navbar + Footer, NOT SidebarNav)'
  );

  const includesFooterSentence = appLayoutCode.includes(
    'Mini Post App is built in alignment with internationally recognized engineering, accessibility, security, responsible AI, and cloud architecture frameworks.'
  );
  assert(
    includesFooterSentence,
    '2a. Footer Sentence: Global footer includes required engineering alignment sentence'
  );

  const includesFooterLink = appLayoutCode.includes('/trust-safety#engineering-standards');
  assert(
    includesFooterLink,
    '2b. Footer Link: Global footer links directly to /trust-safety#engineering-standards'
  );

  console.log(`\n======================================================`);
  console.log(`RESULT: ${passedCount} / ${totalCount} trust page update checks passed.`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

verifyTrustSafetyUpdate().catch((err) => {
  console.error('Unhandled error in trust safety verification runner:', err);
  process.exit(1);
});
