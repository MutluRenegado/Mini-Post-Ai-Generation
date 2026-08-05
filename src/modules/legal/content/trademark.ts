import { LegalDocument } from '../types/legalDocument.types';

export const TRADEMARK_DOC: LegalDocument = {
  id: 'trademark-policy',
  slug: 'trademark',
  title: 'Trademark Policy',
  subtitle: 'Brand asset usage rules, trademark boundaries, and third-party platform mark references.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Trademark Policy for Mini Post App.',
  relatedDocSlugs: ['copyright', 'terms'],
  sections: [
    {
      id: 'brand-marks',
      title: '1. Brand Assets & Trademark Usage',
      content: `The "Mini Post App" name, wordmark, logo ('Logoblackbackground.png'), and associated brand assets are trademarks of Yoga Products Top Limited. Unapproved commercial use is strictly prohibited.`,
    },
    {
      id: 'third-party-marks',
      title: '2. Third-Party Platform Trademarks',
      content: `Facebook, Instagram, Meta, LinkedIn, X, TikTok, Pinterest, YouTube, and Google are trademarks of their respective owners. Reference to third-party marks in Mini Post App indicates channel integration compatibility and does not imply sponsorship or endorsement.`,
    },
  ],
};
