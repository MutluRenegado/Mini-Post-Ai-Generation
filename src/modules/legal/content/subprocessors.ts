import { LegalDocument } from '../types/legalDocument.types';

export const SUBPROCESSORS_DOC: LegalDocument = {
  id: 'subprocessors-directory',
  slug: 'subprocessors',
  title: 'Subprocessors Directory',
  subtitle: 'Transparent directory of verified third-party cloud infrastructure, AI, and billing subprocessors.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Active subprocessors directory for Mini Post App.',
  relatedDocSlugs: ['privacy', 'data-processing-agreement', 'security-disclosure'],
  sections: [
    {
      id: 'active-vendors',
      title: '1. Verified Vendor Directory',
      content: `Mini Post App utilizes the following third-party infrastructure, service, and media vendors:

Infrastructure & Hosting:
- Google Cloud Platform / Firebase (USA / EU): Database, Authentication, Storage, App Hosting.

Payments:
- Stripe, Inc. (USA): Payment Processing & Subscription Billing.

AI & Content Processing:
- Google Gemini AI (USA): AI Text Generation & Prompt Adaptation.
- Pollinations.ai (Distributed Fallback): Fallback AI Image Rendering & Text Generation.

Social Publishing:
- Post Proxy (USA): Multi-Channel Social OAuth & Publishing Gateway.

External Media Providers:
- Pexels: Stock Photo Search & Media Library Import (Implemented).
- Pixabay: Stock Media & Illustration Search (Planned).
- Unsplash: High-Resolution Photo Search & Asset Tracking (Partial / Planned).

Independent Platforms:
- Meta, LinkedIn, X, TikTok, YouTube, Telegram, Bluesky, Pinterest, Google Business Profile (Independent Controllers).`,
    },
    {
      id: 'vendor-updates',
      title: '2. Subprocessor Updates & Notification',
      content: `We update this directory when onboarding new subprocessor vendors. Enterprise customers may subscribe to vendor update notifications by contacting support@minipostapp.space.`,
    },
  ],
};
