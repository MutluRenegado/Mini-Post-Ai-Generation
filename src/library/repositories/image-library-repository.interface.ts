import type {
  VisualReference,
  ImageLibrarySearchFilters,
  PaginationResult,
} from '../domain/visual-reference.model';

export interface IImageLibraryRepository {
  findById(id: string): Promise<VisualReference | null>;
  findByChecksum(checksum: string): Promise<VisualReference | null>;
  getAll(): Promise<VisualReference[]>;
  getApprovedReferences(): Promise<VisualReference[]>;
  search(filters: ImageLibrarySearchFilters): Promise<PaginationResult<VisualReference>>;
  save(reference: VisualReference): Promise<VisualReference>;
  update(id: string, updates: Partial<VisualReference>): Promise<VisualReference>;
  delete(id: string): Promise<boolean>;
}
