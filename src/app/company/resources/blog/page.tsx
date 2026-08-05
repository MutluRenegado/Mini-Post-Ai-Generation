import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { EmptyStateCard } from '@/modules/company/components/EmptyStateCard';
import { BLOG_PAGE_CONTENT } from '@/modules/company/content/resourcesContent';

export const metadata = buildCompanyMetadata({
  title: 'Blog',
  description: 'Official Mini Post App blog and articles covering creator publishing strategies.',
  path: '/company/resources/blog',
});

export default function BlogPage() {
  return (
    <CompanyPageShell
      groupKey="resources"
      groupLabel="Resources"
      badge={BLOG_PAGE_CONTENT.hero.badge}
      title={BLOG_PAGE_CONTENT.hero.title}
      subtitle={BLOG_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Blog', href: '/company/resources/blog' }]}
      canonicalPath="/company/resources/blog"
      metaDescription="Official Mini Post App blog."
      relatedPages={[
        { title: 'Changelog', description: 'Recent releases.', href: '/company/resources/changelog', groupLabel: 'Resources' },
        { title: 'Roadmap', description: 'Platform focus areas.', href: '/company/resources/roadmap', groupLabel: 'Resources' },
      ]}
    >
      <EmptyStateCard
        title={BLOG_PAGE_CONTENT.emptyState.title}
        description={BLOG_PAGE_CONTENT.emptyState.description}
        badge="COMING SOON"
      />
    </CompanyPageShell>
  );
}
