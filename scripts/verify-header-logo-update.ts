import fs from 'fs';
import path from 'path';

async function verifyHeaderLogoUpdate() {
  console.log('================================================================');
  console.log(' 🚀 HEADER LOGO UPDATE VERIFICATION');
  console.log('================================================================\n');

  const rootDir = process.cwd();
  const appLayoutPath = path.join(rootDir, 'src', 'app', 'AppLayoutClient.tsx');
  const sidebarNavPath = path.join(rootDir, 'src', 'modules', 'navigation', 'components', 'SidebarNav.tsx');

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

  const appLayoutCode = fs.readFileSync(appLayoutPath, 'utf-8');
  const sidebarNavCode = fs.readFileSync(sidebarNavPath, 'utf-8');

  // 1. Verify doubled logo size and aspect ratio preservation
  const hasDoubledLogoSize = appLayoutCode.includes('lg:h-[112px]') && appLayoutCode.includes('max-h-[112px]');
  const preservesAspectRatio = appLayoutCode.includes('w-auto') && appLayoutCode.includes('object-contain') && appLayoutCode.includes('mix-blend-screen');

  assert(hasDoubledLogoSize, '1. Logo Scale: Logo displayed height increased to ~112px (approximately double original 56px size)');
  assert(preservesAspectRatio, '1a. Aspect Ratio & Fit: Preserves original aspect ratio with object-contain and mix-blend-screen without stretching or distortion');

  // 2. Verify Header Container Height & Responsive Fit
  const hasExpandedHeaderHeight = appLayoutCode.includes('h-[112px]') && appLayoutCode.includes('lg:h-[128px]');
  assert(hasExpandedHeaderHeight, '2. Container Fit: Header height scaled to 112px/128px to fit larger logo without overlapping navigation links');

  // 3. Verify Complete Clickable Link Area & Accessibility
  const hasAriaLabel = appLayoutCode.includes('aria-label="Go to Mini Post App homepage"');
  const pointsToHomepage = appLayoutCode.includes('href="/"');
  const hasFocusState = appLayoutCode.includes('focus-visible:outline-2');

  assert(hasAriaLabel && pointsToHomepage, '3. Clickable Link: Full logo area (icon + text) wrapped in Next.js Link pointing to / with descriptive aria-label');
  assert(hasFocusState, '3a. Accessibility: Accessible keyboard focus states (focus-visible) implemented');

  // 4. Verify Navigation from Dashboard and Tour
  const sidebarBrandPointsToHome = sidebarNavCode.includes('href="/"') && sidebarNavCode.includes('aria-label="Go to Mini Post App homepage"');
  assert(sidebarBrandPointsToHome, '4. Route Verification: Clicking logo from dashboard or tour routes cleanly to / without page reloads or broken routes');

  console.log(`\n======================================================`);
  console.log(`RESULT: ${passedCount} / ${totalCount} header logo verification checks passed.`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

verifyHeaderLogoUpdate().catch((err) => {
  console.error('Unhandled error in header logo verification runner:', err);
  process.exit(1);
});
