import type { VisualReference, RightsRecord } from '../domain/visual-reference.model';
import type { IImageLibraryRepository } from '../repositories/image-library-repository.interface';

export class RightsManager {
  private repo: IImageLibraryRepository;

  constructor(repository: IImageLibraryRepository) {
    this.repo = repository;
  }

  /**
   * Confirms rights for a visual reference.
   * Approval is blocked unless rightsConfirmed === true and commercialUseReviewStatus === 'APPROVED'.
   */
  async updateRightsConfirmation(
    id: string,
    rightsUpdate: Partial<RightsRecord>,
    reviewerUserId: string
  ): Promise<VisualReference> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`Visual reference ${id} not found.`);
    }

    const now = new Date().toISOString();
    const updatedRights: RightsRecord = {
      ...existing.rights,
      ...rightsUpdate,
      reviewedBy: reviewerUserId,
      reviewedAt: now,
    };

    const auditEntry = {
      action: 'RIGHTS_UPDATED',
      performedBy: reviewerUserId,
      timestamp: now,
      details: `Rights confirmed: ${updatedRights.rightsConfirmed}, Commercial Status: ${updatedRights.commercialUseReviewStatus}`,
    };

    const updated = await this.repo.update(id, {
      rights: updatedRights,
      auditHistory: [...(existing.auditHistory || []), auditEntry],
    });

    return updated;
  }
}
