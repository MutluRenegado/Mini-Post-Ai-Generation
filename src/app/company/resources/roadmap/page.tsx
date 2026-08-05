import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { ROADMAP_PAGE_CONTENT } from '@/modules/company/content/resourcesContent';

export const metadata = buildCompanyMetadata({
  title: 'Roadmap',
  description: 'High-level verified roadmap themes: Current Focus, Exploring, and Planned development areas.',
  path: '/company/resources/roadmap',
});

export default function RoadmapPage() {
  return (
    <CompanyPageShell
      groupKey="resources"
      groupLabel="Resources"
      badge={ROADMAP_PAGE_CONTENT.hero.badge}
      title={ROADMAP_PAGE_CONTENT.hero.title}
      subtitle={ROADMAP_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Roadmap', href: '/company/resources/roadmap' }]}
      canonicalPath="/company/resources/roadmap"
      metaDescription="High-level verified roadmap themes."
      cta={{
        title: 'Share Product Feedback',
        description: 'Have a feature request or feedback on target channels?',
        primaryButtonText: 'Send Feedback',
        primaryButtonHref: '/company/contact',
      }}
      relatedPages={[
        { title: 'Changelog', description: 'Recent releases.', href: '/company/resources/changelog', groupLabel: 'Resources' },
        { title: 'Features', description: 'Live features.', href: '/company/product/features', groupLabel: 'Product' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ROADMAP_PAGE_CONTENT.themes.map((t) => (
          <div key={t.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase">
              {t.stage}
            </span>
            <h2 className="text-lg font-extrabold text-white">{t.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
