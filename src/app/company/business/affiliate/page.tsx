import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { EmptyStateCard } from '@/modules/company/components/EmptyStateCard';
import { AFFILIATE_PAGE_CONTENT } from '@/modules/company/content/businessContent';

export const metadata = buildCompanyMetadata({
  title: 'Affiliate Program',
  description: 'Information regarding the future affiliate and referral program for Mini Post App.',
  path: '/company/business/affiliate',
});

export default function AffiliatePage() {
  return (
    <CompanyPageShell
      groupKey="business"
      groupLabel="Business"
      badge={AFFILIATE_PAGE_CONTENT.hero.badge}
      title={AFFILIATE_PAGE_CONTENT.hero.title}
      subtitle={AFFILIATE_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Affiliate', href: '/company/business/affiliate' }]}
      canonicalPath="/company/business/affiliate"
      metaDescription="Information regarding the future affiliate program for Mini Post App."
      relatedPages={[
        { title: 'Partners', description: 'Partnership inquiries.', href: '/company/business/partners', groupLabel: 'Business' },
        { title: 'Pricing', description: 'View plan tiers.', href: '/company/product/pricing', groupLabel: 'Product' },
      ]}
    >
      <EmptyStateCard
        title={AFFILIATE_PAGE_CONTENT.emptyState.title}
        description={AFFILIATE_PAGE_CONTENT.emptyState.description}
        badge="PROGRAM NOT YET OPEN"
      />
    </CompanyPageShell>
  );
}
