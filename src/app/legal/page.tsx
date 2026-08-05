import React from 'react';
import Link from 'next/link';
import { createLegalMetadata } from '@/modules/legal/metadata/createLegalMetadata';
import { LegalPageShell } from '@/modules/legal/components/LegalPageShell';
import { LEGAL_NAVIGATION_GROUPS } from '@/modules/legal/config/legalNavigation';
import { LEGAL_FACTS } from '@/modules/legal/config/legalFacts';
import { ShieldCheck, FileText, ArrowRight, Lock, Trash2, Mail } from 'lucide-react';

export const metadata = createLegalMetadata({
  title: 'Legal Center',
  description: 'Central legal index, privacy terms, terms of service, cookie policy, GDPR data rights, and data deletion for Mini Post App.',
  path: '/legal',
});

export default function LegalCenterPage() {
  return (
    <LegalPageShell
      title="Legal & Compliance Center"
      subtitle="Centralized repository of legal terms, privacy policies, subprocessors, data protection rights, and regulatory disclosures for Mini Post App."
      breadcrumbs={[{ label: 'Legal Center', href: '/legal' }]}
    >
      <div className="space-y-10">
        {/* Operating Entity Banner */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-3 shadow-lg">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Corporate Identity & Operating Entity</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Mini Post App is owned and operated by <strong className="text-white">{LEGAL_FACTS.operatingEntity}</strong>.
            All legal contracts, privacy disclosures, subprocessor management, and user data rights are governed under applicable laws and company policies.
          </p>
          <div className="text-xs font-mono text-slate-400 pt-1 flex flex-wrap items-center gap-4 border-t border-amber-500/20 pt-3">
            <span>Primary Domain: {LEGAL_FACTS.primaryDomain}</span>
            <span>•</span>
            <span>Support: {LEGAL_FACTS.supportEmail}</span>
            <span>•</span>
            <span>Data Rights: {LEGAL_FACTS.dataDeletionEmail}</span>
          </div>
        </div>

        {/* Data Deletion & Privacy Quick Action Card */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-400" />
                <span>Account & Data Erasure Workflow</span>
              </h3>
              <p className="text-xs text-slate-300">
                Submit an instant automated data deletion request or revoke connected social media OAuth access tokens.
              </p>
            </div>
            <Link
              href="/data-deletion"
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shrink-0"
            >
              <span>Go To Data Deletion</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Structured 4-Group Legal Document Directory */}
        <div className="space-y-8 pt-2">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Legal Document Directory</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEGAL_NAVIGATION_GROUPS.map((group) => (
              <div
                key={group.groupKey}
                className="rounded-2xl border border-slate-800 bg-[#05070c] p-6 space-y-4 shadow-md"
              >
                <div className="border-b border-slate-800/80 pb-2.5 flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    {group.groupLabel}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {group.items.length} Documents
                  </span>
                </div>

                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group flex flex-col p-2.5 rounded-xl hover:bg-slate-900/80 border border-transparent hover:border-slate-800 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                            {item.label}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        {item.description && (
                          <span className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {item.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LegalPageShell>
  );
}
