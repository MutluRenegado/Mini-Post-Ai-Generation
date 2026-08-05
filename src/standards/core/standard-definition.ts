export type StandardSourceType =
  | 'INTERNAL'
  | 'INTERNATIONAL_REFERENCE'
  | 'INDUSTRY_REFERENCE'
  | 'PLATFORM_REFERENCE'
  | 'LEGAL_REFERENCE';

export type StandardStatus =
  | 'DRAFT'
  | 'REVIEW_REQUIRED'
  | 'ACTIVE'
  | 'DEPRECATED'
  | 'ARCHIVED'
  | 'BLOCKED';

export type StandardSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type StandardAlignmentStatus =
  | 'FULLY_ALIGNED'
  | 'SUBSTANTIALLY_ALIGNED'
  | 'PARTIALLY_ALIGNED'
  | 'PROVISIONALLY_ALIGNED'
  | 'NOT_ALIGNED'
  | 'NOT_APPLICABLE'
  | 'REVIEW_REQUIRED';

export interface AlignmentRecord {
  frameworkId: string;
  frameworkName: string;
  frameworkEdition: string;
  mappedPrincipleOrControl: string;
  alignmentRationale: string;
  evidence: string;
  alignmentStatus: StandardAlignmentStatus;
  lastAlignmentReview: string;
  nextAlignmentReview: string;
  alignmentOwner: string;
  conflicts?: string[];
  exceptions?: string[];
}

export interface StandardDefinition {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  mediaType?: 'text' | 'image' | 'video' | 'audio' | 'multimodal' | 'layout' | 'system';
  sourceType: StandardSourceType;
  version: string;
  status: StandardStatus;
  owner: string;
  purpose: string;
  scope: string;
  appliesTo: string[];
  rules: string[];
  validationCriteria: string[];
  acceptanceCriteria: string[];
  rejectionCriteria: string[];
  warnings?: string[];
  severity: StandardSeverity;
  dependencies?: string[];
  references?: string[];
  alignmentRecords: AlignmentRecord[];
  isPublic: boolean;
  publicSummary: string;
  implementationSummary: string;
  effectiveDate: string;
  reviewedDate: string;
  reviewFrequency: string;
  deprecated?: boolean;
  replacementId?: string;
  validatorId?: string;
  tags?: string[];
}
