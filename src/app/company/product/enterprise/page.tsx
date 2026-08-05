import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { ENTERPRISE_PAGE_CONTENT } from '@/modules/company/content/productContent';
import { COMPANY_FACTS } from '@/modules/company/config/companyFacts';

export const metadata = buildCompanyMetadata({
  title: 'Enterprise & Agencies',
  description: 'Multi-brand social content orchestration for marketing agencies, enterprise teams, and franchises.',
  path: '/company/product/enterprise',
});

export default function EnterprisePage() {
  return (
    <CompanyPageShell
      groupKey="product"
      groupLabel="Product"
      badge={ENTERPRISE_PAGE_CONTENT.hero.badge}
      title={ENTERPRISE_PAGE_CONTENT.hero.title}
      subtitle={ENTERPRISE_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Enterprise', href: '/company/product/enterprise' }]}
      canonicalPath="/company/product/enterprise"
      metaDescription="Multi-brand social content orchestration for marketing agencies and enterprise teams."
      cta={{
        title: 'Discuss Enterprise Requirements',
        description: 'Contact our team for custom agency seating, invoicing, or workspace setup.',
        primaryButtonText: 'Contact Enterprise Sales',
        primaryButtonHref: `mailto:${COMPANY_FACTS.supportEmail}?subject=Enterprise%20Inquiry`,
      }}
      relatedPages={[
        { title: 'Pricing', description: 'Standard pricing tiers.', href: '/company/product/pricing', groupLabel: 'Product' },
        { title: 'Security', description: 'AES-256 vault encryption.', href: '/company/trust/security', groupLabel: 'Trust' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ENTERPRISE_PAGE_CONTENT.useCases.map((uc) => (
          <div key={uc.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-lg font-extrabold text-white">{uc.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{uc.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
