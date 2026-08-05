import { LegalDocument } from '../types/legalDocument.types';

export const GDPR_DOC: LegalDocument = {
  id: 'gdpr-information',
  slug: 'gdpr',
  title: 'GDPR Rights & EU Compliance',
  subtitle: 'EU General Data Protection Regulation rights, data subject access requests (DSAR), and erasure workflows.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'EU GDPR rights and Data Subject Access Request (DSAR) information for Mini Post App.',
  relatedDocSlugs: ['privacy', 'data-processing-agreement', 'data-retention'],
  sections: [
    {
      id: 'data-subject-rights',
      title: '1. Your EU Data Subject Rights',
      content: `Under the GDPR, European Union users possess specific rights regarding personal data:
- Right of Access: Request a copy of personal data processed by Mini Post App.
- Right to Rectification: Correct inaccurate or incomplete profile records.
- Right to Erasure (Right to be Forgotten): Request permanent account and token deletion via minipostapp.space/data-deletion.
- Right to Data Portability: Export workspace post drafts and brand configurations.
- Right to Restrict & Object: Object to processing based on legitimate interests.`,
    },
    {
      id: 'dsar-submission',
      title: '2. Submitting a Data Subject Access Request',
      content: `To submit a formal DSAR, email deletion@minipostapp.space or support@minipostapp.space. Requests are acknowledged within 72 hours and processed without undue delay within 30 calendar days.`,
    },
  ],
};
