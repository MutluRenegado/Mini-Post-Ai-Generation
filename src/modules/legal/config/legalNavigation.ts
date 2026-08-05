import { LegalNavGroup } from '../types/legalNavigation.types';

export const LEGAL_NAVIGATION_GROUPS: LegalNavGroup[] = [
  {
    groupKey: 'core',
    groupLabel: 'Core Legal Terms',
    items: [
      { label: 'Legal Center Overview', href: '/legal', description: 'Central legal index & document directory' },
      { label: 'Privacy Policy', href: '/legal/privacy', description: 'Personal data handling & user rights' },
      { label: 'Terms of Service', href: '/legal/terms', description: 'Master user contract & platform terms' },
      { label: 'Cookie Policy', href: '/legal/cookies', description: 'Essential session cookies & disclosures' },
      { label: 'GDPR Information', href: '/legal/gdpr', description: 'EU data subject rights & DSAR requests' },
    ],
  },
  {
    groupKey: 'data',
    groupLabel: 'Data & Rights',
    items: [
      { label: 'Data Processing Agreement', href: '/legal/data-processing-agreement', description: 'Business customer DPA terms' },
      { label: 'Data Deletion Request', href: '/data-deletion', description: 'Interactive erasure & token revocation', badge: 'Active Form' },
      { label: 'Subprocessors Directory', href: '/legal/subprocessors', description: 'Third-party cloud & AI vendor directory' },
      { label: 'Data Retention Policy', href: '/legal/data-retention', description: 'Operational data storage & purge rules' },
      { label: 'Legal Requests', href: '/legal/legal-requests', description: 'Formal inquiry & DSAR submission guide' },
    ],
  },
  {
    groupKey: 'policies',
    groupLabel: 'Policies & Disclaimers',
    items: [
      { label: 'Acceptable Use Policy', href: '/legal/acceptable-use', description: 'Prohibited behaviors & platform rules' },
      { label: 'AI Content Disclaimer', href: '/legal/ai-content-disclaimer', description: 'AI generation limits & user review requirements' },
      { label: 'Copyright Policy', href: '/legal/copyright', description: 'Intellectual property & DMCA inquiries' },
      { label: 'Trademark Policy', href: '/legal/trademark', description: 'Brand assets & mark usage guidelines' },
      { label: 'General Disclaimer', href: '/legal/disclaimer', description: 'Platform liability & service disclaimers' },
    ],
  },
  {
    groupKey: 'trust',
    groupLabel: 'Trust & Safety',
    items: [
      { label: 'Accessibility Statement', href: '/legal/accessibility', description: 'WCAG 2.2 AA accessibility alignment' },
      { label: 'Security Disclosure', href: '/legal/security-disclosure', description: 'Security vulnerability reporting & controls' },
      { label: 'Responsible AI Notice', href: '/legal/responsible-ai', description: 'AI safety principles & human oversight' },
    ],
  },
];
