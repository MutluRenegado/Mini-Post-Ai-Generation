import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { CHANGELOG_PAGE_CONTENT } from '@/modules/company/content/resourcesContent';

export const metadata = buildCompanyMetadata({
  title: 'Changelog',
  description: 'Track recent feature releases, performance improvements, and updates to Mini Post App.',
  path: '/company/resources/changelog',
});

export default function ChangelogPage() {
  return (
    <CompanyPageShell
      groupKey="resources"
      groupLabel="Resources"
      badge={CHANGELOG_PAGE_CONTENT.hero.badge}
      title={CHANGELOG_PAGE_CONTENT.hero.title}
      subtitle={CHANGELOG_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Changelog', href: '/company/resources/changelog' }]}
      canonicalPath="/company/resources/changelog"
      metaDescription="Track recent feature releases and updates to Mini Post App."
      cta={{
        title: 'Try the Latest Release Features',
        description: 'Explore the newly structured Company Module & Creator Studio.',
        primaryButtonText: 'Open Creator Studio',
        primaryButtonHref: '/dashboard',
      }}
      relatedPages={[
        { title: 'Roadmap', description: 'Platform focus areas.', href: '/company/resources/roadmap', groupLabel: 'Resources' },
        { title: 'Help Center', description: 'Support hub.', href: '/company/resources/help', groupLabel: 'Resources' },
      ]}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {CHANGELOG_PAGE_CONTENT.releases.map((rel) => (
          <div key={rel.version} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-amber-400 font-mono">{rel.version}</span>
              <span className="text-xs font-mono text-slate-500">{rel.date}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {rel.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
