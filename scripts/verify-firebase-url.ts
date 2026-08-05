import { uploadBufferToFirebaseStorage } from '../src/lib/firebaseAdmin';

async function verifyUrl() {
  const sampleBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const path = `users/test-user/generated/verify_test_${Date.now()}.png`;

  console.log(`[VERIFY] Uploading test buffer to Firebase Storage at: ${path}...`);
  const { downloadUrl, storagePath } = await uploadBufferToFirebaseStorage(sampleBuffer, path, 'image/png');

  console.log(`[VERIFY] Upload succeeded! Storage Path: ${storagePath}`);
  console.log(`[VERIFY] Download URL: ${downloadUrl}`);

  console.log('[VERIFY] Fetching download URL via HTTP GET...');
  const res = await fetch(downloadUrl);
  console.log(`[VERIFY] HTTP Response Status: ${res.status} ${res.statusText}`);
  console.log(`[VERIFY] Content-Type: ${res.headers.get('content-type')}`);
  console.log(`[VERIFY] Content-Length: ${res.headers.get('content-length')} bytes`);

  if (res.status === 200 && res.headers.get('content-type')?.includes('image/')) {
    console.log('====================================================');
    console.log('  FIREBASE STORAGE URL HTTP 200 VERIFIED OK!');
    console.log('====================================================');
  } else {
    throw new Error(`HTTP verification failed: ${res.status}`);
  }
}

verifyUrl().catch((err) => {
  console.error(err);
  process.exit(1);
});
