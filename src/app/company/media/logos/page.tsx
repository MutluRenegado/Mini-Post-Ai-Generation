import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { LOGOS_PAGE_CONTENT } from '@/modules/company/content/mediaContent';

export const metadata = buildCompanyMetadata({
  title: 'Logos',
  description: 'Approved Mini Post App logo assets, wordmark files, and emblem previews for press and media.',
  path: '/company/media/logos',
});

export default function LogosPage() {
  return (
    <CompanyPageShell
      groupKey="media"
      groupLabel="Media"
      badge={LOGOS_PAGE_CONTENT.hero.badge}
      title={LOGOS_PAGE_CONTENT.hero.title}
      subtitle={LOGOS_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Logos', href: '/company/media/logos' }]}
      canonicalPath="/company/media/logos"
      metaDescription="Approved Mini Post App logo assets."
      cta={{
        title: 'Need Custom Media Packaging?',
        description: 'Explore full media kit downloads.',
        primaryButtonText: 'View Media Kit',
        primaryButtonHref: '/company/media/media-kit',
      }}
      relatedPages={[
        { title: 'Brand Kit', description: 'Guidelines & colors.', href: '/company/media/brand-kit', groupLabel: 'Media' },
        { title: 'Screenshots', description: 'UI previews.', href: '/company/media/screenshots', groupLabel: 'Media' },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {LOGOS_PAGE_CONTENT.assets.map((asset) => (
          <div key={asset.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-6 space-y-4 shadow-xl text-center flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-28 rounded-2xl bg-[#05070c] border border-slate-800/80 flex items-center justify-center p-4">
                <img src={asset.path} alt={asset.title} className="max-h-16 w-auto object-contain" />
              </div>
              <h2 className="text-sm font-extrabold text-white">{asset.title}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                {asset.format}
              </span>
            </div>
            <a
              href={asset.path}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors block text-center"
            >
              View Full Asset
            </a>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
