import React from 'react';
import { COMPANY_FACTS } from '../config/companyFacts';

interface EmptyStateCardProps {
  title: string;
  description: string;
  badge?: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyStateCard({
  title,
  description,
  badge = 'IN PREPARATION',
  actionText = 'Contact Support',
  actionHref = `mailto:${COMPANY_FACTS.supportEmail}`,
}: EmptyStateCardProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0c101a] p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto shadow-xl">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
        <span>{badge}</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-white">{title}</h2>
      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">{description}</p>

      {actionText && actionHref && (
        <div className="pt-2">
          <a
            href={actionHref}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400/50 text-slate-200 hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all"
          >
            <span>{actionText}</span>
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}
