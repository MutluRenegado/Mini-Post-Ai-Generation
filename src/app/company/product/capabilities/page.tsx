import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { CAPABILITIES_PAGE_CONTENT } from '@/modules/company/content/productContent';

export const metadata = buildCompanyMetadata({
  title: 'Platform Capabilities',
  description: 'Multi-platform publishing capabilities for Facebook, Instagram, LinkedIn, X, TikTok, and YouTube.',
  path: '/company/product/capabilities',
});

export default function CapabilitiesPage() {
  return (
    <CompanyPageShell
      groupKey="product"
      groupLabel="Product"
      badge={CAPABILITIES_PAGE_CONTENT.hero.badge}
      title={CAPABILITIES_PAGE_CONTENT.hero.title}
      subtitle={CAPABILITIES_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Capabilities', href: '/company/product/capabilities' }]}
      canonicalPath="/company/product/capabilities"
      metaDescription="Multi-platform publishing capabilities for Facebook, Instagram, LinkedIn, X, TikTok, and YouTube."
      cta={{
        title: 'Start Multi-Channel Publishing',
        description: 'Connect your accounts and publish across channels simultaneously.',
        primaryButtonText: 'Open Creator Studio',
        primaryButtonHref: '/dashboard',
      }}
      relatedPages={[
        { title: 'Features', description: 'Live feature list.', href: '/company/product/features', groupLabel: 'Product' },
        { title: 'Templates', description: 'Prompt template gallery.', href: '/company/product/templates', groupLabel: 'Product' },
      ]}
    >
      <div className="rounded-3xl border border-slate-800 bg-[#0c101a] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 space-y-1">
          <h2 className="text-lg font-bold text-white">Supported Channel Matrix</h2>
          <p className="text-xs text-slate-400">Current availability status across target networks.</p>
        </div>
        <div className="divide-y divide-slate-800/60">
          {CAPABILITIES_PAGE_CONTENT.supportedMatrix.map((item) => (
            <div key={item.platform} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-white">{item.platform}</h3>
                <p className="text-xs text-slate-400">{item.details}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase w-fit ${
                item.status === 'Available' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CompanyPageShell>
  );
}
