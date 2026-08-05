import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { CAREERS_PAGE_CONTENT } from '@/modules/company/content/companyContent';
import { COMPANY_FACTS } from '@/modules/company/config/companyFacts';

export const metadata = buildCompanyMetadata({
  title: 'Careers & Vacancies',
  description: 'Learn about working at Mini Post App, our engineering culture pillars, and current vacancy status.',
  path: '/company/careers',
});

export default function CareersPage() {
  return (
    <CompanyPageShell
      groupKey="company"
      groupLabel="Company"
      badge={CAREERS_PAGE_CONTENT.hero.badge}
      title={CAREERS_PAGE_CONTENT.hero.title}
      subtitle={CAREERS_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Careers', href: '/company/careers' }]}
      canonicalPath="/company/careers"
      metaDescription="Learn about working at Mini Post App and current vacancy status."
      cta={{
        title: 'General Talent Inquiries',
        description: 'Interested in future opportunities? Send your resume to our official mailbox.',
        primaryButtonText: 'Send General Inquiry Email',
        primaryButtonHref: `mailto:${COMPANY_FACTS.supportEmail}?subject=General%20Talent%20Inquiry`,
      }}
      relatedPages={[
        { title: 'About Us', description: 'Overview of Mini Post App.', href: '/company/about', groupLabel: 'Company' },
        { title: 'Values', description: 'Core team principles.', href: '/company/values', groupLabel: 'Company' },
      ]}
    >
      {/* Active Vacancy Status Card */}
      <section className="rounded-3xl border border-amber-500/30 bg-[#0c101a] p-8 sm:p-12 text-center space-y-4 shadow-2xl max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
          <span>VACANCY STATUS: NO ACTIVE OPENINGS</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white">Current Openings Status</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
          {CAREERS_PAGE_CONTENT.status.message}
        </p>
        <p className="text-xs font-mono text-slate-400">
          {CAREERS_PAGE_CONTENT.status.contactNotice}
        </p>
      </section>

      {/* Culture Pillars */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">OUR CULTURE</span>
          <h2 className="text-2xl font-black text-white">Engineering & Work Culture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAREERS_PAGE_CONTENT.culturePillars.map((p) => (
            <div key={p.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-6 space-y-3 shadow-xl">
              <h3 className="text-base font-extrabold text-white">{p.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </CompanyPageShell>
  );
}
