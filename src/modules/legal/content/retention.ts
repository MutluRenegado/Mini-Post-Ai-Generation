import { LegalDocument } from '../types/legalDocument.types';

export const DATA_RETENTION_DOC: LegalDocument = {
  id: 'data-retention-policy',
  slug: 'data-retention',
  title: 'Data Retention Policy',
  subtitle: 'Operational rules governing account record storage, OAuth token lifecycles, and deletion purge schedules.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Data Retention Policy for Mini Post App.',
  relatedDocSlugs: ['privacy', 'gdpr', 'data-deletion'],
  sections: [
    {
      id: 'retention-principles',
      title: '1. Operational Retention Principles',
      content: `Mini Post App retains personal data and connected workspace assets only as long as necessary to provide service, fulfill contractual obligations, or comply with applicable legal requirements.`,
    },
    {
      id: 'purge-schedules',
      title: '2. Account Deletion & Token Purge Schedule',
      content: `- Active Accounts: Data retained while account remains active.
- OAuth Tokens: Revoked immediately upon account disconnection or explicit deletion request.
- Erasure Requests: Account records and workspace data permanently purged within 30 days of confirmed deletion request via minipostapp.space/data-deletion.`,
    },
  ],
};
