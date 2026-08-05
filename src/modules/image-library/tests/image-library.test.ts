import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { InMemoryImageLibraryRepository } from '../repositories/in-memory-image-library.repository';
import { ImageLibraryAdminService } from '../services/image-library-admin.service';
import { ApprovedReferenceReader } from '../adapters/approved-reference-reader';
import { PerceptualHashService } from '../duplicate-detection/perceptual-hash';

describe('Image Library Module - Milestone 1 Tests', () => {
  let repo: InMemoryImageLibraryRepository;
  let adminService: ImageLibraryAdminService;
  let reader: ApprovedReferenceReader;

  beforeEach(() => {
    repo = new InMemoryImageLibraryRepository();
    adminService = new ImageLibraryAdminService(repo);
    reader = new ApprovedReferenceReader(repo);
  });

  test('1. Process valid upload initializes PENDING status & unconfirmed rights', async () => {
    const dummyBase64 = Buffer.from('test-image-content-1').toString('base64');
    const res = await adminService.processUpload({
      base64Data: dummyBase64,
      originalFileName: 'technology-desk.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: 2048,
    });

    assert.strictEqual(res.blocked, false);
    assert.strictEqual(res.reference.review.status, 'PENDING');
    assert.strictEqual(res.reference.rights.rightsConfirmed, false);
    assert.ok(res.reference.checksum);
    assert.ok(res.reference.perceptualHash);
    assert.strictEqual(res.reference.originalFileName, 'technology-desk.jpg');
  });

  test('2. Reject unsupported file format (e.g. BMP or PDF)', async () => {
    await assert.rejects(
      async () => {
        await adminService.processUpload({
          base64Data: 'dummy',
          originalFileName: 'document.pdf',
          mimeType: 'application/pdf',
          fileSizeBytes: 1024,
        });
      },
      (err: any) => err.message.includes('UNSUPPORTED_FILE_TYPE')
    );
  });

  test('3. Exact duplicate SHA-256 detection blocks duplicate upload', async () => {
    const buffer = Buffer.from('identical-image-bytes');
    const base64 = buffer.toString('base64');

    // First upload
    const upload1 = await adminService.processUpload({
      base64Data: base64,
      originalFileName: 'photo1.png',
      mimeType: 'image/png',
      fileSizeBytes: 1024,
    });
    assert.strictEqual(upload1.blocked, false);

    // Second upload with identical bytes
    const upload2 = await adminService.processUpload({
      base64Data: base64,
      originalFileName: 'photo1_copy.png',
      mimeType: 'image/png',
      fileSizeBytes: 1024,
    });

    assert.strictEqual(upload2.blocked, true);
    assert.ok(upload2.blockReason?.includes('Exact duplicate detected'));
  });

  test('4. Approval is BLOCKED if rights remain unconfirmed', async () => {
    const dummyBase64 = Buffer.from('image-for-approval').toString('base64');
    const upload = await adminService.processUpload({
      base64Data: dummyBase64,
      originalFileName: 'desk-setup.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: 4096,
    });

    const refId = upload.reference.id;

    // Attempt to approve without updating rights
    await assert.rejects(
      async () => {
        await adminService.setReviewStatus(refId, 'APPROVED');
      },
      (err: any) => err.message.includes('APPROVAL_BLOCKED_RIGHTS_NOT_CONFIRMED')
    );
  });

  test('5. Successful Approval after confirming rights', async () => {
    const dummyBase64 = Buffer.from('image-for-approval-pass').toString('base64');
    const upload = await adminService.processUpload({
      base64Data: dummyBase64,
      originalFileName: 'approved-photo.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: 4096,
      title: 'Approved Technology Desk',
    });

    const refId = upload.reference.id;

    // Update rights first
    await adminService.updateRights(refId, {
      rightsConfirmed: true,
      sourceProvider: 'Licensed Unsplash Stock',
      licenceType: 'Commercial Royalty Free',
      attributionRequired: false,
      commercialUseReviewStatus: 'APPROVED',
    });

    // Approve
    const updated = await adminService.setReviewStatus(refId, 'APPROVED');
    assert.strictEqual(updated.review.status, 'APPROVED');
    assert.strictEqual(updated.rights.rightsConfirmed, true);
  });

  test('6. ApprovedReferenceReader excludes PENDING, REJECTED, and UNCONFIRMED images', async () => {
    // 1. Pending image
    const upPending = await adminService.processUpload({
      base64Data: Buffer.from('img-pending').toString('base64'),
      originalFileName: 'pending.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: 1000,
      title: 'Pending Tech Photo',
    });

    // 2. Rejected image
    const upRejected = await adminService.processUpload({
      base64Data: Buffer.from('img-rejected').toString('base64'),
      originalFileName: 'rejected.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: 1000,
      title: 'Rejected Tech Photo',
    });
    await adminService.setReviewStatus(upRejected.reference.id, 'REJECTED');

    // Query reader before any approval
    const query1 = await reader.getApprovedReferences({ topic: 'Tech' });
    assert.strictEqual(query1.matched, false);
    assert.strictEqual(query1.code, 'NO_REFERENCE_MATCH');

    // Now approve pending image with rights
    await adminService.updateRights(upPending.reference.id, {
      rightsConfirmed: true,
      sourceProvider: 'Internal Studio',
      licenceType: 'Proprietary',
      commercialUseReviewStatus: 'APPROVED',
    });
    await adminService.setReviewStatus(upPending.reference.id, 'APPROVED');

    // Query reader after approval
    const query2 = await reader.getApprovedReferences({ topic: 'Tech' });
    assert.strictEqual(query2.matched, true);
    assert.strictEqual(query2.code, 'APPROVED_REFERENCE_MATCH');
    assert.strictEqual(query2.references.length, 1);
    assert.strictEqual(query2.references[0].id, upPending.reference.id);
  });

  test('7. Search and Pagination filtering works', async () => {
    for (let i = 1; i <= 15; i++) {
      await adminService.processUpload({
        base64Data: Buffer.from(`item-${i}`).toString('base64'),
        originalFileName: `sample-${i}.jpg`,
        mimeType: 'image/jpeg',
        fileSizeBytes: 1000 + i,
        title: `Sample Photo ${i}`,
      });
    }

    const page1 = await repo.search({ page: 1, pageSize: 5 });
    assert.strictEqual(page1.items.length, 5);
    assert.strictEqual(page1.total, 15);
    assert.strictEqual(page1.totalPages, 3);
  });
});
