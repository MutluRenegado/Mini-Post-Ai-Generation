import { LegalDocument } from '../types/legalDocument.types';

export const PRIVACY_POLICY_DOC: LegalDocument = {
  id: 'privacy-policy',
  slug: 'privacy',
  title: 'Privacy Policy',
  subtitle: 'Canonical Privacy Policy governing personal data collection, processing, user rights, and data protection for Mini Post App.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Read the official Privacy Policy of Mini Post App, operated by Yoga Products Top Limited.',
  relatedDocSlugs: ['terms', 'cookies', 'gdpr', 'data-processing-agreement'],
  sections: [
    {
      id: 'entity-and-scope',
      title: '1. Operating Entity & Scope',
      content: `Mini Post App is owned and operated by Yoga Products Top Limited ("we", "us", or "our"). This Privacy Policy describes how we collect, process, store, and safeguard your personal information when you access or use our web application located at minipostapp.space and associated services.`,
    },
    {
      id: 'data-collection',
      title: '2. Information We Collect',
      content: `We collect information necessary to provide multi-channel content creation and publishing workflows:
- Account Data: Email address and authentication credentials managed securely via Firebase Authentication.
- Social Channel Tokens: OAuth access tokens for Facebook, Instagram, LinkedIn, X, TikTok, and YouTube required to publish content on your behalf.
- Workspace & Prompt Data: User-created post drafts, prompt templates, brand kit preferences, and scheduling settings.
- Technical & Usage Data: IP address, browser user-agent, session identifiers, and error logs collected for system security and operational integrity.`,
    },
    {
      id: 'processing-purposes',
      title: '3. How We Use Your Information',
      content: `Your data is used strictly for:
- Authenticating users and maintaining active studio sessions.
- Generating social post text and images via Google Gemini AI and rendering APIs.
- Transmitting approved posts to connected social channels.
- Providing customer support via support@minipostapp.space.
- Enforcing platform security, fraud prevention, and compliance.`,
    },
    {
      id: 'subprocessors-and-sharing',
      title: '4. Data Sharing & Subprocessors',
      content: `We do not sell your personal data. We share data only with verified subprocessors necessary to deliver product features:
- Google Cloud / Firebase (Authentication, Database, Hosting)
- Stripe (Subscription & Billing Processing)
- Google Gemini AI (AI Text & Prompt Generation)
- Pollinations.ai (AI Image Generation)
- Vercel (Web Hosting & Edge CDN)`,
    },
    {
      id: 'user-rights',
      title: '5. User Rights & Data Deletion',
      content: `You possess the right to access, rectify, port, or request permanent deletion of your personal data. You can submit an automated deletion request at minipostapp.space/data-deletion or contact deletion@minipostapp.space. Upon confirmation, OAuth tokens are revoked immediately, and user records are purged within 30 days.`,
    },
    {
      id: 'legal-disclaimer',
      title: '6. Document Review Status Notice',
      content: `This document is a draft version undergoing formal legal review. External platform requirements may change over time, and this policy is updated periodically to maintain alignment.`,
    },
  ],
};
