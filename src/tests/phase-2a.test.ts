import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { InMemoryImageLibraryRepository } from '../library/repositories/in-memory-image-library.repository';
import { MetadataExtractor } from '../library/ingestion/metadata-extractor';
import { RightsManager } from '../library/review/rights-manager';
import { ReviewWorkflow } from '../library/review/review-workflow';
import { BatchOperations } from '../library/search/batch-operations';
import { SearchEngine } from '../library/search/search-engine';

describe('Standalone Visual Intelligence Platform — Phase 2A Tests', () => {
  let repo: InMemoryImageLibraryRepository;
  let rightsManager: RightsManager;
  let workflow: ReviewWorkflow;
  let batchOps: BatchOperations;
  let searchEngine: SearchEngine;

  beforeEach(() => {
    repo = new InMemoryImageLibraryRepository();
    rightsManager = new RightsManager(repo);
    workflow = new ReviewWorkflow(repo);
    batchOps = new BatchOperations(repo);
    searchEngine = new SearchEngine(repo);
  });

  test('2A-1. MetadataExtractor applies verifiable defaults (PENDING, rightsConfirmed=false, UNREVIEWED)', () => {
    const dummyBuffer = Buffer.from('test-image-content-phase-2a');
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
    assert.strictEqual(draftRef.auditHistory?.length, 1);
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

  test('2A-3. RightsManager blocks setting status to APPROVED when rightsConfirmed is false', async () => {
    const dummyBuffer = Buffer.from('unconfirmed-image');
    const techMeta = MetadataExtractor.extractTechnicalMetadata(
      dummyBuffer,
      'unconfirmed.jpg',
      'Incoming/unconfirmed.jpg',
      'image/jpeg',
      Date.now()
    );

    const draftRef = MetadataExtractor.createDraftReference('ref_unconfirmed', techMeta, 'data:image/jpeg;base64,thumb');
    await repo.save(draftRef);

    // Attempt approval without confirming rights -> must throw Error
    await assert.rejects(async () => {
      await workflow.setReviewStatus(draftRef.id, 'APPROVED', 'admin-user');
    }, /Approval blocked/);
  });

  test('2A-4. ReviewWorkflow successfully approves reference after confirming rights', async () => {
    const dummyBuffer = Buffer.from('confirmed-image');
    const techMeta = MetadataExtractor.extractTechnicalMetadata(
      dummyBuffer,
      'confirmed.jpg',
      'Incoming/confirmed.jpg',
      'image/jpeg',
      Date.now()
    );

    const draftRef = MetadataExtractor.createDraftReference('ref_confirmed', techMeta, 'data:image/jpeg;base64,thumb');
    await repo.save(draftRef);

    // 1. Confirm rights
    await rightsManager.updateRightsConfirmation(
      draftRef.id,
      {
        rightsConfirmed: true,
        sourceProvider: 'Studio Internal',
        licenceType: 'Commercial Royalty Free',
        commercialUseReviewStatus: 'APPROVED',
      },
      'admin-user'
    );

    // 2. Set status to APPROVED
    const approved = await workflow.setReviewStatus(draftRef.id, 'APPROVED', 'admin-user', 'Rights verified');
    assert.strictEqual(approved.review.status, 'APPROVED');
    assert.strictEqual(approved.rights.rightsConfirmed, true);
  });

  test('2A-5. BatchOperations performs bulk rights updates and audit logging', async () => {
    const dummyBuffer1 = Buffer.from('batch-1');
    const techMeta1 = MetadataExtractor.extractTechnicalMetadata(dummyBuffer1, 'b1.jpg', 'b1.jpg', 'image/jpeg', Date.now());
    const ref1 = MetadataExtractor.createDraftReference('ref_b1', techMeta1, 'thumb');
    await repo.save(ref1);

    const dummyBuffer2 = Buffer.from('batch-2');
    const techMeta2 = MetadataExtractor.extractTechnicalMetadata(dummyBuffer2, 'b2.jpg', 'b2.jpg', 'image/jpeg', Date.now());
    const ref2 = MetadataExtractor.createDraftReference('ref_b2', techMeta2, 'thumb');
    await repo.save(ref2);

    const updated = await batchOps.batchUpdateRights(
      [ref1.id, ref2.id],
      {
        rightsConfirmed: true,
        sourceProvider: 'Batch Agency',
        licenceType: 'Commercial',
        commercialUseReviewStatus: 'APPROVED',
      },
      'batch-admin'
    );

    assert.strictEqual(updated.length, 2);
    assert.strictEqual(updated[0].rights.rightsConfirmed, true);
    assert.strictEqual(updated[1].rights.rightsConfirmed, true);
  });

  test('2A-6. BatchOperations performs bulk metadata tagging', async () => {
    const dummyBuffer1 = Buffer.from('tag-1');
    const techMeta1 = MetadataExtractor.extractTechnicalMetadata(dummyBuffer1, 't1.jpg', 't1.jpg', 'image/jpeg', Date.now());
    const ref1 = MetadataExtractor.createDraftReference('ref_t1', techMeta1, 'thumb');
    await repo.save(ref1);

    const updated = await batchOps.batchTagMetadata(
      [ref1.id],
      { industry: 'Finance', topic: 'Global Markets', scene: 'Trading Floor' },
      'tagger-admin'
    );

    assert.strictEqual(updated[0].industry, 'Finance');
    assert.strictEqual(updated[0].topic, 'Global Markets');
    assert.strictEqual(updated[0].classificationState, 'MANUALLY_REVIEWED');
  });

  test('2A-7. SearchEngine paginated filtering returns correct subsets', async () => {
    const dummyBuffer1 = Buffer.from('search-1');
    const techMeta1 = MetadataExtractor.extractTechnicalMetadata(dummyBuffer1, 's1.jpg', 's1.jpg', 'image/jpeg', Date.now());
    const ref1 = MetadataExtractor.createDraftReference('ref_s1', techMeta1, 'thumb');
    ref1.industry = 'Healthcare';
    ref1.review.status = 'APPROVED';
    ref1.rights.rightsConfirmed = true;
    ref1.rights.commercialUseReviewStatus = 'APPROVED';
    await repo.save(ref1);

    const dummyBuffer2 = Buffer.from('search-2');
    const techMeta2 = MetadataExtractor.extractTechnicalMetadata(dummyBuffer2, 's2.jpg', 's2.jpg', 'image/jpeg', Date.now());
    const ref2 = MetadataExtractor.createDraftReference('ref_s2', techMeta2, 'thumb');
    ref2.industry = 'Finance';
    await repo.save(ref2);

    const res = await searchEngine.search({ industry: 'Healthcare', page: 1, pageSize: 10 });
    assert.strictEqual(res.total, 1);
    assert.strictEqual(res.items[0].id, ref1.id);
  });
});
