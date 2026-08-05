export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_CHANGES' | 'ARCHIVED';

export type SourceType =
  | 'Internal Upload'
  | 'Licensed External'
  | 'Imported Folder';

export type SourceAvailability = 'AVAILABLE' | 'MISSING' | 'REMOVED_FROM_SOURCE';

export type ClassificationState = 'UNREVIEWED' | 'SUGGESTED' | 'MANUALLY_REVIEWED';

export type DuplicateClassificationType = 'EXACT_DUPLICATE' | 'NEAR_DUPLICATE' | 'POSSIBLE_DUPLICATE';

export interface DuplicateMatch {
  classification: DuplicateClassificationType;
  existingId: string;
  existingTitle: string;
  existingThumbnailPath?: string;
  existingStoragePath?: string;
  similarityScore: number; // 0 to 1, where 1 is identical
  reason: string;
}

export interface RightsRecord {
  rightsConfirmed: boolean;
  ownerId?: string;
  sourceProvider: string;
  licenceType: string;
  attributionRequired: boolean;
  attributionText?: string;
  sourceUrl?: string;
  commercialUseReviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_APPLICABLE';
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ReviewRecord {
  status: ReviewStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  reviewerNotes?: string;
}

export interface QualityScores {
  relevanceScore?: number;
  realismScore?: number;
  compositionScore?: number;
  technicalQualityScore?: number;
  overallQualityScore?: number;
}

export interface AuditLogEntry {
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export interface VisualReference {
  id: string;
  title: string;
  caption?: string;
  description?: string;

  sourceType: SourceType;
  sourceProvider: string;
  sourceAvailability: SourceAvailability;
  relativeSourcePath?: string;
  originalFileName: string;
  storagePath: string;
  thumbnailPath: string;
  mimeType: string;
  fileSizeBytes: number;

  checksum: string; // SHA-256
  perceptualHash: string; // dHash

  width: number;
  height: number;
  aspectRatio: string;
  orientation: 'landscape' | 'portrait' | 'square';

  // Taxonomy & Classification (UNREVIEWED, SUGGESTED, or MANUALLY_REVIEWED)
  topic?: string;
  industry?: string;
  category?: string;
  scene?: string;
  subjects?: string[];
  classificationState?: ClassificationState;

  // People & Roles
  peoplePresent?: boolean;
  peopleCount?: number;
  peopleDescription?: string;
  professionalRoles?: string[];
  actions?: string[];

  // Objects & Environment
  objects?: string[];
  products?: string[];
  devices?: string[];
  documents?: string[];
  environment?: string;

  // Visual Style
  photographyStyle?: string;
  realismLevel?: string;
  mood?: string;
  lighting?: string;
  cameraAngle?: string;
  composition?: string;
  colorPalette?: string[];

  // Quality & Rules
  qualityScores?: QualityScores;
  mustInclude?: string[];
  mustAvoid?: string[];

  // Rights & Review
  rights: RightsRecord;
  review: ReviewRecord;

  // Metadata Audit & Versioning
  createdAt: string;
  updatedAt: string;
  fileModifiedAt?: string;
  syncedAt?: string;
  version: number;
  usageCount: number;
  retrievalCount: number;
  lastUsedAt?: string;
  auditHistory?: AuditLogEntry[];
}

export interface ImageLibrarySearchFilters {
  query?: string;
  reviewStatus?: ReviewStatus | ReviewStatus[];
  rightsConfirmed?: boolean;
  sourceAvailability?: SourceAvailability;
  sourceType?: SourceType | SourceType[];
  industry?: string;
  topic?: string;
  scene?: string;
  photographyStyle?: string;
  aspectRatio?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'overallQualityScore';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
