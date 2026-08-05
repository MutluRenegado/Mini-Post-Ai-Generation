import type {
  VisualReference,
  ImageLibrarySearchFilters,
  PaginationResult,
} from '../domain/visual-reference.model';
import type { IImageLibraryRepository } from '../repositories/image-library-repository.interface';

export class SearchEngine {
  private repo: IImageLibraryRepository;

  constructor(repository: IImageLibraryRepository) {
    this.repo = repository;
  }

  async search(filters: ImageLibrarySearchFilters): Promise<PaginationResult<VisualReference>> {
    return this.repo.search(filters);
  }
}
