import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { MEDIA_KIT_PAGE_CONTENT } from '@/modules/company/content/mediaContent';
import { COMPANY_FACTS } from '@/modules/company/config/companyFacts';

export const metadata = buildCompanyMetadata({
  title: 'Media Kit',
  description: 'Downloadable press package index, brand backgrounders, and media request instructions.',
  path: '/company/media/media-kit',
});

export default function MediaKitPage() {
  return (
    <CompanyPageShell
      groupKey="media"
      groupLabel="Media"
      badge={MEDIA_KIT_PAGE_CONTENT.hero.badge}
      title={MEDIA_KIT_PAGE_CONTENT.hero.title}
      subtitle={MEDIA_KIT_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Media Kit', href: '/company/media/media-kit' }]}
      canonicalPath="/company/media/media-kit"
      metaDescription="Downloadable press package index and media request instructions."
      cta={{
        title: 'Request Custom Media Package',
        description: 'Need specific assets or executive interview materials?',
        primaryButtonText: 'Request Media Package',
        primaryButtonHref: `mailto:${COMPANY_FACTS.supportEmail}?subject=Media%20Kit%20Request`,
      }}
      relatedPages={[
        { title: 'Press', description: 'Press contacts.', href: '/company/media/press', groupLabel: 'Media' },
        { title: 'Brand Kit', description: 'Guidelines & colors.', href: '/company/media/brand-kit', groupLabel: 'Media' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MEDIA_KIT_PAGE_CONTENT.packages.map((pkg) => (
          <div key={pkg.name} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                {pkg.format}
              </span>
              <h2 className="text-lg font-extrabold text-white">{pkg.name}</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{pkg.desc}</p>
            </div>
            <a
              href={`mailto:${COMPANY_FACTS.supportEmail}?subject=Media%20Package%20Request:%20${encodeURIComponent(pkg.name)}`}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors block text-center pt-2"
            >
              Request Package
            </a>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
