import type {
  VisualReference,
  ImageLibrarySearchFilters,
  PaginationResult,
} from '../domain/visual-reference.model';
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
        ref.rights?.commercialUseReviewStatus === 'APPROVED' &&
        ref.sourceAvailability !== 'MISSING'
    );
  }

  async search(filters: ImageLibrarySearchFilters): Promise<PaginationResult<VisualReference>> {
    let items = Array.from(this.store.values());

    if (filters.query) {
      const q = filters.query.toLowerCase();
      items = items.filter(
        (ref) =>
          ref.title.toLowerCase().includes(q) ||
          ref.description?.toLowerCase().includes(q) ||
          ref.originalFileName.toLowerCase().includes(q) ||
          ref.topic?.toLowerCase().includes(q) ||
          ref.industry?.toLowerCase().includes(q)
      );
    }

    if (filters.reviewStatus) {
      const statuses = Array.isArray(filters.reviewStatus)
        ? filters.reviewStatus
        : [filters.reviewStatus];
      items = items.filter((ref) => statuses.includes(ref.review.status));
    }

    if (filters.rightsConfirmed !== undefined) {
      items = items.filter((ref) => ref.rights.rightsConfirmed === filters.rightsConfirmed);
    }

    if (filters.sourceAvailability) {
      items = items.filter((ref) => ref.sourceAvailability === filters.sourceAvailability);
    }

    if (filters.industry) {
      items = items.filter(
        (ref) => ref.industry?.toLowerCase() === filters.industry?.toLowerCase()
      );
    }

    if (filters.aspectRatio) {
      items = items.filter((ref) => ref.aspectRatio === filters.aspectRatio);
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 12;
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize) || 1;

    const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginatedItems,
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
    if (!existing) {
      throw new Error(`Visual reference with ID ${id} not found.`);
    }

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
}
