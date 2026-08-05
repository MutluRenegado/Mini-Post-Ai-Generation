import { LegalDocument } from '../types/legalDocument.types';

export const SECURITY_DISCLOSURE_DOC: LegalDocument = {
  id: 'security-disclosure',
  slug: 'security-disclosure',
  title: 'Security Disclosure',
  subtitle: 'Technical security controls, AES-256 token encryption, TLS 1.3, and vulnerability disclosure guidelines.',
  effectiveDate: 'August 1, 2026',
  lastUpdated: 'August 2, 2026',
  version: 'v2.4.0',
  reviewStatus: 'DRAFT FOR REVIEW',
  metaDescription: 'Security Disclosure for Mini Post App.',
  relatedDocSlugs: ['privacy', 'subprocessors', 'legal-requests'],
  sections: [
    {
      id: 'security-controls',
      title: '1. Technical Security Controls',
      content: `Mini Post App enforces robust security practices across infrastructure and application layers:
- Token Encryption: OAuth access tokens stored using AES-256 vault encryption.
- Transport Layer: All traffic encrypted in transit using TLS 1.3 protocols.
- Authentication: Secure session tokens and multi-factor authentication supported via Firebase Auth.`,
    },
    {
      id: 'vulnerability-reporting',
      title: '2. Vulnerability Reporting & Disclosure',
      content: `Security researchers and users can submit vulnerability findings to support@minipostapp.space. Submissions are acknowledged within 48 hours. Please refrain from destructive testing or data modification.`,
    },
  ],
};
