export type LegalReviewStatus = 'DRAFT FOR REVIEW' | 'PENDING LEGAL REVIEW' | 'APPROVED';

export interface LegalSectionItem {
  id: string;
  title: string;
  content: string;
  subsections?: { title: string; content: string }[];
}

export interface LegalDocument {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  reviewStatus: LegalReviewStatus;
  metaDescription: string;
  sections: LegalSectionItem[];
  relatedDocSlugs: string[];
}
