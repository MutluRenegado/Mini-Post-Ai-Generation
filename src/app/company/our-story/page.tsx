import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { STORY_PAGE_CONTENT } from '@/modules/company/content/companyContent';

export const metadata = buildCompanyMetadata({
  title: 'Our Story',
  description: 'Read about the origin and development journey behind Mini Post App.',
  path: '/company/our-story',
});

export default function OurStoryPage() {
  return (
    <CompanyPageShell
      groupKey="company"
      groupLabel="Company"
      badge={STORY_PAGE_CONTENT.hero.badge}
      title={STORY_PAGE_CONTENT.hero.title}
      subtitle={STORY_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'Our Story', href: '/company/our-story' }]}
      canonicalPath="/company/our-story"
      metaDescription="Read about the origin and development journey behind Mini Post App."
      cta={{
        title: 'Join the Publishing Revolution',
        description: 'Start managing your social content from one streamlined dashboard.',
        primaryButtonText: 'Explore Creator Studio',
        primaryButtonHref: '/dashboard',
      }}
      relatedPages={[
        { title: 'About Us', description: 'Overview of Mini Post App.', href: '/company/about', groupLabel: 'Company' },
        { title: 'Mission', description: 'Our core purpose.', href: '/company/mission', groupLabel: 'Company' },
      ]}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {STORY_PAGE_CONTENT.narrative.map((item) => (
          <section key={item.title} className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 space-y-3 shadow-xl">
            <h2 className="text-xl font-extrabold text-white">{item.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.content}</p>
          </section>
        ))}
      </div>
    </CompanyPageShell>
  );
}
