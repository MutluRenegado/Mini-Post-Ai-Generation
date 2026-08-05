import { LegalDocument } from '../types/legalDocument.types';

export const ACCEPTABLE_USE_DOC: LegalDocument = {
  id: 'acceptable-use-policy',
  slug: 'acceptable-use',
  title: 'Acceptable Use Policy',
  subtitle: 'Rules governing platform conduct, prohibited content categories, and API rate limit compliance.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Acceptable Use Policy for Mini Post App.',
  relatedDocSlugs: ['terms', 'ai-content-disclaimer', 'copyright'],
  sections: [
    {
      id: 'prohibited-activities',
      title: '1. Prohibited Platform Activities',
      content: `Users of Mini Post App must not:
- Generate or transmit illegal, abusive, hateful, defamatory, or harassing material.
- Circumvent platform rate limits, API quotas, or security mechanisms.
- Attempt unauthorized access to account data or connected social tokens belonging to other users.
- Use automated scripts to abuse AI generation endpoints or flood social network APIs.`,
    },
    {
      id: 'enforcement',
      title: '2. Account Suspension & Enforcement',
      content: `Violations of this policy may result in immediate workspace suspension or account termination without refund. Inquiries may be directed to support@minipostapp.space.`,
    },
  ],
};
