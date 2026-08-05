import React from 'react';

export const DesignSystemTokens = {
  colors: {
    bgDark: 'bg-slate-950',
    surfaceDark: 'bg-slate-900',
    borderDark: 'border-slate-800',
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white',
    accentText: 'text-cyan-400',
    successText: 'text-emerald-400',
    textMuted: 'text-slate-400',
  },
  typography: {
    heading: 'font-sans font-bold tracking-tight text-white',
    mono: 'font-mono text-xs',
  },
};

export const StudioButton: React.FC<{
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ variant = 'primary', children, onClick, className = '' }) => {
  const base = 'px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer';
  const styles = {
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/50',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white',
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const StudioCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`p-5 bg-slate-900 rounded-xl border border-slate-800 shadow-xl font-sans ${className}`}>
      {children}
    </div>
  );
};
