import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { InMemoryImageLibraryRepository } from '../repositories/in-memory-image-library.repository';
import { ImageLibraryAdminService } from '../services/image-library-admin.service';
import { FolderSyncService } from '../importer/folder-sync.service';
import { MetadataExtractor } from '../importer/metadata-extractor';
import { VisualRankingService } from '../runtime/visual-ranking.service';
import { DiversityController } from '../runtime/diversity-controller';
import { VisualReferenceResolver } from '../runtime/visual-reference-resolver';
import type { VisualReference } from '../models/visual-reference.model';

describe('Visual Intelligence Engine — Phase 2A & 2B Tests', () => {
  let repo: InMemoryImageLibraryRepository;
  let adminService: ImageLibraryAdminService;
  let resolver: VisualReferenceResolver;

  beforeEach(() => {
    repo = new InMemoryImageLibraryRepository();
    adminService = new ImageLibraryAdminService(repo);
    resolver = new VisualReferenceResolver(repo);
  });

  // ===================================================
  // PHASE 2A TESTS: LOCAL FOLDER SYNCHRONIZER
  // ===================================================

  test('2A-1. MetadataExtractor applies verifiable defaults (PENDING, rightsConfirmed=false, UNREVIEWED)', () => {
    const dummyBuffer = Buffer.from('test-image-content-2a');
    const techMeta = MetadataExtractor.extractTechnicalMetadata(
      dummyBuffer,
      'test-photo.jpg',
      'Technology/test-photo.jpg',
      'image/jpeg',
      Date.now(),
      { width: 1920, height: 1080 }
    );

    const draftRef = MetadataExtractor.createDraftReference('ref_2a_1', techMeta, 'data:image/jpeg;base64,thumb');

    assert.strictEqual(draftRef.review.status, 'PENDING');
    assert.strictEqual(draftRef.rights.rightsConfirmed, false);
    assert.strictEqual(draftRef.classificationState, 'UNREVIEWED');
    assert.strictEqual(draftRef.sourceAvailability, 'AVAILABLE');
    assert.strictEqual(draftRef.aspectRatio, '16:9');
    assert.ok(draftRef.checksum);
    assert.ok(draftRef.perceptualHash);
  });

  test('2A-2. Missing source file marks sourceAvailability = MISSING without deleting record', async () => {
    const dummyBuffer = Buffer.from('missing-test-image');
    const techMeta = MetadataExtractor.extractTechnicalMetadata(
      dummyBuffer,
      'missing.jpg',
      'Incoming/missing.jpg',
      'image/jpeg',
      Date.now()
    );

    const draftRef = MetadataExtractor.createDraftReference('ref_missing', techMeta, 'data:image/jpeg;base64,thumb');
    await repo.save(draftRef);

    // Update availability
    const updated = await repo.update(draftRef.id, { sourceAvailability: 'MISSING' });
    assert.strictEqual(updated.sourceAvailability, 'MISSING');

    // Record remains in repository
    const found = await repo.findById(draftRef.id);
    assert.ok(found);
    assert.strictEqual(found?.sourceAvailability, 'MISSING');
  });

  // ===================================================
  // PHASE 2B TESTS: METADATA RETRIEVAL & RANKING
  // ===================================================

  test('2B-1. Approved-only, rights-confirmed, available gating excludes unconfirmed/missing images', async () => {
    // 1. Pending reference
    const refPending = await adminService.processUpload({
      base64Data: Buffer.from('pending-1').toString('base64'),
      originalFileName: 'pending.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: 1000,
      title: 'Pending Reference',
    });

    // 2. Approved reference with missing source
    const refMissing = await adminService.processUpload({
      base64Data: Buffer.from('missing-1').toString('base64'),
      originalFileName: 'missing.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: 1000,
      title: 'Approved Missing Reference',
    });
    await adminService.updateRights(refMissing.reference.id, {
      rightsConfirmed: true,
      sourceProvider: 'Stock',
      licenceType: 'Commercial',
      commercialUseReviewStatus: 'APPROVED',
    });
    await adminService.setReviewStatus(refMissing.reference.id, 'APPROVED');
    await repo.update(refMissing.reference.id, { sourceAvailability: 'MISSING' });

    // 3. Fully Approved, Rights Confirmed & Available Reference
    const refApproved = await adminService.processUpload({
      base64Data: Buffer.from('approved-1').toString('base64'),
      originalFileName: 'approved.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: 1000,
      title: 'Approved Available Reference',
    });
    await adminService.updateRights(refApproved.reference.id, {
      rightsConfirmed: true,
      sourceProvider: 'Internal Studio',
      licenceType: 'Commercial Royalty Free',
      commercialUseReviewStatus: 'APPROVED',
    });
    await adminService.setReviewStatus(refApproved.reference.id, 'APPROVED');

    // Query Resolver
    const res = await resolver.resolveVisualReference({ topic: 'Approved' });
    assert.strictEqual(res.retrievalStatus, 'APPROVED_REFERENCE_MATCH');
    assert.strictEqual(res.references.length, 1);
    assert.strictEqual(res.references[0].id, refApproved.reference.id);
  });

  test('2B-2. VisualRankingService calculates transparent component scores & human explanation', async () => {
    const dummyRef: VisualReference = {
      id: 'ref_rank_1',
      title: 'Executive Trade Finance Boardroom',
      sourceType: 'Internal Upload',
      sourceProvider: 'Studio',
      sourceAvailability: 'AVAILABLE',
      originalFileName: 'boardroom.jpg',
      storagePath: 'originals/boardroom.jpg',
      thumbnailPath: 'data:image/jpeg;base64,thumb',
      mimeType: 'image/jpeg',
      fileSizeBytes: 2000,
      checksum: 'sha256_dummy',
      perceptualHash: 'phash_dummy',
      width: 1920,
      height: 1080,
      aspectRatio: '16:9',
      orientation: 'landscape',
      topic: 'International Trade',
      industry: 'Finance',
      photographyStyle: 'Modern Editorial',
      qualityScores: { overallQualityScore: 90 },
      rights: {
        rightsConfirmed: true,
        sourceProvider: 'Studio',
        licenceType: 'Commercial',
        attributionRequired: false,
        commercialUseReviewStatus: 'APPROVED',
      },
      review: { status: 'APPROVED' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      usageCount: 1,
      retrievalCount: 2,
    };

    const rankResult = VisualRankingService.rankCandidate(dummyRef, {
      topic: 'International Trade',
      industry: 'Finance',
      aspectRatio: '16:9',
      visualStyle: 'Modern Editorial',
    });

    assert.ok(rankResult.finalScore >= 80);
    assert.strictEqual(rankResult.selectionStatus, 'TOP_MATCH');
    assert.strictEqual(rankResult.componentScores.industryMatch, 100);
    assert.strictEqual(rankResult.componentScores.aspectRatioMatch, 100);
    assert.ok(rankResult.explanation.includes('Ranked candidate'));
  });

  test('2B-3. DiversityController applies usage and recency penalties', () => {
    const dummyRef: VisualReference = {
      id: 'ref_popular',
      title: 'Popular Desk Setup',
      sourceType: 'Internal Upload',
      sourceProvider: 'Studio',
      sourceAvailability: 'AVAILABLE',
      originalFileName: 'desk.jpg',
      storagePath: 'originals/desk.jpg',
      thumbnailPath: 'thumb',
      mimeType: 'image/jpeg',
      fileSizeBytes: 1000,
      checksum: 'abc',
      perceptualHash: 'def',
      width: 1000,
      height: 1000,
      aspectRatio: '1:1',
      orientation: 'square',
      usageCount: 4,
      lastUsedAt: new Date().toISOString(), // Used today
      rights: {
        rightsConfirmed: true,
        sourceProvider: 'Studio',
        licenceType: 'Commercial',
        attributionRequired: false,
        commercialUseReviewStatus: 'APPROVED',
      },
      review: { status: 'APPROVED' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      retrievalCount: 5,
    };

    const div = DiversityController.calculateDiversityAdjustments(dummyRef, {
      currentTopic: 'Popular Desk Setup',
    });

    assert.strictEqual(div.usagePenalty, 20); // 4 * 5 = 20
    assert.strictEqual(div.recencyAdjustment, -25); // Used today penalty
  });

  test('2B-4. VisualReferenceResolver default mode enriches brief without silent asset substitution', async () => {
    const upload = await adminService.processUpload({
      base64Data: Buffer.from('enrichment-img').toString('base64'),
      originalFileName: 'enrichment.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: 1000,
      title: 'Tech Innovation Team',
    });

    await adminService.updateMetadata(upload.reference.id, {
      photographyStyle: 'Modern Editorial',
      lighting: 'Soft Daylight',
      composition: 'Rule of Thirds',
    });

    await adminService.updateRights(upload.reference.id, {
      rightsConfirmed: true,
      sourceProvider: 'Studio',
      licenceType: 'Commercial',
      commercialUseReviewStatus: 'APPROVED',
    });

    await adminService.setReviewStatus(upload.reference.id, 'APPROVED');

    // Default mode: AI_GENERATED_WITH_REFERENCE_ENRICHMENT
    const res = await resolver.resolveVisualReference({
      mode: 'AI_GENERATED_WITH_REFERENCE_ENRICHMENT',
      topic: 'Tech Innovation Team',
    });

    assert.strictEqual(res.mode, 'AI_GENERATED_WITH_REFERENCE_ENRICHMENT');
    assert.strictEqual(res.retrievalStatus, 'APPROVED_REFERENCE_MATCH');
    assert.ok(res.enrichment);
    assert.strictEqual(res.enrichment?.photographyStyle, 'Modern Editorial');
    assert.strictEqual(res.enrichment?.lighting, 'Soft Daylight');
    assert.strictEqual(res.selectedAsset, undefined); // NO SILENT ASSET SUBSTITUTION
  });

  test('2B-5. Explicit LIBRARY_REFERENCE mode returns selectedAsset', async () => {
    const upload = await adminService.processUpload({
      base64Data: Buffer.from('asset-img').toString('base64'),
      originalFileName: 'asset.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: 1000,
      title: 'Selected Library Photo',
    });

    await adminService.updateRights(upload.reference.id, {
      rightsConfirmed: true,
      sourceProvider: 'Studio',
      licenceType: 'Commercial',
      commercialUseReviewStatus: 'APPROVED',
    });

    await adminService.setReviewStatus(upload.reference.id, 'APPROVED');

    const res = await resolver.resolveVisualReference({
      mode: 'LIBRARY_REFERENCE',
      topic: 'Selected Library Photo',
    });

    assert.strictEqual(res.mode, 'LIBRARY_REFERENCE');
    assert.strictEqual(res.retrievalStatus, 'APPROVED_REFERENCE_MATCH');
    assert.ok(res.selectedAsset);
    assert.strictEqual(res.selectedAsset?.id, upload.reference.id);
  });

  test('2B-6. NO_REFERENCE_MATCH fallback returns clean signal when no approved references match', async () => {
    const res = await resolver.resolveVisualReference({
      topic: 'NonExistentTopic999',
    });

    assert.strictEqual(res.retrievalStatus, 'NO_REFERENCE_MATCH');
    assert.strictEqual(res.references.length, 0);
    assert.strictEqual(res.selectedAsset, undefined);
  });
});
