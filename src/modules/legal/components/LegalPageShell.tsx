'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, FileText, ArrowLeft, AlertCircle } from 'lucide-react';
import { LEGAL_NAVIGATION_GROUPS } from '../config/legalNavigation';
import { LEGAL_FACTS } from '../config/legalFacts';

interface LegalPageShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  effectiveDate?: string;
  lastUpdated?: string;
  reviewStatus?: string;
  breadcrumbs?: { label: string; href: string }[];
}

export function LegalPageShell({
  children,
  title,
  subtitle,
  effectiveDate = LEGAL_FACTS.effectiveDate,
  lastUpdated = LEGAL_FACTS.lastUpdated,
  reviewStatus = 'DRAFT FOR REVIEW - PENDING LEGAL APPROVAL',
  breadcrumbs = [],
}: LegalPageShellProps) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-[#040609] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden font-sans">
      {/* Background Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-600/5 blur-[180px] pointer-events-none" />

      {/* Sub-header Breadcrumb Bar */}
      <div className="border-b border-slate-800/90 bg-[#070a12]/90 backdrop-blur-xl sticky top-[72px] sm:top-[76px] lg:top-[80px] z-40 shadow-md shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/legal" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-slate-200">Legal Center</span>
            </Link>
            {breadcrumbs.map((b) => (
              <React.Fragment key={b.href}>
                <span className="text-slate-600">/</span>
                <span className="text-amber-400 font-semibold truncate max-w-[200px] sm:max-w-none">{b.label}</span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Sidebar Navigation Panel */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="p-3.5 bg-[#0c101d] border border-slate-800/90 rounded-xl flex items-center gap-2.5 shadow-sm">
              <FileText className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Legal Directory</span>
            </div>

            <div className="space-y-6">
              {LEGAL_NAVIGATION_GROUPS.map((group) => (
                <div key={group.groupKey} className="space-y-2">
                  <h3 className="px-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                    {group.groupLabel}
                  </h3>
                  <nav className="flex flex-col gap-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center justify-between ${
                            isActive
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-sm'
                              : 'bg-transparent border-transparent text-slate-400 hover:text-slate-100 hover:bg-[#0c101d]/70 hover:border-slate-800/60'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-500/20 border border-rose-500/30 text-rose-300">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </aside>

          {/* Document Content Surface */}
          <article className="lg:col-span-3">
            <div className="relative rounded-2xl bg-[#0c101d] backdrop-blur-xl border border-slate-800/90 border-t-white/10 p-6 sm:p-10 shadow-[0_12px_36px_rgba(0,0,0,0.5)] space-y-8">
              {/* Document Header Zone */}
              <div className="border-b border-slate-800/90 pb-6 space-y-3">
                {/* Draft Review Banner */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{reviewStatus}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{title}</h1>
                {subtitle && <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">{subtitle}</p>}
                
                <div className="text-[11px] text-slate-400 pt-2 font-mono flex flex-wrap items-center gap-3">
                  <span>Operating Entity: <strong className="text-slate-200">{LEGAL_FACTS.operatingEntity}</strong></span>
                  <span>•</span>
                  <span>Effective: {effectiveDate}</span>
                  <span>•</span>
                  <span>Last Updated: {lastUpdated}</span>
                </div>
              </div>

              {/* Document Body Content Zone */}
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-6">
                {children}
              </div>

              {/* Support & Contact Footer Block */}
              <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-300">Questions regarding our legal terms?</p>
                  <p>Contact our compliance team at <a href={`mailto:${LEGAL_FACTS.supportEmail}`} className="text-amber-400 underline font-mono">{LEGAL_FACTS.supportEmail}</a>.</p>
                </div>
                <Link
                  href="/data-deletion"
                  className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-[#05070c] hover:bg-slate-900 text-rose-300 hover:text-rose-200 font-mono text-[11px] font-bold transition-colors shrink-0"
                >
                  Data Deletion Request
                </Link>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
