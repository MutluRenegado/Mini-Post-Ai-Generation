import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { SCREENSHOTS_PAGE_CONTENT } from '@/modules/company/content/mediaContent';

export const metadata = buildCompanyMetadata({
  title: 'Screenshots',
  description: 'Official high-definition Creator Studio UI preview cards and interface showcases.',
  path: '/company/media/screenshots',
});

export default function ScreenshotsPage() {
  return (
    <CompanyPageShell
      groupKey="media"
      groupLabel="Media"
      badge={SCREENSHOTS_PAGE_CONTENT.hero.badge}
      title={SCREENSHOTS_PAGE_CONTENT.hero.title}
      subtitle={SCREENSHOTS_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Screenshots', href: '/company/media/screenshots' }]}
      canonicalPath="/company/media/screenshots"
      metaDescription="Official high-definition Creator Studio UI preview cards."
      cta={{
        title: 'Explore the Creator Studio Live Interface',
        description: 'Try the live application in your browser.',
        primaryButtonText: 'Open Creator Studio',
        primaryButtonHref: '/dashboard',
      }}
      relatedPages={[
        { title: 'Logos', description: 'Brand emblems.', href: '/company/media/logos', groupLabel: 'Media' },
        { title: 'Press', description: 'Press contacts.', href: '/company/media/press', groupLabel: 'Media' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SCREENSHOTS_PAGE_CONTENT.showcases.map((sc) => (
          <div key={sc.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-lg font-extrabold text-white">{sc.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{sc.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
