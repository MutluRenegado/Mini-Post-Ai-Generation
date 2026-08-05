import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { PARTNERS_PAGE_CONTENT } from '@/modules/company/content/businessContent';
import { COMPANY_FACTS } from '@/modules/company/config/companyFacts';

export const metadata = buildCompanyMetadata({
  title: 'Partnerships',
  description: 'Partner with Mini Post App. Partnership inquiry guidelines and direct business contact route.',
  path: '/company/business/partners',
});

export default function PartnersPage() {
  return (
    <CompanyPageShell
      groupKey="business"
      groupLabel="Business"
      badge={PARTNERS_PAGE_CONTENT.hero.badge}
      title={PARTNERS_PAGE_CONTENT.hero.title}
      subtitle={PARTNERS_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Partners', href: '/company/business/partners' }]}
      canonicalPath="/company/business/partners"
      metaDescription="Partnership inquiry guidelines and direct business contact route."
      cta={{
        title: 'Submit Partnership Proposal',
        description: 'Reach out to our partnerships evaluation team.',
        primaryButtonText: 'Send Proposal Email',
        primaryButtonHref: `mailto:${COMPANY_FACTS.supportEmail}?subject=Partnership%20Proposal`,
      }}
      relatedPages={[
        { title: 'Affiliate', description: 'Program status.', href: '/company/business/affiliate', groupLabel: 'Business' },
        { title: 'Enterprise', description: 'Agency solutions.', href: '/company/product/enterprise', groupLabel: 'Product' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PARTNERS_PAGE_CONTENT.process.map((p) => (
          <div key={p.step} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <span className="text-xl font-black font-mono text-amber-400">{p.step}</span>
            <h2 className="text-lg font-extrabold text-white">{p.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
