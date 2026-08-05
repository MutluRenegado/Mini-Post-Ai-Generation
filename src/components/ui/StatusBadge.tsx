import React from 'react';

export interface StatusBadgeProps {
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: string;
  className?: string;
}

export function StatusBadge({ status = 'info', label, className = '' }: StatusBadgeProps) {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dot-bg-emerald-400',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20 dot-bg-amber-400',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20 dot-bg-rose-400',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 dot-bg-cyan-400',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700 dot-bg-slate-400',
  };

  const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-rose-400',
    info: 'bg-cyan-400',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${styles[status]} ${className}`.trim()}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      {label}
    </span>
  );
}
