'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COMPANY_NAVIGATION_GROUPS } from '../config/navigationConfig';

interface CompanyNavProps {
  currentGroupKey: string;
}

export function CompanyNav({ currentGroupKey }: CompanyNavProps) {
  const pathname = usePathname();
  const group = COMPANY_NAVIGATION_GROUPS[currentGroupKey];

  if (!group) return null;

  return (
    <nav
      aria-label={`${group.label} Sub Navigation`}
      className="border-b border-slate-800/80 bg-[#070a12]/90 backdrop-blur-xl sticky top-[72px] sm:top-[76px] lg:top-[80px] z-30 shadow-md shadow-black/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 sm:gap-2 h-12 min-w-max">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-400/90 pr-2 border-r border-slate-800/80 flex items-center gap-1">
            <span>{group.label}</span>
          </span>

          {group.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-amber-400 ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)] font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
