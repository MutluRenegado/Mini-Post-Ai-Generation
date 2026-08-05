import { LegalDocument } from '../types/legalDocument.types';

export const LEGAL_REQUESTS_DOC: LegalDocument = {
  id: 'legal-requests-guide',
  slug: 'legal-requests',
  title: 'Legal Requests & Inquiries',
  subtitle: 'Submission guidelines for privacy requests, copyright notices, subpoena inquiries, and official legal correspondence.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Legal Requests submission guidelines for Mini Post App.',
  relatedDocSlugs: ['privacy', 'copyright', 'security-disclosure'],
  sections: [
    {
      id: 'submission-routes',
      title: '1. Official Submission Channels',
      content: `All formal legal notices, DSAR access requests, copyright takedowns, and legal inquiries must be submitted to verified support email addresses:
- Privacy & DSAR Requests: support@minipostapp.space / deletion@minipostapp.space
- Copyright & Trademark Notices: support@minipostapp.space
- Enterprise Compliance & Security Reports: support@minipostapp.space`,
    },
    {
      id: 'verification-process',
      title: '2. Identity Verification Requirement',
      content: `To protect user privacy, legal and data access requests require identity verification prior to disclosure or processing.`,
    },
  ],
};
