import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { TUTORIALS_PAGE_CONTENT } from '@/modules/company/content/resourcesContent';

export const metadata = buildCompanyMetadata({
  title: 'Tutorials',
  description: 'Step-by-step product walkthrough guides and onboarding tutorials for Mini Post App.',
  path: '/company/resources/tutorials',
});

export default function TutorialsPage() {
  return (
    <CompanyPageShell
      groupKey="resources"
      groupLabel="Resources"
      badge={TUTORIALS_PAGE_CONTENT.hero.badge}
      title={TUTORIALS_PAGE_CONTENT.hero.title}
      subtitle={TUTORIALS_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Tutorials', href: '/company/resources/tutorials' }]}
      canonicalPath="/company/resources/tutorials"
      metaDescription="Step-by-step product walkthrough guides for Mini Post App."
      cta={{
        title: 'Start Building Content Now',
        description: 'Apply these guides in Creator Studio right away.',
        primaryButtonText: 'Go To Dashboard',
        primaryButtonHref: '/dashboard',
      }}
      relatedPages={[
        { title: 'Documentation', description: 'Platform specs.', href: '/company/resources/documentation', groupLabel: 'Resources' },
        { title: 'Help Center', description: 'Support hub.', href: '/company/resources/help', groupLabel: 'Resources' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TUTORIALS_PAGE_CONTENT.guides.map((g) => (
          <div key={g.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-lg font-extrabold text-white">{g.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
