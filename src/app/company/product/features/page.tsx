import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { FEATURES_PAGE_CONTENT } from '@/modules/company/content/productContent';

export const metadata = buildCompanyMetadata({
  title: 'Product Features',
  description: 'Explore live features inside Mini Post App: Creator Studio, Gemini Flash AI adaptation, Brand Kits, and OAuth multi-channel publishing.',
  path: '/company/product/features',
});

export default function FeaturesPage() {
  return (
    <CompanyPageShell
      groupKey="product"
      groupLabel="Product"
      badge={FEATURES_PAGE_CONTENT.hero.badge}
      title={FEATURES_PAGE_CONTENT.hero.title}
      subtitle={FEATURES_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Features', href: '/company/product/features' }]}
      canonicalPath="/company/product/features"
      metaDescription="Explore live features inside Mini Post App."
      cta={{
        title: 'Try Creator Studio Features Live',
        description: 'Create your first post with Google Gemini AI Flash assistance now.',
        primaryButtonText: 'Go To Dashboard',
        primaryButtonHref: '/dashboard',
      }}
      relatedPages={[
        { title: 'Capabilities', description: 'Platform support matrix.', href: '/company/product/capabilities', groupLabel: 'Product' },
        { title: 'AI Engine', description: 'Google Gemini Flash specs.', href: '/company/product/ai-engine', groupLabel: 'Product' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES_PAGE_CONTENT.featureList.map((f) => (
          <div key={f.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-6 space-y-3 shadow-xl">
            <h2 className="text-base font-extrabold text-white">{f.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
