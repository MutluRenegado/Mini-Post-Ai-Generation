import React from 'react';
import { BreadcrumbItem } from '../types/company';
import { COMPANY_FACTS } from '../config/companyFacts';

interface CompanyJsonLdProps {
  breadcrumbs?: BreadcrumbItem[];
  pageTitle: string;
  pageDescription: string;
  pageUrl: string;
}

export function CompanyJsonLd({
  breadcrumbs = [],
  pageTitle,
  pageDescription,
  pageUrl,
}: CompanyJsonLdProps) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_FACTS.productName,
    legalName: COMPANY_FACTS.operatingEntity,
    url: COMPANY_FACTS.baseUrl,
    logo: `${COMPANY_FACTS.baseUrl}/icon.png`,
    email: COMPANY_FACTS.supportEmail,
    description: COMPANY_FACTS.primaryPurpose,
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: COMPANY_FACTS.operatingEntity,
    },
  };

  const breadcrumbListSchema =
    breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.label,
            item: item.href.startsWith('http') ? item.href : `${COMPANY_FACTS.baseUrl}${item.href}`,
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {breadcrumbListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
        />
      )}
    </>
  );
}
