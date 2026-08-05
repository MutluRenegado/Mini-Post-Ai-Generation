import { LegalDocument } from '../types/legalDocument.types';

export const AI_CONTENT_DISCLAIMER_DOC: LegalDocument = {
  id: 'ai-content-disclaimer',
  slug: 'ai-content-disclaimer',
  title: 'AI Content Disclaimer',
  subtitle: 'Disclosures regarding AI text & image generation, user review obligations, and third-party platform rules.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'AI Content Disclaimer for Mini Post App.',
  relatedDocSlugs: ['responsible-ai', 'disclaimer', 'terms'],
  sections: [
    {
      id: 'ai-limitations',
      title: '1. AI Generation Nature & Limitations',
      content: `Mini Post App utilizes Google Gemini AI Flash and image rendering APIs to generate text and visual content. AI models produce output based on probabilistic algorithms and may occasionally generate inaccurate, incomplete, or inappropriate suggestions.`,
    },
    {
      id: 'user-review-obligation',
      title: '2. Mandatory User Review Requirement',
      content: `Users are strictly obligated to review and verify all AI-generated copy, hashtags, and images prior to publishing to external social media platforms. Users assume full responsibility for final publication decisions.`,
    },
  ],
};
