import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { GDPR_PAGE_CONTENT } from '@/modules/company/content/trustContent';

export const metadata = buildCompanyMetadata({
  title: 'GDPR Compliance',
  description: 'EU General Data Protection Regulation (GDPR) compliance information and data subject request routes.',
  path: '/company/trust/gdpr',
});

export default function GdprPage() {
  return (
    <CompanyPageShell
      groupKey="trust"
      groupLabel="Trust"
      badge={GDPR_PAGE_CONTENT.hero.badge}
      title={GDPR_PAGE_CONTENT.hero.title}
      subtitle={GDPR_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'GDPR', href: '/company/trust/gdpr' }]}
      canonicalPath="/company/trust/gdpr"
      metaDescription="EU General Data Protection Regulation (GDPR) compliance information."
      cta={{
        title: 'Submit Data Erasure Request (DSAR)',
        description: 'Submit an automated account deletion request under GDPR Article 17.',
        primaryButtonText: 'Go To Data Deletion',
        primaryButtonHref: '/data-deletion',
      }}
      relatedPages={[
        { title: 'Data Deletion', description: 'Interactive erasure form.', href: '/data-deletion', groupLabel: 'Trust' },
        { title: 'Privacy', description: 'Privacy Policy.', href: '/company/trust/privacy', groupLabel: 'Trust' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GDPR_PAGE_CONTENT.rights.map((r) => (
          <div key={r.right} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-lg font-extrabold text-white">{r.right}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
