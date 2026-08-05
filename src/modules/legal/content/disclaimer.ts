import { LegalDocument } from '../types/legalDocument.types';

export const DISCLAIMER_DOC: LegalDocument = {
  id: 'general-disclaimer',
  slug: 'disclaimer',
  title: 'General Disclaimer',
  subtitle: 'Platform liability disclaimers, AI content generation disclaimers, and service availability notices.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'General Disclaimer and liability disclosures for Mini Post App.',
  relatedDocSlugs: ['terms', 'ai-content-disclaimer', 'responsible-ai'],
  sections: [
    {
      id: 'platform-disclaimer',
      title: '1. Service Provided "As-Is"',
      content: `Mini Post App and all associated services are provided on an "as-is" and "as-available" basis without warranties of any kind, whether express or implied.`,
    },
    {
      id: 'ai-disclaimer-summary',
      title: '2. AI Output & Publishing Disclaimer',
      content: `Content generated via Google Gemini AI or image pipelines is intended for creative assistance. Users are solely responsible for reviewing, editing, and verifying all content before publishing to external social media networks.`,
    },
  ],
};
