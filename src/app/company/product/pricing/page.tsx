import React from 'react';
import Link from 'next/link';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { PRICING_PAGE_CONTENT } from '@/modules/company/content/productContent';

export const metadata = buildCompanyMetadata({
  title: 'Pricing Plans',
  description: 'Transparent pricing plans for creators, solopreneurs, and agencies. Free Starter, Pro, and Studio tiers.',
  path: '/company/product/pricing',
});

export default function PricingPage() {
  return (
    <CompanyPageShell
      groupKey="product"
      groupLabel="Product"
      badge={PRICING_PAGE_CONTENT.hero.badge}
      title={PRICING_PAGE_CONTENT.hero.title}
      subtitle={PRICING_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Pricing', href: '/company/product/pricing' }]}
      canonicalPath="/company/product/pricing"
      metaDescription="Transparent pricing plans for creators, solopreneurs, and agencies."
      cta={{
        title: 'Need a Custom Plan or Team Seating?',
        description: 'Contact our enterprise sales team for agency & multi-brand seating.',
        primaryButtonText: 'View Enterprise',
        primaryButtonHref: '/company/product/enterprise',
      }}
      relatedPages={[
        { title: 'Enterprise', description: 'Solutions for agencies.', href: '/company/product/enterprise', groupLabel: 'Product' },
        { title: 'Features', description: 'Live feature list.', href: '/company/product/features', groupLabel: 'Product' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PRICING_PAGE_CONTENT.plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-3xl border p-8 space-y-6 flex flex-col justify-between shadow-2xl relative ${
              p.popular ? 'border-amber-500/50 bg-gradient-to-b from-[#0c101a] to-[#121827]' : 'border-slate-800 bg-[#0c101a]'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
                MOST POPULAR
              </span>
            )}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white">{p.name}</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-amber-400">{p.price}</span>
                <span className="text-xs text-slate-400 font-mono">/ {p.period}</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={p.ctaHref}
              className={`w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider text-center transition-all ${
                p.popular
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200'
              }`}
            >
              {p.ctaText}
            </Link>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
