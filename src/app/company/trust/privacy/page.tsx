import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { PRIVACY_PAGE_CONTENT } from '@/modules/company/content/trustContent';

export const metadata = buildCompanyMetadata({
  title: 'Privacy Policy',
  description: 'Official Privacy Policy for Mini Post App operated by Yoga Products Top Limited.',
  path: '/company/trust/privacy',
});

export default function PrivacyPage() {
  return (
    <CompanyPageShell
      groupKey="trust"
      groupLabel="Trust"
      badge={PRIVACY_PAGE_CONTENT.hero.badge}
      title={PRIVACY_PAGE_CONTENT.hero.title}
      subtitle={PRIVACY_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Privacy', href: '/company/trust/privacy' }]}
      canonicalPath="/company/trust/privacy"
      metaDescription="Official Privacy Policy for Mini Post App."
      cta={{
        title: 'Exercise Your Privacy Rights',
        description: 'Submit an automated account deletion or token erasure request.',
        primaryButtonText: 'Go To Data Deletion',
        primaryButtonHref: '/data-deletion',
      }}
      relatedPages={[
        { title: 'Terms', description: 'Terms of Service.', href: '/company/trust/terms', groupLabel: 'Trust' },
        { title: 'Cookies', description: 'Cookie disclosures.', href: '/company/trust/cookies', groupLabel: 'Trust' },
        { title: 'Data Deletion', description: 'Interactive erasure form.', href: '/data-deletion', groupLabel: 'Trust' },
      ]}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {PRIVACY_PAGE_CONTENT.sections.map((s) => (
          <section key={s.heading} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-xl font-extrabold text-white">{s.heading}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{s.content}</p>
          </section>
        ))}
      </div>
    </CompanyPageShell>
  );
}
