import type { VisualReference } from '../../library/domain/visual-reference.model';
import type { IImageLibraryRepository } from '../../library/repositories/image-library-repository.interface';
import { MetadataQueryBuilder } from './MetadataQueryBuilder';
import { CandidateFilter, FilterResult } from './CandidateFilter';
import type { VisualReferenceQuery, NormalizedQuery } from './retrieval.types';

export interface RetrievalResult {
  normalizedQuery: NormalizedQuery;
  eligibleCandidates: VisualReference[];
  excludedCandidates: { reference: VisualReference; reason: string }[];
  totalInspected: number;
}

export class VisualReferenceRetriever {
  private repo: IImageLibraryRepository;

  constructor(repository: IImageLibraryRepository) {
    this.repo = repository;
  }

  /**
   * Executes METADATA-BASED VISUAL RETRIEVAL against reviewed metadata.
   * Does NOT generate embeddings, call AI vision models, or pretend to perform semantic search.
   */
  async retrieveCandidates(query: VisualReferenceQuery): Promise<RetrievalResult> {
    const normalizedQuery = MetadataQueryBuilder.buildNormalizedQuery(query);

    // Fetch candidate pool from repository
    const allApproved = await this.repo.getApprovedReferences();
    const totalInspected = allApproved.length;

    const filterResult: FilterResult = CandidateFilter.filterCandidates(allApproved, normalizedQuery);

    return {
      normalizedQuery,
      eligibleCandidates: filterResult.eligibleCandidates,
      excludedCandidates: filterResult.excludedCandidates,
      totalInspected,
    };
  }
}
