import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { TRUST_SAFETY_PAGE_CONTENT } from '@/modules/company/content/trustContent';
import { EngineeringStandardsTable } from '@/modules/company/components/EngineeringStandardsTable';

export const metadata = buildCompanyMetadata({
  title: 'Trust & Safety',
  description: 'Engineering standards, 31-standard directory, responsible AI principles, user safety, and WCAG 2.2 AA accessibility alignment.',
  path: '/company/trust/trust-safety',
});

export default function TrustSafetyPage() {
  return (
    <CompanyPageShell
      groupKey="trust"
      groupLabel="Trust"
      badge={TRUST_SAFETY_PAGE_CONTENT.hero.badge}
      title={TRUST_SAFETY_PAGE_CONTENT.hero.title}
      subtitle={TRUST_SAFETY_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Trust & Safety', href: '/company/trust/trust-safety' }]}
      canonicalPath="/company/trust/trust-safety"
      metaDescription="Engineering standards, responsible AI principles, and user safety."
      cta={{
        title: 'Learn About Data Security Controls',
        description: 'Discover how we protect OAuth tokens and user data.',
        primaryButtonText: 'View Security Specs',
        primaryButtonHref: '/company/trust/security',
      }}
      relatedPages={[
        { title: 'Security', description: 'AES-256 token vault.', href: '/company/trust/security', groupLabel: 'Trust' },
        { title: 'Privacy Policy', description: 'Legal privacy terms.', href: '/company/trust/privacy', groupLabel: 'Trust' },
        { title: 'Data Deletion', description: 'Interactive erasure form.', href: '/data-deletion', groupLabel: 'Trust' },
      ]}
    >
      {/* 1. Product Safety & Responsible AI Principles */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TRUST_SAFETY_PAGE_CONTENT.principles.map((p) => (
          <div key={p.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-lg font-extrabold text-white">{p.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </section>

      {/* 2. Engineering Framework Alignment Cards */}
      <section className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-6 shadow-xl">
        <h2 className="text-xl font-bold text-white text-center">Engineering & Security Framework Alignment</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_SAFETY_PAGE_CONTENT.frameworkAlignment.map((f) => (
            <div key={f.code} className="rounded-2xl border border-slate-800 bg-[#05070c] p-5 space-y-2 text-center">
              <span className="text-sm font-black font-mono text-amber-400">{f.code}</span>
              <p className="text-xs text-slate-300 font-medium">{f.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Comprehensive 31 Engineering Standards Section & Table */}
      <EngineeringStandardsTable />
    </CompanyPageShell>
  );
}
