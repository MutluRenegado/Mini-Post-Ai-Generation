import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { STATUS_PAGE_CONTENT } from '@/modules/company/content/trustContent';
import { COMPANY_FACTS } from '@/modules/company/config/companyFacts';

export const metadata = buildCompanyMetadata({
  title: 'System Status',
  description: 'Operational status, system health reporting, and service availability for Mini Post App.',
  path: '/company/trust/status',
});

export default function StatusPage() {
  return (
    <CompanyPageShell
      groupKey="trust"
      groupLabel="Trust"
      badge={STATUS_PAGE_CONTENT.hero.badge}
      title={STATUS_PAGE_CONTENT.hero.title}
      subtitle={STATUS_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Status', href: '/company/trust/status' }]}
      canonicalPath="/company/trust/status"
      metaDescription="Operational status and service availability for Mini Post App."
      cta={{
        title: 'Reporting an Issue?',
        description: 'If you experience unexpected publishing failures, reach out to our team.',
        primaryButtonText: 'Report an Issue',
        primaryButtonHref: `mailto:${COMPANY_FACTS.supportEmail}?subject=Service%20Issue%20Report`,
      }}
      relatedPages={[
        { title: 'Security', description: 'AES-256 token security.', href: '/company/trust/security', groupLabel: 'Trust' },
        { title: 'Help Center', description: 'Support hub.', href: '/company/resources/help', groupLabel: 'Resources' },
      ]}
    >
      {/* Active Operational Indicator */}
      <section className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center space-y-3 shadow-xl max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          <h2 className="text-xl font-black text-emerald-400">{STATUS_PAGE_CONTENT.statusIndicator.state}</h2>
        </div>
        <p className="text-xs font-mono text-slate-400">
          All primary application workflows and API integrations are operational.
        </p>
      </section>

      {/* Services List */}
      <section className="rounded-3xl border border-slate-800 bg-[#0c101a] overflow-hidden shadow-2xl max-w-3xl mx-auto">
        <div className="p-6 border-b border-slate-800 space-y-1">
          <h2 className="text-lg font-bold text-white">Component Health Status</h2>
          <p className="text-xs text-slate-400">Individual service status indicators.</p>
        </div>
        <div className="divide-y divide-slate-800/60">
          {STATUS_PAGE_CONTENT.services.map((srv) => (
            <div key={srv.name} className="p-5 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-white">{srv.name}</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                {srv.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </CompanyPageShell>
  );
}
