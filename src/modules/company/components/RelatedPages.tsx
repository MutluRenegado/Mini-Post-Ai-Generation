import React from 'react';
import Link from 'next/link';
import { RelatedPageRef } from '../types/company';

interface RelatedPagesProps {
  pages: RelatedPageRef[];
}

export function RelatedPages({ pages }: RelatedPagesProps) {
  if (!pages || pages.length === 0) return null;

  return (
    <section className="space-y-6 pt-10 border-t border-slate-800/80">
      <div className="space-y-1">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
          EXPLORE MORE
        </span>
        <h2 className="text-xl font-black text-white">Related Module Pages</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group rounded-2xl border border-slate-800 bg-[#0c101a] p-5 hover:border-amber-500/40 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                {page.groupLabel}
              </span>
              <h3 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors">
                {page.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {page.description}
              </p>
            </div>
            <div className="pt-3 text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1">
              <span>View Page</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
