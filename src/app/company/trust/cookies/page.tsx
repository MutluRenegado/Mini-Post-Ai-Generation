import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { COOKIES_PAGE_CONTENT } from '@/modules/company/content/trustContent';

export const metadata = buildCompanyMetadata({
  title: 'Cookie Policy',
  description: 'Official Cookie Policy and tracking technology disclosures for Mini Post App.',
  path: '/company/trust/cookies',
});

export default function CookiesPage() {
  return (
    <CompanyPageShell
      groupKey="trust"
      groupLabel="Trust"
      badge={COOKIES_PAGE_CONTENT.hero.badge}
      title={COOKIES_PAGE_CONTENT.hero.title}
      subtitle={COOKIES_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Cookies', href: '/company/trust/cookies' }]}
      canonicalPath="/company/trust/cookies"
      metaDescription="Official Cookie Policy for Mini Post App."
      cta={{
        title: 'Learn More About Privacy',
        description: 'Read our full Privacy Policy.',
        primaryButtonText: 'View Privacy Policy',
        primaryButtonHref: '/company/trust/privacy',
      }}
      relatedPages={[
        { title: 'Privacy', description: 'Privacy Policy.', href: '/company/trust/privacy', groupLabel: 'Trust' },
        { title: 'GDPR', description: 'EU Data Rights.', href: '/company/trust/gdpr', groupLabel: 'Trust' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COOKIES_PAGE_CONTENT.categories.map((c) => (
          <div key={c.name} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-lg font-extrabold text-white">{c.name}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
