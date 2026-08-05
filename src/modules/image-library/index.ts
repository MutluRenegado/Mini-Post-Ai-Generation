// Canonical Public API for Image Library Module

export type {
  VisualReference,
  ReviewStatus,
  SourceType,
  SourceAvailability,
  ClassificationState,
  AssetMode,
  RightsRecord,
  ReviewRecord,
  DuplicateMatch,
  DuplicateClassificationType,
  ImageLibrarySearchFilters,
  PaginationResult,
  ComponentScores,
  RankingResult,
} from './models/visual-reference.model';

export type { IImageLibraryRepository } from './repositories/image-library-repository.interface';
export { FirestoreImageLibraryRepository } from './repositories/firestore-image-library.repository';

export { ImageLibraryAdminService } from './services/image-library-admin.service';
export { ApprovedReferenceReader } from './adapters/approved-reference-reader';
export type {
  ApprovedReferenceQuery,
  ApprovedReferenceResult,
  ApprovedReferenceResponse,
} from './adapters/approved-reference-reader';

// Technical metadata helper (browser-safe)
export { MetadataExtractor } from './importer/metadata-extractor';

// Phase 2 Runtime Exports
export { VisualRankingService } from './runtime/visual-ranking.service';
export { DiversityController } from './runtime/diversity-controller';
export { VisualReferenceResolver } from './runtime/visual-reference-resolver';
export type {
  VisualResolverInput,
  VisualResolverOutput,
  ReferenceEnrichmentData,
} from './runtime/visual-reference-resolver';

export { ImageLibraryPage } from './pages/ImageLibraryPage';
