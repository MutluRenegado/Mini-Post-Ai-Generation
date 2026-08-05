import { LegalDocument } from '../types/legalDocument.types';

export const COPYRIGHT_DOC: LegalDocument = {
  id: 'copyright-policy',
  slug: 'copyright',
  title: 'Copyright Policy',
  subtitle: 'Intellectual property ownership guidelines, DMCA notice procedures, and copyright reporting routes.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Copyright Policy and DMCA reporting guidelines for Mini Post App.',
  relatedDocSlugs: ['trademark', 'terms', 'legal-requests'],
  sections: [
    {
      id: 'ownership',
      title: '1. Platform & User Content Ownership',
      content: `Mini Post App software, code, logos, and UI designs are protected by copyright owned by Yoga Products Top Limited. Users retain ownership of their original text copy and uploaded media assets.`,
    },
    {
      id: 'dmca-takedown',
      title: '2. Copyright Infringement & DMCA Notices',
      content: `If you believe content hosted or generated via Mini Post App infringes your copyright, submit a written notice containing your contact details and description of the work to support@minipostapp.space.`,
    },
  ],
};
