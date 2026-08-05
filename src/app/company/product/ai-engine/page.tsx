import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { AI_ENGINE_PAGE_CONTENT } from '@/modules/company/content/productContent';

export const metadata = buildCompanyMetadata({
  title: 'AI Engine',
  description: 'Google Gemini AI Flash engine details, sub-second latency specs, format guards, and responsible AI principles.',
  path: '/company/product/ai-engine',
});

export default function AiEnginePage() {
  return (
    <CompanyPageShell
      groupKey="product"
      groupLabel="Product"
      badge={AI_ENGINE_PAGE_CONTENT.hero.badge}
      title={AI_ENGINE_PAGE_CONTENT.hero.title}
      subtitle={AI_ENGINE_PAGE_CONTENT.hero.subtitle}
      breadcrumbs={[{ label: 'AI Engine', href: '/company/product/ai-engine' }]}
      canonicalPath="/company/product/ai-engine"
      metaDescription="Google Gemini AI Flash engine details and response metrics."
      cta={{
        title: 'Experience Sub-Second AI Post Generation',
        description: 'Test Gemini Flash adaptation live in Creator Studio.',
        primaryButtonText: 'Test AI Engine',
        primaryButtonHref: '/dashboard',
      }}
      relatedPages={[
        { title: 'Features', description: 'Live feature list.', href: '/company/product/features', groupLabel: 'Product' },
        { title: 'Trust & Safety', description: 'Responsible AI framework.', href: '/company/trust/trust-safety', groupLabel: 'Trust' },
      ]}
    >
      {/* Specs Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {AI_ENGINE_PAGE_CONTENT.specs.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-800 bg-[#0c101a] p-5 space-y-1 shadow-md">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{s.label}</span>
            <div className="text-sm font-black text-white">{s.value}</div>
          </div>
        ))}
      </section>

      {/* Principles */}
      <section className="space-y-6 pt-4">
        <h2 className="text-xl font-bold text-white text-center">AI Engineering Safeguards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AI_ENGINE_PAGE_CONTENT.principles.map((p) => (
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
