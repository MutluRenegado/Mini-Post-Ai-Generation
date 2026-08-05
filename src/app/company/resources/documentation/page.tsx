import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { DOCUMENTATION_PAGE_CONTENT } from '@/modules/company/content/resourcesContent';

export const metadata = buildCompanyMetadata({
  title: 'Documentation',
  description: 'Official Mini Post App documentation index covering Creator Studio 7-step pipeline, AI prompts, and channel setup.',
  path: '/company/resources/documentation',
});

export default function DocumentationPage() {
  return (
    <CompanyPageShell
      groupKey="resources"
      groupLabel="Resources"
      badge={DOCUMENTATION_PAGE_CONTENT.hero.badge}
      title={DOCUMENTATION_PAGE_CONTENT.hero.title}
      subtitle={DOCUMENTATION_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Documentation', href: '/company/resources/documentation' }]}
      canonicalPath="/company/resources/documentation"
      metaDescription="Official Mini Post App documentation index."
      cta={{
        title: 'Ready to Test the Pipeline?',
        description: 'Launch Creator Studio to test post generation and channel options.',
        primaryButtonText: 'Open Creator Studio',
        primaryButtonHref: '/dashboard',
      }}
      relatedPages={[
        { title: 'Help Center', description: 'Search FAQs.', href: '/company/resources/help', groupLabel: 'Resources' },
        { title: 'Tutorials', description: 'Step-by-step guides.', href: '/company/resources/tutorials', groupLabel: 'Resources' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOCUMENTATION_PAGE_CONTENT.sections.map((s) => (
          <div key={s.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-lg font-extrabold text-white">{s.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
