import type { VisualReference } from '../domain/visual-reference.model';
import { PerceptualHashService } from '../../modules/image-library/duplicate-detection/perceptual-hash';

export interface ExtractedTechnicalMetadata {
  originalFileName: string;
  relativeSourcePath: string;
  mimeType: string;
  fileSizeBytes: number;
  width: number;
  height: number;
  aspectRatio: string;
  orientation: 'landscape' | 'portrait' | 'square';
  checksum: string; // DETERMINISTIC_HASH
  perceptualHash: string; // PERCEPTUAL_HASH_HEURISTIC
  fileModifiedAt: string;
  syncedAt: string;
}

export class MetadataExtractor {
  /**
   * Extracts ONLY verifiable DETERMINISTIC_METADATA and PERCEPTUAL_HASH_HEURISTIC from file buffer.
   * Does NOT classify business metadata or infer rights/ownership.
   */
  static extractTechnicalMetadata(
    fileBuffer: Buffer,
    fileName: string,
    relativeSourcePath: string,
    mimeType: string,
    fileModifiedTimeMs: number,
    imageDimensions?: { width: number; height: number }
  ): ExtractedTechnicalMetadata {
    const checksum = PerceptualHashService.computeSha256(fileBuffer);
    const perceptualHash = PerceptualHashService.computeDHash(fileBuffer);

    const width = imageDimensions?.width || 1200;
    const height = imageDimensions?.height || 800;

    const ratio = width / height;
    let aspectRatio = '1:1';
    if (ratio >= 1.7) aspectRatio = '16:9';
    else if (ratio >= 1.3) aspectRatio = '4:3';
    else if (ratio <= 0.6) aspectRatio = '9:16';
    else if (ratio <= 0.8) aspectRatio = '4:5';

    const orientation = width > height ? 'landscape' : width < height ? 'portrait' : 'square';
    const now = new Date().toISOString();

    return {
      originalFileName: fileName,
      relativeSourcePath,
      mimeType,
      fileSizeBytes: fileBuffer.length,
      width,
      height,
      aspectRatio,
      orientation,
      checksum,
      perceptualHash,
      fileModifiedAt: new Date(fileModifiedTimeMs).toISOString(),
      syncedAt: now,
    };
  }

  /**
   * Initializes draft VisualReference with mandatory unreviewed/pending defaults.
   */
  static createDraftReference(
    id: string,
    techMeta: ExtractedTechnicalMetadata,
    thumbnailDataUrl: string,
    classificationHint?: { category?: string; knowledgeDomain?: string }
  ): VisualReference {
    const now = new Date().toISOString();

    return {
      id,
      title: techMeta.originalFileName.replace(/\.[^/.]+$/, ''),
      caption: '',
      description: '',
      sourceType: 'Imported Folder',
      sourceProvider: 'Local Synchronizer',
      sourceAvailability: 'AVAILABLE',
      relativeSourcePath: techMeta.relativeSourcePath,
      originalFileName: techMeta.originalFileName,
      storagePath: `vip-originals/${id}_${techMeta.originalFileName}`,
      thumbnailPath: thumbnailDataUrl,
      mimeType: techMeta.mimeType,
      fileSizeBytes: techMeta.fileSizeBytes,
      checksum: techMeta.checksum,
      perceptualHash: techMeta.perceptualHash,
      width: techMeta.width,
      height: techMeta.height,
      aspectRatio: techMeta.aspectRatio,
      orientation: techMeta.orientation,
      category: classificationHint?.category,
      topic: classificationHint?.knowledgeDomain,
      classificationState: 'UNREVIEWED',
      qualityScores: {
        relevanceScore: 50,
        realismScore: 50,
        compositionScore: 50,
        technicalQualityScore: 50,
        overallQualityScore: 50,
      },
      rights: {
        rightsConfirmed: false,
        sourceProvider: 'Local Import (Unconfirmed)',
        licenceType: 'Pending Confirmation',
        attributionRequired: false,
        commercialUseReviewStatus: 'PENDING',
      },
      review: {
        status: 'PENDING',
        reviewerId: 'local-sync-importer',
        reviewedAt: now,
        reviewerNotes: 'Imported via local folder synchronizer. Awaiting manual rights verification and metadata review.',
      },
      createdAt: now,
      updatedAt: now,
      fileModifiedAt: techMeta.fileModifiedAt,
      syncedAt: techMeta.syncedAt,
      version: 1,
      usageCount: 0,
      retrievalCount: 0,
      auditHistory: [
        {
          action: 'DRAFT_CREATED',
          performedBy: 'local-sync-importer',
          timestamp: now,
          details: 'Initialized draft record from local folder ingestion.',
        },
      ],
    };
  }
}
