import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { READY_TEMPLATES } from '../src/modules/posts/data/templates.ts';

const projectId = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || 'echosofwandering';
const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json');

if (getApps().length === 0) {
  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    initializeApp({ credential: cert(serviceAccount), projectId });
  } else {
    initializeApp({ credential: applicationDefault(), projectId });
  }
}

const db = getFirestore();

function removeUndefined(value) {
  if (Array.isArray(value)) return value.map(removeUndefined);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, removeUndefined(item)])
    );
  }
  return value;
}

async function seedTemplateGallery() {
  const batch = db.batch();

  for (const template of READY_TEMPLATES) {
    const ref = db.collection('templateGallery').doc(`basic_${template.id}`);
    const payload = removeUndefined({
      templateId: `basic_${template.id}`,
      sourceTemplateId: template.id,
      sourceModule: 'creator-studio',
      templateName: template.title,
      templateGroup: 'basic',
      timestamp: FieldValue.serverTimestamp(),
      owner: {
        type: 'system',
        id: 'system',
        name: 'Mini Post App',
        surname: '',
      },
      platform: template.platform,
      postType: template.category,
      visibility: 'public',
      sharedWithUserIds: [],
      designSchema: {
        content: template.content,
        aestheticBadge: template.aestheticBadge,
        sampleImage: template.sampleImage,
        sampleVideo: template.sampleVideo,
        sampleData: template.sampleData,
      },
      resizeRules: null,
      mediaRequirements: {
        mediaType: template.sampleData.mediaType,
      },
      thumbnailUrl: template.sampleImage,
      isActive: true,
      version: 1,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    batch.set(ref, payload);
  }

  await batch.commit();
  console.log(`Seeded ${READY_TEMPLATES.length} Creator Studio templates into templateGallery.`);
}

seedTemplateGallery().catch((error) => {
  console.error('Failed to seed template gallery:', error);
  process.exitCode = 1;
});
