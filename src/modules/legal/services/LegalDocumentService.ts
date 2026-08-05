import { LegalDocument } from '../types/legalDocument.types';
import { PRIVACY_POLICY_DOC } from '../content/privacy';
import { TERMS_OF_SERVICE_DOC } from '../content/terms';
import { COOKIE_POLICY_DOC } from '../content/cookies';
import { GDPR_DOC } from '../content/gdpr';
import { DPA_DOC } from '../content/dpa';
import { SUBPROCESSORS_DOC } from '../content/subprocessors';
import { DISCLAIMER_DOC } from '../content/disclaimer';
import { ACCEPTABLE_USE_DOC } from '../content/acceptableUse';
import { AI_CONTENT_DISCLAIMER_DOC } from '../content/aiContentDisclaimer';
import { COPYRIGHT_DOC } from '../content/copyright';
import { TRADEMARK_DOC } from '../content/trademark';
import { DATA_RETENTION_DOC } from '../content/retention';
import { LEGAL_REQUESTS_DOC } from '../content/legalRequests';
import { ACCESSIBILITY_STATEMENT_DOC } from '../content/accessibility';
import { SECURITY_DISCLOSURE_DOC } from '../content/securityDisclosure';
import { RESPONSIBLE_AI_DOC } from '../content/responsibleAi';

export const ALL_LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  privacy: PRIVACY_POLICY_DOC,
  terms: TERMS_OF_SERVICE_DOC,
  cookies: COOKIE_POLICY_DOC,
  gdpr: GDPR_DOC,
  'data-processing-agreement': DPA_DOC,
  subprocessors: SUBPROCESSORS_DOC,
  disclaimer: DISCLAIMER_DOC,
  'acceptable-use': ACCEPTABLE_USE_DOC,
  'ai-content-disclaimer': AI_CONTENT_DISCLAIMER_DOC,
  copyright: COPYRIGHT_DOC,
  trademark: TRADEMARK_DOC,
  'data-retention': DATA_RETENTION_DOC,
  'legal-requests': LEGAL_REQUESTS_DOC,
  accessibility: ACCESSIBILITY_STATEMENT_DOC,
  'security-disclosure': SECURITY_DISCLOSURE_DOC,
  'responsible-ai': RESPONSIBLE_AI_DOC,
};

export function getLegalDocumentBySlug(slug: string): LegalDocument | undefined {
  return ALL_LEGAL_DOCUMENTS[slug];
}

export function getAllLegalDocuments(): LegalDocument[] {
  return Object.values(ALL_LEGAL_DOCUMENTS);
}
