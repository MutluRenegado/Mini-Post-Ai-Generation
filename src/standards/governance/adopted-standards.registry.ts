export type AdoptionStatus =
  | 'ADOPTED'
  | 'PARTIALLY_ADOPTED'
  | 'UNDER_REVIEW'
  | 'PLANNED'
  | 'SUPERSEDED'
  | 'NOT_APPLICABLE'
  | 'REJECTED';

export type VerificationStatus =
  | 'VERIFIED'
  | 'PROVISIONAL'
  | 'REVIEW_REQUIRED'
  | 'OUTDATED'
  | 'UNKNOWN';

export interface AdoptedFrameworkRecord {
  id: string;
  name: string;
  organization: string;
  edition: string;
  publicationYear: number;
  domain: string;
  officialTitle: string;
  sourceType: 'INTERNATIONAL_REFERENCE' | 'INDUSTRY_REFERENCE' | 'PLATFORM_REFERENCE' | 'INTERNAL';
  applicability: string;
  adoptedStatus: AdoptionStatus;
  adoptionScope: string;
  relevantProducts: string[];
  relevantModules: string[];
  relevantWorkflows: string[];
  relevantInternalStandards: string[];
  owner: string;
  dateAdopted: string;
  lastReviewedDate: string;
  nextReviewDate: string;
  verificationStatus: VerificationStatus;
  notes: string;
}

export const ADOPTED_FRAMEWORKS_REGISTRY: AdoptedFrameworkRecord[] = [
  {
    id: 'ISO-42001',
    name: 'ISO/IEC 42001',
    organization: 'ISO / IEC',
    edition: '2023 Edition',
    publicationYear: 2023,
    domain: 'AI Governance',
    officialTitle: 'Information technology — Artificial intelligence — Management system',
    sourceType: 'INTERNATIONAL_REFERENCE',
    applicability: 'AI Management Systems & responsible AI governance',
    adoptedStatus: 'PARTIALLY_ADOPTED',
    adoptionScope: 'AI Text & Image generation oversight',
    relevantProducts: ['Mini Post App Creator Studio'],
    relevantModules: ['Standards Module', 'StudioOS'],
    relevantWorkflows: ['AI Text Generation', 'Visual Brief Generation'],
    relevantInternalStandards: ['ai-governance-standard', 'responsible-ai-standard'],
    owner: 'AI Governance Lead',
    dateAdopted: '2026-01-15',
    lastReviewedDate: '2026-08-01',
    nextReviewDate: '2026-11-01',
    verificationStatus: 'VERIFIED',
    notes: 'Informed by ISO 42001 management system principles.',
  },
  {
    id: 'ISO-23894',
    name: 'ISO/IEC 23894',
    organization: 'ISO / IEC',
    edition: '2023 Edition',
    publicationYear: 2023,
    domain: 'AI Risk Management',
    officialTitle: 'Information technology — Artificial intelligence — Guidance on risk management',
    sourceType: 'INTERNATIONAL_REFERENCE',
    applicability: 'AI risk assessment and prompt safety guardrails',
    adoptedStatus: 'PARTIALLY_ADOPTED',
    adoptionScope: 'Prompt safety filtering and output validation',
    relevantProducts: ['Mini Post App Creator Studio'],
    relevantModules: ['Standards Module', 'StudioOS'],
    relevantWorkflows: ['Prompt Generation', 'Output Validation'],
    relevantInternalStandards: ['risk-management-standard'],
    owner: 'Security & Risk Lead',
    dateAdopted: '2026-01-15',
    lastReviewedDate: '2026-08-01',
    nextReviewDate: '2026-11-01',
    verificationStatus: 'VERIFIED',
    notes: 'Informed by ISO 23894 AI risk management principles.',
  },
  {
    id: 'NIST-AI-RMF',
    name: 'NIST AI RMF',
    organization: 'NIST',
    edition: '1.0 Edition',
    publicationYear: 2023,
    domain: 'AI Risk Management',
    officialTitle: 'NIST Artificial Intelligence Risk Management Framework (AI RMF 1.0)',
    sourceType: 'INDUSTRY_REFERENCE',
    applicability: 'Trustworthy AI principles (Govern, Map, Measure, Manage)',
    adoptedStatus: 'PARTIALLY_ADOPTED',
    adoptionScope: 'Human control & transparency in AI publishing',
    relevantProducts: ['Mini Post App Creator Studio'],
    relevantModules: ['Standards Module'],
    relevantWorkflows: ['AI Text Generation', 'Image Prompt Validation'],
    relevantInternalStandards: ['human-oversight-standard', 'transparency-standard'],
    owner: 'AI Governance Lead',
    dateAdopted: '2026-01-15',
    lastReviewedDate: '2026-08-01',
    nextReviewDate: '2026-11-01',
    verificationStatus: 'VERIFIED',
    notes: 'Aligned with NIST AI RMF 1.0 trustworthy AI core functions.',
  },
  {
    id: 'ISO-25010',
    name: 'ISO/IEC 25010',
    organization: 'ISO / IEC',
    edition: '2023 Edition',
    publicationYear: 2023,
    domain: 'Software Quality',
    officialTitle: 'Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE)',
    sourceType: 'INTERNATIONAL_REFERENCE',
    applicability: 'Software quality model (Functional suitability, usability, reliability)',
    adoptedStatus: 'PARTIALLY_ADOPTED',
    adoptionScope: 'Quality gates and output validation criteria',
    relevantProducts: ['Mini Post App'],
    relevantModules: ['Standards Module', 'Validation Engine'],
    relevantWorkflows: ['Quality Gate Validation'],
    relevantInternalStandards: ['quality-gate-standard', 'output-validation-standard'],
    owner: 'Engineering Lead',
    dateAdopted: '2026-01-15',
    lastReviewedDate: '2026-08-01',
    nextReviewDate: '2026-11-01',
    verificationStatus: 'VERIFIED',
    notes: 'Informed by ISO 25010 software quality model.',
  },
  {
    id: 'WCAG-2.2',
    name: 'WCAG 2.2 AA',
    organization: 'W3C / WAI',
    edition: '2.2 Level AA',
    publicationYear: 2023,
    domain: 'Accessibility',
    officialTitle: 'Web Content Accessibility Guidelines (WCAG) 2.2',
    sourceType: 'INTERNATIONAL_REFERENCE',
    applicability: 'UI accessibility, color contrast, alt text, and keyboard navigation',
    adoptedStatus: 'ADOPTED',
    adoptionScope: 'Entire Mini Post App frontend and generated alt text',
    relevantProducts: ['Mini Post App Web Application'],
    relevantModules: ['Legal Module', 'Standards Module', 'Company Module'],
    relevantWorkflows: ['Public Pages', 'Creator Studio', 'Alt Text Generation'],
    relevantInternalStandards: ['accessibility-standard', 'accessibility-presentation-standard'],
    owner: 'Frontend Lead',
    dateAdopted: '2026-01-10',
    lastReviewedDate: '2026-08-01',
    nextReviewDate: '2026-11-01',
    verificationStatus: 'VERIFIED',
    notes: 'Aligned with WCAG 2.2 AA principles.',
  },
  {
    id: 'ISO-27001',
    name: 'ISO/IEC 27001',
    organization: 'ISO / IEC',
    edition: '2022 Edition',
    publicationYear: 2022,
    domain: 'Information Security',
    officialTitle: 'Information security, cybersecurity and privacy protection — Information security management systems',
    sourceType: 'INTERNATIONAL_REFERENCE',
    applicability: 'OAuth token encryption, transport security, access control',
    adoptedStatus: 'PARTIALLY_ADOPTED',
    adoptionScope: 'Backend OAuth vault & Firebase Auth controls',
    relevantProducts: ['Mini Post App Core Backend'],
    relevantModules: ['Legal Module', 'Security Engine'],
    relevantWorkflows: ['OAuth Token Management', 'Authentication'],
    relevantInternalStandards: ['security-disclosure-standard', 'privacy-by-design-standard'],
    owner: 'Security Lead',
    dateAdopted: '2026-01-10',
    lastReviewedDate: '2026-08-01',
    nextReviewDate: '2026-11-01',
    verificationStatus: 'VERIFIED',
    notes: 'Informed by ISO 27001 security principles.',
  },
];
