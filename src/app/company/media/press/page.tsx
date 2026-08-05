import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { PRESS_PAGE_CONTENT } from '@/modules/company/content/mediaContent';
import { COMPANY_FACTS } from '@/modules/company/config/companyFacts';

export const metadata = buildCompanyMetadata({
  title: 'Press & Media Relations',
  description: 'Official press releases, product background, brand information, and media inquiry contact for Mini Post App.',
  path: '/company/media/press',
});

export default function PressPage() {
  return (
    <CompanyPageShell
      groupKey="media"
      groupLabel="Media"
      badge={PRESS_PAGE_CONTENT.hero.badge}
      title={PRESS_PAGE_CONTENT.hero.title}
      subtitle={PRESS_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Press', href: '/company/media/press' }]}
      canonicalPath="/company/media/press"
      metaDescription="Official press releases, product background, and media inquiry contact."
      cta={{
        title: 'Send Press & Media Inquiries',
        description: 'For interview requests, product reviews, or official statements.',
        primaryButtonText: 'Email Media Team',
        primaryButtonHref: `mailto:${COMPANY_FACTS.supportEmail}?subject=Press%20Inquiry`,
      }}
      relatedPages={[
        { title: 'Brand Kit', description: 'Color palettes & typography.', href: '/company/media/brand-kit', groupLabel: 'Media' },
        { title: 'Logos', description: 'Official emblems & wordmarks.', href: '/company/media/logos', groupLabel: 'Media' },
      ]}
    >
      {/* Facts Table */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">AT A GLANCE</span>
          <h2 className="text-2xl font-black text-white">Company Quick Facts</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESS_PAGE_CONTENT.facts.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-slate-800 bg-[#0c101a] p-5 space-y-1 shadow-md">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{fact.label}</span>
              <p className="text-xs sm:text-sm font-extrabold text-white">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>
    </CompanyPageShell>
  );
}
