import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { BRAND_KIT_PAGE_CONTENT } from '@/modules/company/content/mediaContent';

export const metadata = buildCompanyMetadata({
  title: 'Brand Kit',
  description: 'Official brand guidelines, color palettes, typography specifications, and clear space rules for Mini Post App.',
  path: '/company/media/brand-kit',
});

export default function BrandKitPage() {
  return (
    <CompanyPageShell
      groupKey="media"
      groupLabel="Media"
      badge={BRAND_KIT_PAGE_CONTENT.hero.badge}
      title={BRAND_KIT_PAGE_CONTENT.hero.title}
      subtitle={BRAND_KIT_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Brand Kit', href: '/company/media/brand-kit' }]}
      canonicalPath="/company/media/brand-kit"
      metaDescription="Official brand guidelines and style guide for Mini Post App."
      cta={{
        title: 'Need High-Resolution Vector Assets?',
        description: 'View approved brand logos and emblem files.',
        primaryButtonText: 'View Logo Assets',
        primaryButtonHref: '/company/media/logos',
      }}
      relatedPages={[
        { title: 'Logos', description: 'Emblems & wordmarks.', href: '/company/media/logos', groupLabel: 'Media' },
        { title: 'Press', description: 'Press contacts.', href: '/company/media/press', groupLabel: 'Media' },
      ]}
    >
      {/* Color Palette */}
      <section className="space-y-6">
        <h2 className="text-xl font-extrabold text-white text-center">Brand Color Palette</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BRAND_KIT_PAGE_CONTENT.colorPalette.map((c) => (
            <div key={c.name} className="rounded-2xl border border-slate-800 bg-[#0c101a] p-5 space-y-3 shadow-md">
              <div className="h-12 rounded-xl border border-slate-700/50" style={{ backgroundColor: c.hex }} />
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{c.name}</span>
                  <span className="font-mono text-amber-400 text-[11px]">{c.hex}</span>
                </div>
                <p className="text-[11px] text-slate-400">{c.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-4 shadow-xl max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-white">Logo Usage Guidelines</h2>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
          {BRAND_KIT_PAGE_CONTENT.rules.map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>
    </CompanyPageShell>
  );
}
