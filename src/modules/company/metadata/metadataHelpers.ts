import type { Metadata } from 'next';
import { COMPANY_FACTS } from '../config/companyFacts';

interface MetadataParams {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export function buildCompanyMetadata({
  title,
  description,
  path,
  noIndex = false,
}: MetadataParams): Metadata {
  const fullTitle = `${title} | ${COMPANY_FACTS.productName}`;
  const canonicalUrl = `${COMPANY_FACTS.baseUrl}${path}`;

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
      siteName: COMPANY_FACTS.productName,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large',
          'max-video-preview': -1,
        },
  };
}
