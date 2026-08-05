import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { DPA_PAGE_CONTENT } from '@/modules/company/content/trustContent';

export const metadata = buildCompanyMetadata({
  title: 'Data Processing Agreement',
  description: 'Standard Data Processing Addendum (DPA) terms for business customers using Mini Post App.',
  path: '/company/trust/data-processing-agreement',
});

export default function DataProcessingAgreementPage() {
  return (
    <CompanyPageShell
      groupKey="trust"
      groupLabel="Trust"
      badge={DPA_PAGE_CONTENT.hero.badge}
      title={DPA_PAGE_CONTENT.hero.title}
      subtitle={DPA_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Data Processing Agreement', href: '/company/trust/data-processing-agreement' }]}
      canonicalPath="/company/trust/data-processing-agreement"
      metaDescription="Standard Data Processing Addendum (DPA) terms for business customers."
      cta={{
        title: 'Need a Executed Business DPA?',
        description: 'Contact our compliance team for custom enterprise execution.',
        primaryButtonText: 'Contact Compliance',
        primaryButtonHref: '/company/contact',
      }}
      relatedPages={[
        { title: 'Subprocessors', description: 'Vendor directory.', href: '/company/trust/subprocessors', groupLabel: 'Trust' },
        { title: 'Privacy', description: 'Privacy Policy.', href: '/company/trust/privacy', groupLabel: 'Trust' },
      ]}
    >
      <div className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-4 shadow-xl max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-white">DPA Standard Terms Summary</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{DPA_PAGE_CONTENT.summary}</p>
      </div>
    </CompanyPageShell>
  );
}
