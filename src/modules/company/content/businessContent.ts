import { COMPANY_FACTS } from '../config/companyFacts';

export const PARTNERS_PAGE_CONTENT = {
  hero: {
    badge: 'PARTNERSHIP PROGRAM',
    title: 'Partnering With Mini Post App',
    subtitle: 'We collaborate with agency networks, creator communities, and social media platforms to help creators scale.',
  },
  process: [
    { step: '01', title: 'Submit Proposal', desc: `Send your partnership inquiry to ${COMPANY_FACTS.supportEmail} with your company details.` },
    { step: '02', title: 'Evaluation', desc: 'Our business team reviews partnership alignments individually within 2 business days.' },
    { step: '03', title: 'Integration', desc: 'Custom partner access, co-marketing opportunities, or custom agency workflows.' },
  ],
};

export const AFFILIATE_PAGE_CONTENT = {
  hero: {
    badge: 'AFFILIATE PROGRAM',
    title: 'Affiliate & Partner Referral Program',
    subtitle: 'Earn rewards for introducing creators, agencies, and solopreneurs to Mini Post App.',
  },
  emptyState: {
    title: 'Affiliate Program Currently In Preparation',
    description: 'Our formal affiliate and referral tracking system is currently under development. To receive notification when referral registration opens, contact support@minipostapp.space.',
  },
};

export const CASE_STUDIES_PAGE_CONTENT = {
  hero: {
    badge: 'CASE STUDIES',
    title: 'Real Impact & Publishing Workflows',
    subtitle: 'In-depth analyses showing how creators and agencies save hours weekly with Mini Post App.',
  },
  emptyState: {
    title: 'Case Studies Currently In Preparation',
    description: 'We are conducting formal workflow efficiency studies with active agency and creator users. Verified case study reports will be published here upon completion.',
  },
};

export const CUSTOMER_STORIES_PAGE_CONTENT = {
  hero: {
    badge: 'CUSTOMER STORIES',
    title: 'Creator & Solopreneur Spotlights',
    subtitle: 'Discover how creators, coaches, and small business owners build their brands across social networks.',
  },
  emptyState: {
    title: 'Customer Stories Coming Soon',
    description: 'Creator spotlights and video interviews are currently being compiled. If you are an active user interested in featuring your publishing workflow, email support@minipostapp.space.',
  },
};
