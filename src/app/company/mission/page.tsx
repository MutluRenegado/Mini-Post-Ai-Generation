import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { MISSION_PAGE_CONTENT } from '@/modules/company/content/companyContent';

export const metadata = buildCompanyMetadata({
  title: 'Our Mission',
  description: 'Our mission is to make social-content creation clearer, faster, and more controllable for creators and businesses.',
  path: '/company/mission',
});

export default function MissionPage() {
  return (
    <CompanyPageShell
      groupKey="company"
      groupLabel="Company"
      badge={MISSION_PAGE_CONTENT.hero.badge}
      title={MISSION_PAGE_CONTENT.hero.title}
      subtitle={MISSION_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Mission', href: '/company/mission' }]}
      canonicalPath="/company/mission"
      metaDescription="Our mission is to make social-content creation clearer, faster, and more controllable."
      cta={{
        title: 'Experience Faster Publishing',
        description: 'Eliminate repetitive social formatting work today.',
        primaryButtonText: 'Try Free Now',
        primaryButtonHref: '/dashboard',
      }}
      relatedPages={[
        { title: 'Vision', description: 'Our long-term direction.', href: '/company/vision', groupLabel: 'Company' },
        { title: 'Values', description: 'Guiding principles.', href: '/company/values', groupLabel: 'Company' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MISSION_PAGE_CONTENT.goals.map((g) => (
          <div key={g.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-lg font-extrabold text-white">{g.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
