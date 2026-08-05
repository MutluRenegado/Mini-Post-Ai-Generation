import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { VISION_PAGE_CONTENT } from '@/modules/company/content/companyContent';

export const metadata = buildCompanyMetadata({
  title: 'Our Vision',
  description: 'Our vision for long-term authentic multi-channel personal publishing and digital presence.',
  path: '/company/vision',
});

export default function VisionPage() {
  return (
    <CompanyPageShell
      groupKey="company"
      groupLabel="Company"
      badge={VISION_PAGE_CONTENT.hero.badge}
      title={VISION_PAGE_CONTENT.hero.title}
      subtitle={VISION_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Vision', href: '/company/vision' }]}
      canonicalPath="/company/vision"
      metaDescription="Our vision for authentic multi-channel publishing."
      cta={{
        title: 'Build Your Brand Presence',
        description: 'Publish consistently across all major networks.',
        primaryButtonText: 'Start Publishing',
        primaryButtonHref: '/dashboard',
      }}
      relatedPages={[
        { title: 'Mission', description: 'Our core purpose.', href: '/company/mission', groupLabel: 'Company' },
        { title: 'Values', description: 'Guiding principles.', href: '/company/values', groupLabel: 'Company' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VISION_PAGE_CONTENT.commitments.map((c) => (
          <div key={c.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-lg font-extrabold text-white">{c.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </CompanyPageShell>
  );
}
