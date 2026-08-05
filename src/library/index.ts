// Standalone Visual Intelligence Platform — Core Image Library Engine (Phase 2A)

export type {
  VisualReference,
  ReviewStatus,
  SourceType,
  SourceAvailability,
  ClassificationState,
  DuplicateMatch,
  DuplicateClassificationType,
  RightsRecord,
  ReviewRecord,
  QualityScores,
  AuditLogEntry,
  ImageLibrarySearchFilters,
  PaginationResult,
} from './domain/visual-reference.model';

export { RightsRecordSchema, ReviewRecordSchema, QualityScoresSchema, MetadataUpdateSchema } from './domain/visual-reference.schema';

export type { IImageLibraryRepository } from './repositories/image-library-repository.interface';
export { FirestoreImageLibraryRepository } from './repositories/firestore-image-library.repository';
export { InMemoryImageLibraryRepository } from './repositories/in-memory-image-library.repository';

export { MetadataExtractor } from './ingestion/metadata-extractor';

export { RightsManager } from './review/rights-manager';
export { ReviewWorkflow } from './review/review-workflow';

export { SearchEngine } from './search/search-engine';
export { BatchOperations } from './search/batch-operations';
