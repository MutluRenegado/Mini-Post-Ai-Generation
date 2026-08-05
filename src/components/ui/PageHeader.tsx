import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  badgeColor = 'amber',
  breadcrumbs,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`space-y-3 pb-6 border-b border-slate-800/80 ${className}`.trim()}>
      {/* Breadcrumb row */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-600">/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-amber-400 transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-amber-400 font-semibold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {badge}
            </div>
          )}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{title}</h1>
          {description && (
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl font-normal">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
