import { LegalDocument } from '../types/legalDocument.types';

export const COOKIE_POLICY_DOC: LegalDocument = {
  id: 'cookie-policy',
  slug: 'cookies',
  title: 'Cookie Policy',
  subtitle: 'Transparent disclosures regarding essential cookies, session storage, and local authentication tokens.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Read the official Cookie Policy for Mini Post App.',
  relatedDocSlugs: ['privacy', 'terms', 'gdpr'],
  sections: [
    {
      id: 'cookie-types',
      title: '1. Cookies & Storage We Use',
      content: `Mini Post App uses essential cookies and local browser storage strictly required for platform functionality:
- Essential Session Cookies: Maintains secure user authentication state via Firebase Auth.
- Functional Preferences: Remembers workspace layouts, active studio tab selections, and dark mode theme options.
- Security Tokens: Protects client-server API requests against CSRF attacks.`,
    },
    {
      id: 'no-third-party-tracking',
      title: '2. No Cross-Site Tracking',
      content: `We do not use non-essential third-party advertising cookies or cross-site tracking cookies.`,
    },
    {
      id: 'browser-controls',
      title: '3. Managing Cookie Preferences',
      content: `You can control or clear cookies directly through your browser settings. Note that disabling essential session cookies will prevent you from signing in to the Creator Studio.`,
    },
  ],
};
