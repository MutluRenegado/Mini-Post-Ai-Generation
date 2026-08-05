import React from 'react';
import { Surface } from './Surface';

export interface CardProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
}

export function Card({
  title,
  subtitle,
  badge,
  icon,
  footer,
  children,
  interactive = false,
  className = '',
}: CardProps) {
  return (
    <Surface
      level={3}
      interactive={interactive}
      className={`p-5 sm:p-6 flex flex-col justify-between space-y-4 ${className}`.trim()}
    >
      <div className="space-y-3">
        {(title || icon || badge) && (
          <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
            <div className="flex items-center gap-2.5">
              {icon && (
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  {icon}
                </div>
              )}
              {title && <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>}
            </div>
            {badge && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                {badge}
              </span>
            )}
          </div>
        )}
        {subtitle && <p className="text-xs text-slate-400 leading-relaxed">{subtitle}</p>}
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">{children}</div>
      </div>

      {footer && <div className="pt-3 border-t border-slate-800/80 mt-auto">{footer}</div>}
    </Surface>
  );
}
