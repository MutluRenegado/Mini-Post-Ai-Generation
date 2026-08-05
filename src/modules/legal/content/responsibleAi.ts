import { LegalDocument } from '../types/legalDocument.types';

export const RESPONSIBLE_AI_DOC: LegalDocument = {
  id: 'responsible-ai-notice',
  slug: 'responsible-ai',
  title: 'Responsible AI Notice',
  subtitle: 'Responsible AI principles, human oversight, safety guardrails, and transparency in prompt engineering.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Responsible AI Notice for Mini Post App.',
  relatedDocSlugs: ['ai-content-disclaimer', 'disclaimer', 'acceptable-use'],
  sections: [
    {
      id: 'ai-principles',
      title: '1. Responsible AI Principles',
      content: `Our AI architecture integrates core principles of responsible AI:
- Human Control: Users maintain final decision-making authority over all generated copy and images.
- Transparency: AI generation endpoints are clearly labeled throughout the Creator Studio.
- Safety Guardrails: Prompt filters prevent generation of abusive or harmful content.`,
    },
    {
      id: 'continuous-improvement',
      title: '2. Alignment & Continuous Oversight',
      content: `We continuously refine our prompt frameworks and Gemini Flash integration to reduce bias, improve output quality, and adhere to social platform community guidelines.`,
    },
  ],
};
