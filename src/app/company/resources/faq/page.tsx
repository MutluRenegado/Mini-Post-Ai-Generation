import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { FAQ_PAGE_CONTENT } from '@/modules/company/content/resourcesContent';
import { COMPANY_FACTS } from '@/modules/company/config/companyFacts';

export const metadata = buildCompanyMetadata({
  title: 'FAQ',
  description: 'Frequently asked questions about Mini Post App publishing, Gemini AI Flash engine, billing, and OAuth security.',
  path: '/company/resources/faq',
});

export default function FaqPage() {
  return (
    <CompanyPageShell
      groupKey="resources"
      groupLabel="Resources"
      badge={FAQ_PAGE_CONTENT.hero.badge}
      title={FAQ_PAGE_CONTENT.hero.title}
      subtitle={FAQ_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'FAQ', href: '/company/resources/faq' }]}
      canonicalPath="/company/resources/faq"
      metaDescription="Frequently asked questions about Mini Post App."
      cta={{
        title: 'Have Additional Questions?',
        description: 'Contact our support team directly for personal assistance.',
        primaryButtonText: 'Contact Support',
        primaryButtonHref: `mailto:${COMPANY_FACTS.supportEmail}`,
      }}
      relatedPages={[
        { title: 'Help Center', description: 'Explore support hub.', href: '/company/resources/help', groupLabel: 'Resources' },
        { title: 'Security', description: 'AES-256 vault security.', href: '/company/trust/security', groupLabel: 'Trust' },
      ]}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {FAQ_PAGE_CONTENT.faqs.map((faq) => (
          <div key={faq.q} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-6 sm:p-8 space-y-3 shadow-xl">
            <h2 className="text-base sm:text-lg font-extrabold text-white">{faq.q}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
