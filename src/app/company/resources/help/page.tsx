import React from 'react';
import Link from 'next/link';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { HELP_PAGE_CONTENT } from '@/modules/company/content/resourcesContent';
import { COMPANY_FACTS } from '@/modules/company/config/companyFacts';

export const metadata = buildCompanyMetadata({
  title: 'Help Center',
  description: 'Help Center for Mini Post App: FAQs, documentation, account management, and support contact options.',
  path: '/company/resources/help',
});

export default function HelpPage() {
  return (
    <CompanyPageShell
      groupKey="resources"
      groupLabel="Resources"
      badge={HELP_PAGE_CONTENT.hero.badge}
      title={HELP_PAGE_CONTENT.hero.title}
      subtitle={HELP_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Help Center', href: '/company/resources/help' }]}
      canonicalPath="/company/resources/help"
      metaDescription="Help Center for Mini Post App."
      cta={{
        title: 'Need Direct Technical Assistance?',
        description: 'Our customer support team responds within one business day.',
        primaryButtonText: 'Email Support Team',
        primaryButtonHref: `mailto:${COMPANY_FACTS.supportEmail}`,
      }}
      relatedPages={[
        { title: 'FAQ', description: 'Searchable questions.', href: '/company/resources/faq', groupLabel: 'Resources' },
        { title: 'Documentation', description: 'Platform guides.', href: '/company/resources/documentation', groupLabel: 'Resources' },
      ]}
    >
      {/* Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HELP_PAGE_CONTENT.categories.map((cat) => (
          <Link
            key={cat.title}
            href={cat.href}
            className="group rounded-3xl border border-slate-800 bg-[#0c101a] p-6 hover:border-amber-500/40 transition-all shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors">
                {cat.title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
            </div>
            <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
              <span>Explore</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Support Details */}
      <section className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 text-center space-y-3 shadow-xl max-w-2xl mx-auto">
        <h2 className="text-lg font-bold text-white">Direct Support Channel</h2>
        <p className="text-xs text-slate-300 font-mono">
          Email: <a href={`mailto:${COMPANY_FACTS.supportEmail}`} className="text-amber-400 underline font-bold">{COMPANY_FACTS.supportEmail}</a>
        </p>
        <p className="text-xs text-slate-400">
          Hours: {HELP_PAGE_CONTENT.supportNotice.hours} • Turnaround: {HELP_PAGE_CONTENT.supportNotice.responseWindow}
        </p>
      </section>
    </CompanyPageShell>
  );
}
