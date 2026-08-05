import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { ABOUT_PAGE_CONTENT } from '@/modules/company/content/companyContent';
import { COMPANY_FACTS } from '@/modules/company/config/companyFacts';

export const metadata = buildCompanyMetadata({
  title: 'About Us',
  description: 'Learn about Mini Post App, our social content publishing workflow, philosophy, and operating entity Yoga Products Top Limited.',
  path: '/company/about',
});

export default function AboutPage() {
  return (
    <CompanyPageShell
      groupKey="company"
      groupLabel="Company"
      badge={ABOUT_PAGE_CONTENT.hero.badge}
      title={ABOUT_PAGE_CONTENT.hero.title}
      subtitle={ABOUT_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'About', href: '/company/about' }]}
      canonicalPath="/company/about"
      metaDescription="Overview of Mini Post App, workflow & operating entity Yoga Products Top Limited"
      cta={{
        title: 'Ready to Experience the Workflow?',
        description: 'Try Creator Studio to craft, optimize, and schedule multi-channel posts in seconds.',
        primaryButtonText: 'Go To Dashboard',
        primaryButtonHref: '/dashboard',
        secondaryButtonText: 'Explore Features',
        secondaryButtonHref: '/company/product/features',
      }}
      relatedPages={[
        { title: 'Our Story', description: 'Our product origin narrative.', href: '/company/our-story', groupLabel: 'Company' },
        { title: 'Mission', description: 'Eliminating multi-channel publishing friction.', href: '/company/mission', groupLabel: 'Company' },
        { title: 'Values', description: 'Clarity, control, and responsible AI.', href: '/company/values', groupLabel: 'Company' },
      ]}
    >
      {/* 4-Step Workflow Section */}
      <section className="space-y-8 bg-[#0c101a] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
            SYSTEMATIC WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{ABOUT_PAGE_CONTENT.workflow.title}</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            The core four-stage pipeline that powers Mini Post App.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {ABOUT_PAGE_CONTENT.workflow.steps.map((s) => (
            <div key={s.step} className="rounded-2xl border border-slate-800 bg-[#05070c] p-6 space-y-3 shadow-md">
              <div className="text-2xl font-black font-mono text-amber-400">{s.step}</div>
              <h3 className="text-base font-extrabold text-white">{s.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Identity Card */}
      <section className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-white">Operating Entity & Corporate Identity</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Mini Post App is owned and operated by <strong className="text-white">{COMPANY_FACTS.operatingEntity}</strong>.
          We build software focused on personal publishing efficiency, prompt engineering controls, and strict compliance with platform rules.
        </p>
        <div className="text-xs font-mono text-slate-400 pt-2 flex flex-wrap items-center gap-4">
          <span>Entity: {COMPANY_FACTS.operatingEntity}</span>
          <span>•</span>
          <span>Domain: {COMPANY_FACTS.primaryDomain}</span>
          <span>•</span>
          <span>Support: {COMPANY_FACTS.supportEmail}</span>
        </div>
      </section>
    </CompanyPageShell>
  );
}
