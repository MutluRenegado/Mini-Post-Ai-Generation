import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { EmptyStateCard } from '@/modules/company/components/EmptyStateCard';
import { CASE_STUDIES_PAGE_CONTENT } from '@/modules/company/content/businessContent';

export const metadata = buildCompanyMetadata({
  title: 'Case Studies',
  description: 'In-depth workflow efficiency studies and case reports for Mini Post App.',
  path: '/company/business/case-studies',
});

export default function CaseStudiesPage() {
  return (
    <CompanyPageShell
      groupKey="business"
      groupLabel="Business"
      badge={CASE_STUDIES_PAGE_CONTENT.hero.badge}
      title={CASE_STUDIES_PAGE_CONTENT.hero.title}
      subtitle={CASE_STUDIES_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Case Studies', href: '/company/business/case-studies' }]}
      canonicalPath="/company/business/case-studies"
      metaDescription="In-depth workflow efficiency studies for Mini Post App."
      relatedPages={[
        { title: 'Customer Stories', description: 'Spotlights.', href: '/company/business/customer-stories', groupLabel: 'Business' },
        { title: 'Enterprise', description: 'Agency solutions.', href: '/company/product/enterprise', groupLabel: 'Product' },
      ]}
    >
      <EmptyStateCard
        title={CASE_STUDIES_PAGE_CONTENT.emptyState.title}
        description={CASE_STUDIES_PAGE_CONTENT.emptyState.description}
        badge="IN PREPARATION"
      />
    </CompanyPageShell>
  );
}
