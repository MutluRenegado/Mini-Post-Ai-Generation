import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { SECURITY_PAGE_CONTENT } from '@/modules/company/content/trustContent';

export const metadata = buildCompanyMetadata({
  title: 'Security',
  description: 'Verified security controls: OAuth 2.0 token security, AES-256 vault encryption, TLS 1.3, and Firebase infrastructure.',
  path: '/company/trust/security',
});

export default function SecurityPage() {
  return (
    <CompanyPageShell
      groupKey="trust"
      groupLabel="Trust"
      badge={SECURITY_PAGE_CONTENT.hero.badge}
      title={SECURITY_PAGE_CONTENT.hero.title}
      subtitle={SECURITY_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Security', href: '/company/trust/security' }]}
      canonicalPath="/company/trust/security"
      metaDescription="Verified security controls for Mini Post App."
      cta={{
        title: 'View Subprocessors Directory',
        description: 'Transparent list of third-party vendor subprocessors.',
        primaryButtonText: 'View Subprocessors',
        primaryButtonHref: '/company/trust/subprocessors',
      }}
      relatedPages={[
        { title: 'Subprocessors', description: 'Third-party vendors.', href: '/company/trust/subprocessors', groupLabel: 'Trust' },
        { title: 'Privacy Policy', description: 'Legal privacy terms.', href: '/company/trust/privacy', groupLabel: 'Trust' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECURITY_PAGE_CONTENT.controls.map((c) => (
          <div key={c.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-lg font-extrabold text-white">{c.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
