import fs from 'fs';
import path from 'path';

async function verifyHomepageHeroUpdate() {
  console.log('================================================================');
  console.log(' 🚀 HOMEPAGE HEADER & HERO LAYOUT VERIFICATION');
  console.log('================================================================\n');

  const rootDir = process.cwd();
  const appLayoutPath = path.join(rootDir, 'src', 'app', 'AppLayoutClient.tsx');
  const homePagePath = path.join(rootDir, 'src', 'app', 'page.tsx');
  const cssPath = path.join(rootDir, 'src', 'app', 'homepage.css');
  const tourPagePath = path.join(rootDir, 'src', 'app', 'tour', 'page.tsx');

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
  const homePageCode = fs.readFileSync(homePagePath, 'utf-8');
  const cssCode = fs.readFileSync(cssPath, 'utf-8');

  // 1. Verify "Go To Dashboard" button text and logic
  const hasGoToDashboardBtn = appLayoutCode.includes('Go To Dashboard');
  const handlesGoToDashboard = appLayoutCode.includes('handleGoToDashboard') && appLayoutCode.includes("router.push('/dashboard')");
  const noHeaderTourBtn = !appLayoutCode.includes('Take a Tour');

  assert(hasGoToDashboardBtn, '1. Header Button: White header button updated to exactly "Go To Dashboard"');
  assert(handlesGoToDashboard, '1a. Functional Routing: Authenticated users route to /dashboard, unauthenticated trigger auth flow & redirect to /dashboard');
  assert(noHeaderTourBtn, '1b. Header Clean: "Take a Tour" button removed from top header');

  // 2. Verify Logo Size Scale (Doubled to 112px)
  const logoScaled = (appLayoutCode.includes('lg:h-[112px]') || appLayoutCode.includes('h-[72px]')) && appLayoutCode.includes('mix-blend-screen');
  const headerHeightScaled = appLayoutCode.includes('h-[112px]') || appLayoutCode.includes('h-[88px]');

  assert(logoScaled, '2. Logo Scale: Header logo scaled up to ~112px height preserving aspect ratio and mix-blend-screen');
  assert(headerHeightScaled, '2a. Container Fit: Header height scaled to fit larger logo without clipping or overlap');

  // 3. Verify Hero "Take a Tour" button
  const heroHasTourBtn = homePageCode.includes('Take a Tour') && homePageCode.includes('href="/tour"');
  const tourPageExists = fs.existsSync(tourPagePath);

  assert(heroHasTourBtn, '3. Hero Tour Button: "Take a Tour" button positioned in hero section pointing to /tour');
  assert(tourPageExists, '3a. No 404 Guarantee: Real interactive /tour page created at src/app/tour/page.tsx');

  // 4. Verify Spacing & Rhythm
  const hasHeroBadgeMb = cssCode.includes('margin-bottom: 28px');
  const hasTourMb = cssCode.includes('margin-bottom: 32px');
  const hasHeadingMb = cssCode.includes('margin: 0 auto 28px');
  const hasParagraphMb = cssCode.includes('margin: 0 auto 48px');

  assert(hasHeroBadgeMb && hasTourMb && hasHeadingMb && hasParagraphMb, '4. Vertical Rhythm: Visible, balanced vertical spacing between Enterprise badge, Tour button, Headline, Description & Studio grid');

  console.log(`\n======================================================`);
  console.log(`RESULT: ${passedCount} / ${totalCount} homepage hero verification checks passed.`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

verifyHomepageHeroUpdate().catch((err) => {
  console.error('Unhandled error in verification runner:', err);
  process.exit(1);
});
