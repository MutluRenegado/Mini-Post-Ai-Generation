import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { TERMS_PAGE_CONTENT } from '@/modules/company/content/trustContent';

export const metadata = buildCompanyMetadata({
  title: 'Terms of Service',
  description: 'Official Terms of Service contract for Mini Post App operated by Yoga Products Top Limited.',
  path: '/company/trust/terms',
});

export default function TermsPage() {
  return (
    <CompanyPageShell
      groupKey="trust"
      groupLabel="Trust"
      badge={TERMS_PAGE_CONTENT.hero.badge}
      title={TERMS_PAGE_CONTENT.hero.title}
      subtitle={TERMS_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Terms', href: '/company/trust/terms' }]}
      canonicalPath="/company/trust/terms"
      metaDescription="Official Terms of Service contract for Mini Post App."
      cta={{
        title: 'Questions About Terms?',
        description: 'Contact our legal & compliance team.',
        primaryButtonText: 'Contact Legal Support',
        primaryButtonHref: '/company/contact',
      }}
      relatedPages={[
        { title: 'Privacy', description: 'Privacy Policy.', href: '/company/trust/privacy', groupLabel: 'Trust' },
        { title: 'Data Processing Agreement', description: 'Business DPA.', href: '/company/trust/data-processing-agreement', groupLabel: 'Trust' },
      ]}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {TERMS_PAGE_CONTENT.sections.map((s) => (
          <section key={s.heading} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-xl font-extrabold text-white">{s.heading}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{s.content}</p>
          </section>
        ))}
      </div>
    </CompanyPageShell>
  );
}
