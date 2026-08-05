import type { ImageLibrarySearchFilters, PaginationResult, VisualReference } from '../models/visual-reference.model';

export interface IImageLibraryRepository {
  findById(id: string): Promise<VisualReference | null>;
  findByChecksum(checksum: string): Promise<VisualReference | null>;
  search(filters: ImageLibrarySearchFilters): Promise<PaginationResult<VisualReference>>;
  getAll(): Promise<VisualReference[]>;
  getApprovedReferences(): Promise<VisualReference[]>;
  save(reference: VisualReference): Promise<VisualReference>;
  update(id: string, updates: Partial<VisualReference>): Promise<VisualReference>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
