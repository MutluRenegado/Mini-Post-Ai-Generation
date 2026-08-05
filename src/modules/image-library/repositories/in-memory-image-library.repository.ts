import type { ImageLibrarySearchFilters, PaginationResult, VisualReference } from '../models/visual-reference.model';
import type { IImageLibraryRepository } from './image-library-repository.interface';

export class InMemoryImageLibraryRepository implements IImageLibraryRepository {
  private store: Map<string, VisualReference> = new Map();

  async findById(id: string): Promise<VisualReference | null> {
    return this.store.get(id) || null;
  }

  async findByChecksum(checksum: string): Promise<VisualReference | null> {
    for (const ref of this.store.values()) {
      if (ref.checksum === checksum) return ref;
    }
    return null;
  }

  async getAll(): Promise<VisualReference[]> {
    return Array.from(this.store.values());
  }

  async getApprovedReferences(): Promise<VisualReference[]> {
    return Array.from(this.store.values()).filter(
      (ref) =>
        ref.review?.status === 'APPROVED' &&
        ref.rights?.rightsConfirmed === true &&
        ref.rights?.commercialUseReviewStatus === 'APPROVED'
    );
  }

  async search(filters: ImageLibrarySearchFilters): Promise<PaginationResult<VisualReference>> {
    let all = Array.from(this.store.values());

    if (filters.query) {
      const q = filters.query.toLowerCase();
      all = all.filter((ref) => ref.title.toLowerCase().includes(q));
    }

    if (filters.reviewStatus) {
      const statuses = Array.isArray(filters.reviewStatus)
        ? filters.reviewStatus
        : [filters.reviewStatus];
      all = all.filter((ref) => statuses.includes(ref.review.status));
    }

    if (filters.rightsConfirmed !== undefined) {
      all = all.filter((ref) => ref.rights.rightsConfirmed === filters.rightsConfirmed);
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 12;
    const total = all.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIdx = (page - 1) * pageSize;
    const items = all.slice(startIdx, startIdx + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async save(reference: VisualReference): Promise<VisualReference> {
    this.store.set(reference.id, reference);
    return reference;
  }

  async update(id: string, updates: Partial<VisualReference>): Promise<VisualReference> {
    const existing = this.store.get(id);
    if (!existing) throw new Error(`VisualReference ${id} not found`);
    const updated: VisualReference = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1,
    };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  async count(): Promise<number> {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }
}
