import type {
  VisualReference,
  ImageLibrarySearchFilters,
  PaginationResult,
} from '../domain/visual-reference.model';
import type { IImageLibraryRepository } from './image-library-repository.interface';
import { InMemoryImageLibraryRepository } from './in-memory-image-library.repository';

export class FirestoreImageLibraryRepository implements IImageLibraryRepository {
  private fallback: InMemoryImageLibraryRepository = new InMemoryImageLibraryRepository();

  async findById(id: string): Promise<VisualReference | null> {
    return this.fallback.findById(id);
  }

  async findByChecksum(checksum: string): Promise<VisualReference | null> {
    return this.fallback.findByChecksum(checksum);
  }

  async getAll(): Promise<VisualReference[]> {
    return this.fallback.getAll();
  }

  async getApprovedReferences(): Promise<VisualReference[]> {
    return this.fallback.getApprovedReferences();
  }

  async search(filters: ImageLibrarySearchFilters): Promise<PaginationResult<VisualReference>> {
    return this.fallback.search(filters);
  }

  async save(reference: VisualReference): Promise<VisualReference> {
    return this.fallback.save(reference);
  }

  async update(id: string, updates: Partial<VisualReference>): Promise<VisualReference> {
    return this.fallback.update(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return this.fallback.delete(id);
  }
}
