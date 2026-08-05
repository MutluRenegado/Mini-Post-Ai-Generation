const fs = require('fs');
const path = require('path');

const filesToMove = [
  'careers/page.tsx',
  'company/page.tsx',
  'cookie-policy/page.tsx',
  'data-processing-agreement/page.tsx',
  'disclaimer/page.tsx',
  'gdpr/page.tsx',
  'gdpr-request/page.tsx',
  'help/page.tsx',
  'legal/page.tsx',
  'legal/cookie-policy/page.tsx',
  'legal/disclaimer/page.tsx',
  'legal/dpa/page.tsx',
  'legal/gdpr/page.tsx',
  'legal/privacy/page.tsx',
  'legal/privacy-policy/page.tsx',
  'legal/security/page.tsx',
  'legal/subprocessors/page.tsx',
  'legal/terms/page.tsx',
  'legal/terms-of-service/page.tsx',
  'press/page.tsx',
  'privacy/page.tsx',
  'privacy-policy/page.tsx',
  'security/page.tsx',
  'subprocessors/page.tsx',
  'terms/page.tsx',
  'terms-of-service/page.tsx',
  'trust-center/page.tsx',
  'trust-safety/page.tsx',
  'values/page.tsx',
];

const srcDir = path.join(__dirname, '..', 'src', 'app');
const targetDir = path.join(__dirname, '..', 'src', 'deprecated', 'app');

filesToMove.forEach((relPath) => {
  const srcFile = path.join(srcDir, relPath);
  const destFile = path.join(targetDir, relPath);

  if (fs.existsSync(srcFile)) {
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.copyFileSync(srcFile, destFile);
    fs.unlinkSync(srcFile);
    console.log('Moved successfully:', relPath);

    // Clean empty parent folder if empty
    const parentDir = path.dirname(srcFile);
    if (fs.existsSync(parentDir) && fs.readdirSync(parentDir).length === 0) {
      fs.rmdirSync(parentDir);
    }
  } else {
    console.log('File does not exist or already moved:', relPath);
  }
});
