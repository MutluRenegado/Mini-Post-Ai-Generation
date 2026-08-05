import type { VisualReference, ReviewStatus } from '../domain/visual-reference.model';
import type { IImageLibraryRepository } from '../repositories/image-library-repository.interface';

export class ReviewWorkflow {
  private repo: IImageLibraryRepository;

  constructor(repository: IImageLibraryRepository) {
    this.repo = repository;
  }

  /**
   * Transitions review status (PENDING -> APPROVED / REJECTED / ARCHIVED).
   * Blocks approval unless rightsConfirmed === true and commercialUseReviewStatus === 'APPROVED'.
   */
  async setReviewStatus(
    id: string,
    targetStatus: ReviewStatus,
    reviewerId: string,
    notes?: string
  ): Promise<VisualReference> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`Visual reference ${id} not found.`);
    }

    if (targetStatus === 'APPROVED') {
      if (!existing.rights.rightsConfirmed || existing.rights.commercialUseReviewStatus !== 'APPROVED') {
        throw new Error(
          `Approval blocked: Rights must be confirmed and commercialUseReviewStatus must be APPROVED before setting status to APPROVED.`
        );
      }
    }

    const now = new Date().toISOString();
    const review = {
      status: targetStatus,
      reviewerId,
      reviewedAt: now,
      reviewerNotes: notes || existing.review.reviewerNotes,
    };

    const auditEntry = {
      action: `REVIEW_STATUS_${targetStatus}`,
      performedBy: reviewerId,
      timestamp: now,
      details: `Status transitioned from ${existing.review.status} to ${targetStatus}.`,
    };

    const updated = await this.repo.update(id, {
      review,
      auditHistory: [...(existing.auditHistory || []), auditEntry],
    });

    return updated;
  }
}
