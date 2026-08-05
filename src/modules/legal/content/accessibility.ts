import { LegalDocument } from '../types/legalDocument.types';

export const ACCESSIBILITY_STATEMENT_DOC: LegalDocument = {
  id: 'accessibility-statement',
  slug: 'accessibility',
  title: 'Accessibility Statement',
  subtitle: 'Commitment to digital accessibility, WCAG 2.2 AA alignment, and inclusive user experience.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Accessibility Statement for Mini Post App.',
  relatedDocSlugs: ['terms', 'responsible-ai'],
  sections: [
    {
      id: 'commitment',
      title: '1. Accessibility Commitment',
      content: `Yoga Products Top Limited is committed to ensuring digital accessibility for people of all abilities. We continuously improve the user experience for Mini Post App and apply relevant accessibility standards.`,
    },
    {
      id: 'target-standard',
      title: '2. Target Standard Alignment',
      content: `Our web application is designed with reference to Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. Key features include high contrast ratios (>12:1), visible focus indicators, programmatic form labels, and full keyboard navigation.`,
    },
    {
      id: 'feedback-channel',
      title: '3. Accessibility Feedback',
      content: `We welcome feedback on the accessibility of Mini Post App. If you encounter accessibility barriers, please email support@minipostapp.space.`,
    },
  ],
};
