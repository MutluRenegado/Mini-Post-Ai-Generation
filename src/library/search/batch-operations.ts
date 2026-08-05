import type { VisualReference, RightsRecord } from '../domain/visual-reference.model';
import type { IImageLibraryRepository } from '../repositories/image-library-repository.interface';

export class BatchOperations {
  private repo: IImageLibraryRepository;

  constructor(repository: IImageLibraryRepository) {
    this.repo = repository;
  }

  /**
   * Bulk updates rights for multiple visual references.
   */
  async batchUpdateRights(
    ids: string[],
    rightsUpdate: Partial<RightsRecord>,
    performedByUserId: string
  ): Promise<VisualReference[]> {
    const updatedRefs: VisualReference[] = [];
    const now = new Date().toISOString();

    for (const id of ids) {
      const existing = await this.repo.findById(id);
      if (existing) {
        const newRights: RightsRecord = {
          ...existing.rights,
          ...rightsUpdate,
          reviewedBy: performedByUserId,
          reviewedAt: now,
        };

        const updated = await this.repo.update(id, {
          rights: newRights,
          auditHistory: [
            ...(existing.auditHistory || []),
            {
              action: 'BATCH_RIGHTS_UPDATED',
              performedBy: performedByUserId,
              timestamp: now,
              details: `Batch rights updated. Rights confirmed: ${newRights.rightsConfirmed}`,
            },
          ],
        });
        updatedRefs.push(updated);
      }
    }

    return updatedRefs;
  }

  /**
   * Bulk tags metadata for multiple visual references.
   */
  async batchTagMetadata(
    ids: string[],
    metadataTag: { industry?: string; topic?: string; scene?: string; category?: string },
    performedByUserId: string
  ): Promise<VisualReference[]> {
    const updatedRefs: VisualReference[] = [];
    const now = new Date().toISOString();

    for (const id of ids) {
      const existing = await this.repo.findById(id);
      if (existing) {
        const updated = await this.repo.update(id, {
          industry: metadataTag.industry || existing.industry,
          topic: metadataTag.topic || existing.topic,
          scene: metadataTag.scene || existing.scene,
          category: metadataTag.category || existing.category,
          classificationState: 'MANUALLY_REVIEWED',
          auditHistory: [
            ...(existing.auditHistory || []),
            {
              action: 'BATCH_METADATA_TAGGED',
              performedBy: performedByUserId,
              timestamp: now,
              details: `Batch metadata tagged: ${JSON.stringify(metadataTag)}`,
            },
          ],
        });
        updatedRefs.push(updated);
      }
    }

    return updatedRefs;
  }
}
