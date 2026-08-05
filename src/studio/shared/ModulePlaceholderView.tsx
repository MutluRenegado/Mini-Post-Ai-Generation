'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ModulePlaceholderViewProps {
  title: string;
  description: string;
  icon: React.ElementType;
  phaseInfo: string;
  onBack?: () => void;
}

export function ModulePlaceholderView({
  title,
  description,
  icon: Icon,
  phaseInfo,
  onBack,
}: ModulePlaceholderViewProps) {
  return (
    <div className="space-y-6 p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Studio Dashboard
          </button>
        )}
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 ml-auto">
          {phaseInfo}
        </span>
      </div>

      <div className="rounded-3xl bg-[#0F131E] border border-slate-800 p-8 md:p-12 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
          <Icon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">{description}</p>
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/40 px-4 py-2 rounded-xl border border-cyan-800/40">
          Module Shell Initialized & Ready
        </div>
      </div>
    </div>
  );
}
