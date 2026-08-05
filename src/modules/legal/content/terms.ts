import { LegalDocument } from '../types/legalDocument.types';

export const TERMS_OF_SERVICE_DOC: LegalDocument = {
  id: 'terms-of-service',
  slug: 'terms',
  title: 'Terms of Service',
  subtitle: 'Canonical Terms of Service agreement governing platform access, subscription billing, acceptable use, and AI-assisted publishing.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Official Terms of Service contract for Mini Post App, operated by Yoga Products Top Limited.',
  relatedDocSlugs: ['privacy', 'acceptable-use', 'ai-content-disclaimer', 'disclaimer'],
  sections: [
    {
      id: 'agreement-and-entity',
      title: '1. Agreement & Operating Entity',
      content: `By accessing or using Mini Post App (minipostapp.space), operated by Yoga Products Top Limited, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not access or use the platform.`,
    },
    {
      id: 'account-and-access',
      title: '2. User Accounts & Responsibilities',
      content: `You are responsible for maintaining the confidentiality of your account login credentials and for all activities conducted under your account. You must notify support@minipostapp.space immediately of any unauthorized account access.`,
    },
    {
      id: 'ai-and-publishing',
      title: '3. AI Generation & Multi-Channel Publishing',
      content: `Mini Post App integrates Google Gemini AI and rendering pipelines to assist in crafting social media content. You retain ownership of your submitted prompt inputs and generated outputs. You acknowledge that AI outputs must be reviewed for accuracy, brand alignment, and platform compliance before publishing.`,
    },
    {
      id: 'billing-and-subscriptions',
      title: '4. Subscriptions & Billing Terms',
      content: `Subscription billing is processed securely via Stripe. Paid plans (Pro Creator, Studio & Agency) renew automatically until canceled through your billing portal. Subscription cancellations take effect at the end of the current billing cycle.`,
    },
    {
      id: 'acceptable-use-summary',
      title: '5. Acceptable Use & Prohibited Conduct',
      content: `You agree not to use Mini Post App to generate or publish illegal, abusive, defamatory, harassing, or trademark-infringing content, or to bypass social platform rate limits or API terms.`,
    },
    {
      id: 'limitation-of-liability',
      title: '6. Limitation of Liability',
      content: `To the maximum extent permitted by law, Yoga Products Top Limited shall not be liable for any indirect, incidental, consequential, or punitive damages resulting from your use of the platform or publication of content to third-party social networks.`,
    },
  ],
};
