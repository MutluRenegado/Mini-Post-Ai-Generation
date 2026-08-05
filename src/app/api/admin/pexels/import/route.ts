import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PexelsProvider } from '@/providers/pexels/pexels.provider';
import { FirestoreImageLibraryRepository } from '@/library/repositories/firestore-image-library.repository';
import type { VisualReference } from '@/library/domain/visual-reference.model';

const pexelsProvider = new PexelsProvider();
const repo = new FirestoreImageLibraryRepository();

const DEFAULT_IMPORT_LIMIT = 20;
const HARD_IMPORT_LIMIT = 50;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const photoIds: string[] = body.photoIds || (body.photoId ? [body.photoId] : []);

    if (!photoIds || photoIds.length === 0) {
      return NextResponse.json(
        { error: 'INVALID_IMPORT_REQUEST', message: 'At least one photoId must be specified for import.' },
        { status: 400 }
      );
    }

    if (photoIds.length > HARD_IMPORT_LIMIT) {
      return NextResponse.json(
        {
          error: 'IMPORT_LIMIT_EXCEEDED',
          message: `Cannot import more than ${HARD_IMPORT_LIMIT} photos in a single operation.`,
        },
        { status: 400 }
      );
    }

    const effectiveLimit = Math.min(photoIds.length, DEFAULT_IMPORT_LIMIT);
    const selectedIds = photoIds.slice(0, effectiveLimit);

    const importedRecords: VisualReference[] = [];
    const skippedRecords: { id: string; reason: string }[] = [];

    const incomingDir = 'D:\\Library\\Images Library\\01_Incoming';
    const isLocalDirAvailable = fs.existsSync(incomingDir);

    for (const photoId of selectedIds) {
      try {
        // 1. Fetch photo metadata from Pexels API
        const asset = await pexelsProvider.getPhoto(photoId);

        // 2. Download image buffer
        const imgRes = await fetch(asset.sourceImageUrl);
        if (!imgRes.ok) {
          skippedRecords.push({ id: photoId, reason: `Failed to download image (HTTP ${imgRes.status})` });
          continue;
        }

        const arrayBuf = await imgRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);

        // 3. Compute SHA-256 Checksum
        const checksum = crypto.createHash('sha256').update(buffer).digest('hex');
        const pHash = `phash_${photoId}_${checksum.slice(0, 8)}`;

        const photographerSlug = asset.photographerName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        const filename = `pexels-${photographerSlug}-${photoId}.jpg`;
        const refId = `ref_pexels_${photoId}`;

        // Check if already in repository
        const existing = await repo.findById(refId);
        if (existing) {
          skippedRecords.push({ id: photoId, reason: 'ALREADY_IMPORTED: Record already exists in Image Library.' });
          continue;
        }

        // Write to local incoming folder if available
        let relativeSourcePath = `01_Incoming/${filename}`;
        if (isLocalDirAvailable) {
          try {
            const destPath = path.join(incomingDir, filename);
            if (!fs.existsSync(destPath)) {
              fs.writeFileSync(destPath, buffer);
            }
          } catch {
            // Fallback to managed record
          }
        }

        const now = new Date().toISOString();

        // 4. Create VisualReference record with mandatory unreviewed/pending defaults
        const newRecord: VisualReference = {
          id: refId,
          title: asset.altText || `Photo by ${asset.photographerName} on Pexels`,
          caption: asset.altText,
          description: `Imported stock photograph from Pexels (ID: ${photoId}) by ${asset.photographerName}.`,
          sourceType: 'Imported Folder',
          sourceProvider: 'PEXELS',
          sourceAvailability: 'AVAILABLE',
          relativeSourcePath,
          originalFileName: filename,
          storagePath: `vip-originals/${filename}`,
          thumbnailPath: asset.thumbnailUrl,
          mimeType: 'image/jpeg',
          fileSizeBytes: buffer.length,
          checksum,
          perceptualHash: pHash,
          width: asset.width,
          height: asset.height,
          aspectRatio: asset.width > asset.height ? '16:9' : asset.width < asset.height ? '9:16' : '1:1',
          orientation: asset.width > asset.height ? 'landscape' : asset.width < asset.height ? 'portrait' : 'square',
          category: 'Stock',
          topic: 'Pexels Import',
          classificationState: 'UNREVIEWED',
          qualityScores: {
            relevanceScore: 70,
            realismScore: 90,
            compositionScore: 80,
            technicalQualityScore: 85,
            overallQualityScore: 80,
          },
          rights: {
            rightsConfirmed: false,
            sourceProvider: 'PEXELS',
            licenceType: 'PEXELS_LICENSE',
            attributionRequired: true,
            attributionText: asset.attributionText,
            sourceUrl: asset.attributionUrl,
            commercialUseReviewStatus: 'PENDING',
          },
          review: {
            status: 'PENDING',
            reviewerNotes: 'Imported from Pexels API. Requires manual rights confirmation and approval review.',
          },
          createdAt: now,
          updatedAt: now,
          version: 1,
          usageCount: 0,
          retrievalCount: 0,
        };

        await repo.save(newRecord);
        importedRecords.push(newRecord);
      } catch (err: any) {
        skippedRecords.push({ id: photoId, reason: err.message || 'Import process failed.' });
      }
    }

    return NextResponse.json({
      success: true,
      importedCount: importedRecords.length,
      skippedCount: skippedRecords.length,
      importedRecords,
      skippedRecords,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'PEXELS_IMPORT_FAILED', message: error.message || 'Failed to process Pexels import.' },
      { status: 500 }
    );
  }
}
