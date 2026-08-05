import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { VALUES_PAGE_CONTENT } from '@/modules/company/content/companyContent';

export const metadata = buildCompanyMetadata({
  title: 'Our Values',
  description: 'Core principles of Mini Post App: Clarity, User Control, Responsible AI, Reliability, and Privacy.',
  path: '/company/values',
});

export default function ValuesPage() {
  return (
    <CompanyPageShell
      groupKey="company"
      groupLabel="Company"
      badge={VALUES_PAGE_CONTENT.hero.badge}
      title={VALUES_PAGE_CONTENT.hero.title}
      subtitle={VALUES_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Values', href: '/company/values' }]}
      canonicalPath="/company/values"
      metaDescription="Core principles of Mini Post App."
      cta={{
        title: 'Built With Privacy & Control First',
        description: 'Explore our engineering standards and trust policies.',
        primaryButtonText: 'View Trust & Safety',
        primaryButtonHref: '/company/trust/trust-safety',
      }}
      relatedPages={[
        { title: 'Mission', description: 'Our core purpose.', href: '/company/mission', groupLabel: 'Company' },
        { title: 'Trust & Safety', description: 'Engineering standards.', href: '/company/trust/trust-safety', groupLabel: 'Trust' },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {VALUES_PAGE_CONTENT.valuesList.map((v) => (
          <div key={v.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-6 space-y-3 shadow-xl">
            <h2 className="text-base font-extrabold text-white">{v.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
