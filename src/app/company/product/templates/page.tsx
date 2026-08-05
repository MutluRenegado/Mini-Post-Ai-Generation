import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { TEMPLATES_PAGE_CONTENT } from '@/modules/company/content/productContent';

export const metadata = buildCompanyMetadata({
  title: 'Templates',
  description: 'Explore prompt templates and content frameworks for founders, coaches, marketers, and creators.',
  path: '/company/product/templates',
});

export default function TemplatesPage() {
  return (
    <CompanyPageShell
      groupKey="product"
      groupLabel="Product"
      badge={TEMPLATES_PAGE_CONTENT.hero.badge}
      title={TEMPLATES_PAGE_CONTENT.hero.title}
      subtitle={TEMPLATES_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Templates', href: '/company/product/templates' }]}
      canonicalPath="/company/product/templates"
      metaDescription="Explore prompt templates and content frameworks for creators."
      cta={{
        title: 'Use Prompt Templates Live',
        description: 'Select a template and generate multi-channel social content instantly.',
        primaryButtonText: 'Browse Templates in Studio',
        primaryButtonHref: '/dashboard',
      }}
      relatedPages={[
        { title: 'Features', description: 'Live feature list.', href: '/company/product/features', groupLabel: 'Product' },
        { title: 'Pricing', description: 'View plan tiers.', href: '/company/product/pricing', groupLabel: 'Product' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEMPLATES_PAGE_CONTENT.categories.map((c) => (
          <div key={c.name} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white">{c.name}</h2>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                {c.count}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
