import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { EmptyStateCard } from '@/modules/company/components/EmptyStateCard';
import { CUSTOMER_STORIES_PAGE_CONTENT } from '@/modules/company/content/businessContent';

export const metadata = buildCompanyMetadata({
  title: 'Customer Stories',
  description: 'Creator spotlights and customer experiences using Mini Post App for multi-channel publishing.',
  path: '/company/business/customer-stories',
});

export default function CustomerStoriesPage() {
  return (
    <CompanyPageShell
      groupKey="business"
      groupLabel="Business"
      badge={CUSTOMER_STORIES_PAGE_CONTENT.hero.badge}
      title={CUSTOMER_STORIES_PAGE_CONTENT.hero.title}
      subtitle={CUSTOMER_STORIES_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Customer Stories', href: '/company/business/customer-stories' }]}
      canonicalPath="/company/business/customer-stories"
      metaDescription="Creator spotlights and customer experiences."
      relatedPages={[
        { title: 'Case Studies', description: 'Efficiency reports.', href: '/company/business/case-studies', groupLabel: 'Business' },
        { title: 'Partners', description: 'Partner program.', href: '/company/business/partners', groupLabel: 'Business' },
      ]}
    >
      <EmptyStateCard
        title={CUSTOMER_STORIES_PAGE_CONTENT.emptyState.title}
        description={CUSTOMER_STORIES_PAGE_CONTENT.emptyState.description}
        badge="COMING SOON"
      />
    </CompanyPageShell>
  );
}
