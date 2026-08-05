import { LegalDocument } from '../types/legalDocument.types';

export const DPA_DOC: LegalDocument = {
  id: 'data-processing-agreement',
  slug: 'data-processing-agreement',
  title: 'Data Processing Agreement (DPA)',
  subtitle: 'Standard Data Processing Addendum for business and enterprise customers using Mini Post App.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Data Processing Agreement (DPA) terms for Mini Post App, operated by Yoga Products Top Limited.',
  relatedDocSlugs: ['privacy', 'gdpr', 'subprocessors'],
  sections: [
    {
      id: 'dpa-scope',
      title: '1. Scope & Applicable Terms',
      content: `This Data Processing Agreement ("DPA") governs the processing of customer personal data by Yoga Products Top Limited on behalf of enterprise customers using Mini Post App to manage multi-channel social publishing.`,
    },
    {
      id: 'dpa-security-and-subprocessors',
      title: '2. Technical Security & Subprocessor Management',
      content: `We implement AES-256 vault encryption for OAuth tokens and TLS 1.3 in-transit encryption. Subprocessors (Google Cloud, Stripe, Gemini AI) are maintained under strict data protection agreements.`,
    },
    {
      id: 'legal-review-note',
      title: '3. Legal Review Notice',
      content: `This DPA is a draft for business review. Executed copies for enterprise contracts may be requested by emailing support@minipostapp.space.`,
    },
  ],
};
