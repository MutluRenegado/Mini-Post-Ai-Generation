"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, FileText, ArrowLeft } from "lucide-react";

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  lastUpdated?: string;
}

export const LEGAL_NAV_ITEMS = [
  { label: "Legal Center", href: "/legal" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Data Deletion Request", href: "/data-deletion" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "GDPR Information", href: "/gdpr" },
  { label: "Data Processing Agreement", href: "/data-processing-agreement" },
  { label: "Security & Trust", href: "/security" },
  { label: "Subprocessors Directory", href: "/subprocessors" },
];

export default function LegalLayout({
  children,
  title,
  subtitle,
  lastUpdated = "August 1, 2026",
}: LegalLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-[#040609] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden font-sans">
      {/* Background Lighting Gradients */}
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
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-semibold truncate max-w-[200px] sm:max-w-none">{title}</span>
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

      {/* Main Spatial Grid Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Sidebar Navigation Panel */}
          <aside className="lg:col-span-1 space-y-3">
            <div className="p-3.5 bg-[#0c101d] border border-slate-800/90 rounded-xl flex items-center gap-2.5 shadow-sm">
              <FileText className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Legal Directory</span>
            </div>
            <nav className="flex flex-col gap-1">
              {LEGAL_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[inset_0_1px_1px_rgba(245,158,11,0.1)]"
                        : "bg-transparent border-transparent text-slate-400 hover:text-slate-100 hover:bg-[#0c101d]/70 hover:border-slate-800/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Document Content Surface Card */}
          <article className="lg:col-span-3">
            <div className="relative rounded-2xl bg-[#0c101d] backdrop-blur-xl border border-slate-800/90 border-t-white/10 p-6 sm:p-10 shadow-[0_12px_36px_rgba(0,0,0,0.5)] space-y-8">
              {/* Document Header Zone */}
              <div className="border-b border-slate-800/90 pb-6 space-y-2.5">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{title}</h1>
                {subtitle && <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">{subtitle}</p>}
                <div className="text-[11px] text-slate-500 pt-2 font-mono flex items-center gap-3">
                  <span>Effective: August 1, 2026</span>
                  <span>•</span>
                  <span>Last Updated: {lastUpdated}</span>
                </div>
              </div>

              {/* Document Body Content Zone */}
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-6">
                {children}
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
