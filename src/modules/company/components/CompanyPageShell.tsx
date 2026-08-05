import React from 'react';
import Link from 'next/link';
import { BreadcrumbItem, ContextualCTA, RelatedPageRef } from '../types/company';
import { CompanyNav } from './CompanyNav';
import { RelatedPages } from './RelatedPages';
import { CompanyJsonLd } from './CompanyJsonLd';

interface CompanyPageShellProps {
  groupKey: 'company' | 'product' | 'resources' | 'trust' | 'media' | 'business';
  groupLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
  canonicalPath: string;
  metaDescription: string;
  cta?: ContextualCTA;
  relatedPages?: RelatedPageRef[];
  children: React.ReactNode;
}

export function CompanyPageShell({
  groupKey,
  groupLabel,
  badge,
  title,
  subtitle,
  breadcrumbs,
  canonicalPath,
  metaDescription,
  cta,
  relatedPages = [],
  children,
}: CompanyPageShellProps) {
  return (
    <div className="relative min-h-screen bg-[#040609] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 font-sans overflow-x-hidden">
      {/* JSON-LD Structured Data */}
      <CompanyJsonLd
        breadcrumbs={breadcrumbs}
        pageTitle={title}
        pageDescription={metaDescription}
        pageUrl={`https://minipostapp.space${canonicalPath}`}
      />

      {/* Category Sub-Navigation Bar */}
      <CompanyNav currentGroupKey={groupKey} />

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12 sm:space-y-16">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/company/about" className="hover:text-amber-400 transition-colors font-medium">
            Company
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 font-medium">{groupLabel}</span>
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.href}>
              <span className="text-slate-600">/</span>
              <span className="text-amber-400 font-semibold truncate max-w-[200px] sm:max-w-none">
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Hero Header Section */}
        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-extrabold uppercase tracking-widest">
            <span>{badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </section>

        {/* Main Body Content */}
        <article className="space-y-12">{children}</article>

        {/* Contextual CTA */}
        {cta && (
          <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#0c101a] to-[#121827] p-8 sm:p-12 text-center space-y-6 shadow-2xl max-w-4xl mx-auto">
            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl font-black text-white">{cta.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{cta.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={cta.primaryButtonHref}
                className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/20 transition-all text-center"
              >
                {cta.primaryButtonText}
              </Link>
              {cta.secondaryButtonText && cta.secondaryButtonHref && (
                <Link
                  href={cta.secondaryButtonHref}
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-full transition-all text-center"
                >
                  {cta.secondaryButtonText}
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Contextual Related Pages */}
        {relatedPages.length > 0 && <RelatedPages pages={relatedPages} />}
      </main>
    </div>
  );
}
