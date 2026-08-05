import { Metadata } from 'next';
import { LEGAL_FACTS } from '../config/legalFacts';

export interface LegalMetadataInput {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export function createLegalMetadata({
  title,
  description,
  path,
  noIndex = false,
}: LegalMetadataInput): Metadata {
  const fullTitle = `${title} | Legal | ${LEGAL_FACTS.productName}`;
  const canonicalUrl = `${LEGAL_FACTS.canonicalBaseUrl}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: LEGAL_FACTS.productName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
