import type {
  DuplicateMatch,
  ReviewStatus,
  RightsRecord,
  VisualReference,
} from '../models/visual-reference.model';
import type { IImageLibraryRepository } from '../repositories/image-library-repository.interface';
import { PerceptualHashService } from '../duplicate-detection/perceptual-hash';
import { ThumbnailGenerator } from './thumbnail-generator';

export interface UploadImageInput {
  fileBuffer?: Buffer;
  base64Data?: string;
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  width?: number;
  height?: number;
  title?: string;
  sourceType?: VisualReference['sourceType'];
  sourceProvider?: string;
  uploadedByUserId?: string;
}

export interface UploadResult {
  reference: VisualReference;
  duplicates: DuplicateMatch[];
  blocked: boolean;
  blockReason?: string;
}

export class ImageLibraryAdminService {
  private repo: IImageLibraryRepository;

  constructor(repo: IImageLibraryRepository) {
    this.repo = repo;
  }

  /**
   * Processes a single or multi-file image upload.
   * Validates format/size, calculates checksum & pHash, checks duplicates, generates thumbnail,
   * initializes draft metadata, and sets reviewStatus = 'PENDING', rightsConfirmed = false.
   */
  async processUpload(input: UploadImageInput): Promise<UploadResult> {
    // 1. File Format Validation
    const allowedMIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMIME.includes(input.mimeType.toLowerCase())) {
      throw new Error(
        `UNSUPPORTED_FILE_TYPE: Only JPG, JPEG, PNG, and WebP images are supported. Received: ${input.mimeType}`
      );
    }

    // 2. File Size Validation (Max 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (input.fileSizeBytes > MAX_SIZE) {
      throw new Error(
        `FILE_SIZE_EXCEEDED: Maximum allowed file size is 25MB. File size: ${(
          input.fileSizeBytes /
          (1024 * 1024)
        ).toFixed(2)}MB`
      );
    }

    // 3. Compute Checksum & Perceptual Hash
    const buffer = input.fileBuffer || Buffer.from(input.base64Data || '', 'base64');
    const checksum = PerceptualHashService.computeSha256(buffer);
    const pHash = PerceptualHashService.computeDHash(buffer);

    // 4. Duplicate Detection Check
    const existingRefs = await this.repo.getAll();
    const duplicates = PerceptualHashService.checkDuplicates(
      checksum,
      pHash,
      input.originalFileName,
      input.fileSizeBytes,
      existingRefs
    );

    // Exact duplicates block auto-creation unless forced
    const exactMatch = duplicates.find((d) => d.classification === 'EXACT_DUPLICATE');
    if (exactMatch) {
      const existingRef = existingRefs.find((r) => r.id === exactMatch.existingId);
      if (existingRef) {
        return {
          reference: existingRef,
          duplicates,
          blocked: true,
          blockReason: `Exact duplicate detected matching existing record "${existingRef.title}" (${existingRef.id}).`,
        };
      }
    }

    // 5. Generate Thumbnail & Aspect Ratio
    const dataUrl = input.base64Data
      ? `data:${input.mimeType};base64,${input.base64Data}`
      : `data:${input.mimeType};base64,${buffer.toString('base64')}`;

    const thumbResult = await ThumbnailGenerator.generateThumbnail(dataUrl, 320);
    const width = input.width || thumbResult.width || 800;
    const height = input.height || thumbResult.height || 800;

    // Aspect ratio formatting
    const ratio = width / height;
    let aspectRatio = '1:1';
    if (ratio >= 1.7) aspectRatio = '16:9';
    else if (ratio >= 1.3) aspectRatio = '4:3';
    else if (ratio <= 0.6) aspectRatio = '9:16';
    else if (ratio <= 0.8) aspectRatio = '4:5';

    const orientation = width > height ? 'landscape' : width < height ? 'portrait' : 'square';

    // 6. Create Initial VisualReference (Status: PENDING, Rights: unconfirmed)
    const now = new Date().toISOString();
    const refId = `ref_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const newReference: VisualReference = {
      id: refId,
      title: input.title || input.originalFileName.replace(/\.[^/.]+$/, ''),
      caption: '',
      description: '',
      sourceType: input.sourceType || 'Internal Upload',
      sourceProvider: input.sourceProvider || 'User Upload',
      sourceAvailability: 'AVAILABLE',
      originalFileName: input.originalFileName,
      storagePath: `originals/${refId}_${input.originalFileName}`,
      thumbnailPath: thumbResult.thumbnailDataUrl,
      mimeType: input.mimeType,
      fileSizeBytes: input.fileSizeBytes,
      checksum,
      perceptualHash: pHash,
      width,
      height,
      aspectRatio,
      orientation,
      classificationState: 'SUGGESTED',
      qualityScores: {
        relevanceScore: 70,
        realismScore: 80,
        compositionScore: 75,
        technicalQualityScore: 80,
        overallQualityScore: 76,
      },
      rights: {
        rightsConfirmed: false,
        sourceProvider: input.sourceProvider || 'User Upload',
        licenceType: 'Pending Confirmation',
        attributionRequired: false,
        commercialUseReviewStatus: 'PENDING',
        reviewedBy: input.uploadedByUserId || 'system',
      },
      review: {
        status: 'PENDING',
        reviewerId: input.uploadedByUserId || 'admin',
        reviewedAt: now,
        reviewerNotes: 'Uploaded image. Awaiting manual rights verification and metadata approval.',
      },
      createdAt: now,
      updatedAt: now,
      version: 1,
      usageCount: 0,
      retrievalCount: 0,
    };

    const saved = await this.repo.save(newReference);

    return {
      reference: saved,
      duplicates,
      blocked: false,
    };
  }

  /**
   * Updates metadata for a VisualReference.
   */
  async updateMetadata(id: string, updates: Partial<VisualReference>): Promise<VisualReference> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`VisualReference with ID ${id} not found.`);
    }

    return this.repo.update(id, {
      ...updates,
      classificationState: 'MANUALLY_REVIEWED',
    });
  }

  /**
   * Updates Rights confirmation for a VisualReference.
   */
  async updateRights(id: string, rights: Partial<RightsRecord>, reviewerId = 'admin'): Promise<VisualReference> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`VisualReference with ID ${id} not found.`);
    }

    const updatedRights: RightsRecord = {
      ...existing.rights,
      ...rights,
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString(),
    };

    return this.repo.update(id, {
      rights: updatedRights,
    });
  }

  /**
   * Transition Review Status (PENDING, APPROVED, REJECTED, NEEDS_CHANGES, ARCHIVED).
   * MANDATORY GATING: Approval is blocked unless rightsConfirmed === true and required rights fields are set.
   */
  async setReviewStatus(
    id: string,
    status: ReviewStatus,
    reviewerId = 'admin',
    notes?: string,
    rejectionReason?: string
  ): Promise<VisualReference> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`VisualReference with ID ${id} not found.`);
    }

    // MANDATORY RIGHTS GATING FOR APPROVAL
    if (status === 'APPROVED') {
      const r = existing.rights;
      if (
        !r.rightsConfirmed ||
        !r.sourceProvider ||
        !r.licenceType ||
        r.commercialUseReviewStatus !== 'APPROVED'
      ) {
        throw new Error(
          `APPROVAL_BLOCKED_RIGHTS_NOT_CONFIRMED: Cannot approve image ${id}. Rights confirmation, source provider, licence type, and commercial-use approval are mandatory before an image can be approved.`
        );
      }
    }

    const now = new Date().toISOString();
    return this.repo.update(id, {
      review: {
        status,
        reviewerId,
        reviewedAt: now,
        rejectionReason: status === 'REJECTED' ? rejectionReason || 'Failed quality or rights criteria' : undefined,
        reviewerNotes: notes,
      },
    });
  }
}
