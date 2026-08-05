import { initializeApp, getApps, cert, getApp, applicationDefault } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'echosofwandering';
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'echosofwandering.firebasestorage.app';

function getAdminCredential() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    return cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    });
  }

  // Parse raw JSON service account from .env.local if present
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const saJson = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
        if (saJson.client_email && saJson.private_key) {
          return cert({
            projectId: saJson.project_id || projectId,
            clientEmail: saJson.client_email,
            privateKey: saJson.private_key.replace(/\\n/g, '\n'),
          });
        }
      }
    }
  } catch (err) {
    console.warn('[firebaseAdmin] Service account parse warning:', err);
  }

  return applicationDefault();
}

function getAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const credential = getAdminCredential();
  return initializeApp({
    credential,
    projectId,
    storageBucket,
  });
}

const adminApp = getAdminApp();
export const adminStorage = getStorage(adminApp);
export { storageBucket, projectId };

/**
 * Uploads an image Buffer to Firebase Storage server-side and returns a stable public HTTPS URL.
 */
export async function uploadBufferToFirebaseStorage(
  buffer: Buffer,
  filePath: string,
  contentType: string = 'image/png'
): Promise<{ downloadUrl: string; storagePath: string }> {
  try {
    const bucket = adminStorage.bucket(storageBucket);
    const file = bucket.file(filePath);
    const downloadToken = crypto.randomUUID();

    await file.save(buffer, {
      contentType,
      resumable: false,
      metadata: {
        contentType,
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });

    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(filePath)}?alt=media&token=${downloadToken}`;
    return { downloadUrl, storagePath: filePath };
  } catch (err: any) {
    if (err?.message?.includes('Could not load the default credentials') || err?.message?.includes('default credentials')) {
      throw new Error('LOCAL_FIREBASE_ADMIN_CREDENTIALS_MISSING: Application Default Credentials not found. Please run "gcloud auth application-default login" to set up local credentials.');
    }
    throw err;
  }
}

