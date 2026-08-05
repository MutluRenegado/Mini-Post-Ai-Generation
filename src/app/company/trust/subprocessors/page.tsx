import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { SUBPROCESSORS_PAGE_CONTENT } from '@/modules/company/content/trustContent';

export const metadata = buildCompanyMetadata({
  title: 'Subprocessors Directory',
  description: 'Verified list of third-party vendor subprocessors utilized by Mini Post App for infrastructure and services.',
  path: '/company/trust/subprocessors',
});

export default function SubprocessorsPage() {
  return (
    <CompanyPageShell
      groupKey="trust"
      groupLabel="Trust"
      badge={SUBPROCESSORS_PAGE_CONTENT.hero.badge}
      title={SUBPROCESSORS_PAGE_CONTENT.hero.title}
      subtitle={SUBPROCESSORS_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Subprocessors', href: '/company/trust/subprocessors' }]}
      canonicalPath="/company/trust/subprocessors"
      metaDescription="Verified list of third-party vendor subprocessors."
      cta={{
        title: 'Questions About Data Processors?',
        description: 'Contact our privacy and security compliance team.',
        primaryButtonText: 'Contact Privacy Team',
        primaryButtonHref: '/company/contact',
      }}
      relatedPages={[
        { title: 'Security', description: 'AES-256 token encryption.', href: '/company/trust/security', groupLabel: 'Trust' },
        { title: 'Privacy', description: 'Privacy Policy.', href: '/company/trust/privacy', groupLabel: 'Trust' },
      ]}
    >
      <div className="space-y-8">
        {SUBPROCESSORS_PAGE_CONTENT.categories.map((cat) => (
          <div key={cat.group} className="rounded-3xl border border-slate-800 bg-[#0c101a] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 space-y-1">
              <h2 className="text-lg font-bold text-white">{cat.group}</h2>
              <p className="text-xs text-slate-400">Evaluated under strict data protection standards.</p>
            </div>
            <div className="divide-y divide-slate-800/60">
              {cat.subprocessors.map((sub) => (
                <div key={sub.name} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-white">{sub.name}</h3>
                    <p className="text-xs text-slate-400">{sub.purpose}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 w-fit shrink-0">
                    {sub.location}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
