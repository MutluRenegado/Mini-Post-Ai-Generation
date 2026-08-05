import fs from 'fs';
import path from 'path';
import http from 'http';

async function auditFaviconSystem() {
  console.log('================================================================');
  console.log(' 🚀 FAVICON SYSTEM AUDIT & PRODUCTION VERIFICATION');
  console.log('================================================================\n');

  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  const appDir = path.join(rootDir, 'src', 'app');

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

  // 1. Verify App Router Usage
  const hasAppRouter = fs.existsSync(appDir) && fs.existsSync(path.join(appDir, 'layout.tsx'));
  const hasPagesRouter = fs.existsSync(path.join(rootDir, 'pages'));
  assert(hasAppRouter && !hasPagesRouter, '1. Router Audit: Project exclusively uses Next.js 16 App Router (src/app)');

  // 2. Verify Asset Existence in public/
  const requiredPublicAssets = [
    { file: 'favicon.ico', minSize: 1000, mime: 'image/x-icon' },
    { file: 'favicon-16x16.png', minSize: 500, mime: 'image/png' },
    { file: 'favicon-32x32.png', minSize: 1000, mime: 'image/png' },
    { file: 'apple-touch-icon.png', minSize: 5000, mime: 'image/png' },
    { file: 'android-chrome-192x192.png', minSize: 10000, mime: 'image/png' },
    { file: 'android-chrome-512x512.png', minSize: 50000, mime: 'image/png' },
    { file: 'site.webmanifest', minSize: 100, mime: 'application/manifest+json' },
  ];

  for (const asset of requiredPublicAssets) {
    const filePath = path.join(publicDir, asset.file);
    const exists = fs.existsSync(filePath);
    let validSize = false;
    let sizeBytes = 0;
    if (exists) {
      const stats = fs.statSync(filePath);
      sizeBytes = stats.size;
      validSize = sizeBytes >= asset.minSize;
    }
    assert(
      exists && validSize,
      `2. Public Asset Verification: public/${asset.file} (${sizeBytes} bytes, expected >= ${asset.minSize} bytes)`
    );
  }

  // 3. Verify App Router Conventions in src/app
  const appFavicon = fs.existsSync(path.join(appDir, 'favicon.ico'));
  const appAppleIcon = fs.existsSync(path.join(appDir, 'apple-icon.png'));
  const appIcon = fs.existsSync(path.join(appDir, 'icon.png'));

  assert(appFavicon, '3. App Router Convention: src/app/favicon.ico exists for automatic static serving');
  assert(appAppleIcon, '3a. App Router Convention: src/app/apple-icon.png exists for Apple touch icon fallback');
  assert(appIcon, '3b. App Router Convention: src/app/icon.png exists for default icon fallback');

  // 4. Verify site.webmanifest Content & Validity
  const manifestPath = path.join(publicDir, 'site.webmanifest');
  let manifestValid = false;
  let manifestData: any = null;
  try {
    const manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
    manifestData = JSON.parse(manifestRaw);
    manifestValid =
      manifestData.name === 'Mini Post App' &&
      manifestData.short_name === 'MiniPost' &&
      Array.isArray(manifestData.icons) &&
      manifestData.icons.length >= 2 &&
      manifestData.theme_color === '#05070c';
  } catch (e) {
    manifestValid = false;
  }
  assert(manifestValid, '4. Web Manifest Audit: valid JSON, correct app name "Mini Post App", theme color #05070c');

  // 5. Verify Metadata API in layout.tsx & Absence of Duplicate / Invalid Rel tags
  const layoutPath = path.join(appDir, 'layout.tsx');
  const layoutCode = fs.readFileSync(layoutPath, 'utf-8');
  const metadataValid =
    layoutCode.includes('export const metadata: Metadata') &&
    layoutCode.includes('/favicon.ico') &&
    layoutCode.includes('/apple-touch-icon.png') &&
    layoutCode.includes('/site.webmanifest') &&
    !layoutCode.includes("'use client'");

  const noInvalidRelTags =
    !layoutCode.includes('android-chrome-192x192') &&
    !layoutCode.includes('android-chrome-512x512') &&
    !layoutCode.includes('<link rel="icon"') &&
    !layoutCode.includes('<link rel="apple-touch-icon"');

  assert(metadataValid, '5. Metadata API Verification: src/app/layout.tsx is a Server Component exporting official Metadata');
  assert(noInvalidRelTags, '5a. Clean Metadata Verification: No invalid custom rel attributes and no manual <head><link> JSX tags');

  // 6. Local HTTP Server GET Requests Simulation
  console.log('\n--- LOCAL HTTP GET ENDPOINT VERIFICATION ---');
  const server = http.createServer((req, res) => {
    const reqPath = req.url || '';
    const cleanPath = reqPath.split('?')[0].replace(/^\//, '');
    const targetFile = path.join(publicDir, cleanPath);

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
      const ext = path.extname(targetFile).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.ico') contentType = 'image/x-icon';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webmanifest' || ext === '.json') contentType = 'application/manifest+json';

      const fileBuffer = fs.readFileSync(targetFile);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length,
      });
      res.end(fileBuffer);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  for (const asset of requiredPublicAssets) {
    const url = `${baseUrl}/${asset.file}`;
    const httpRes = await new Promise<{ status: number; contentType: string; size: number }>((resolve) => {
      http.get(url, (res) => {
        let size = 0;
        res.on('data', (chunk) => {
          size += chunk.length;
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode || 500,
            contentType: res.headers['content-type'] || '',
            size,
          });
        });
      });
    });

    const is200 = httpRes.status === 200;
    const isCorrectType = httpRes.contentType === asset.mime;
    const isCorrectSize = httpRes.size >= asset.minSize;

    assert(
      is200 && isCorrectType && isCorrectSize,
      `HTTP GET /${asset.file} -> Status: ${httpRes.status}, Content-Type: ${httpRes.contentType}, Size: ${httpRes.size} bytes (Valid: ${is200 && isCorrectType && isCorrectSize})`
    );
  }

  server.close();

  console.log(`\n======================================================`);
  console.log(`RESULT: ${passedCount} / ${totalCount} favicon audit checks passed.`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

auditFaviconSystem().catch((err) => {
  console.error('Unhandled error in favicon audit runner:', err);
  process.exit(1);
});
