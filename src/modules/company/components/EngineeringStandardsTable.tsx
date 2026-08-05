'use client';

import React, { useState, useMemo } from 'react';
import { ENGINEERING_STANDARDS, StandardCategory } from '../content/engineeringStandards';
import { Search, Filter, RefreshCw } from 'lucide-react';

const CATEGORIES: StandardCategory[] = [
  'Internal Engineering',
  'AI and Content',
  'Design System',
  'Social Platform',
  'Video',
  'Publishing',
  'Accessibility',
  'Compliance',
];

export function EngineeringStandardsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredStandards = useMemo(() => {
    return ENGINEERING_STANDARDS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.implementation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.publishedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
  };

  return (
    <section className="space-y-8 pt-4">
      {/* Section Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-extrabold uppercase tracking-widest">
          <span>ENGINEERING FRAMEWORK DIRECTORY</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Engineering Standards
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Mini Post App is engineered according to a comprehensive set of internal and industry-recognized standards. Our production workflow aligns with these standards throughout the entire content lifecycle—from AI prompt generation and content creation to image generation, quality assurance, accessibility, platform compliance, sizing, scheduling, and publishing. This standards-driven approach helps ensure consistency, reliability, maintainability, and high-quality output across every supported platform.
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c101a] p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by standard name, reference, or publisher..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#05070c] border border-slate-800 focus:border-amber-400 text-slate-100 placeholder-slate-500 rounded-xl text-xs outline-none transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex-1 sm:flex-initial">
              <Filter className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto pl-9 pr-8 py-2.5 bg-[#05070c] border border-slate-800 focus:border-amber-400 text-slate-200 rounded-xl text-xs outline-none transition-colors cursor-pointer"
              >
                <option value="ALL">All Categories ({ENGINEERING_STANDARDS.length})</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {(searchTerm || selectedCategory !== 'ALL') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2.5 rounded-xl border border-slate-800 bg-[#05070c] hover:bg-slate-900 text-slate-400 hover:text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Clear filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Count Summary */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3">
          <span>
            Showing <strong className="text-amber-400 font-bold">{filteredStandards.length}</strong> of{' '}
            <strong className="text-white font-bold">{ENGINEERING_STANDARDS.length}</strong> standards
          </span>
          {selectedCategory !== 'ALL' && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px]">
              Category: {selectedCategory}
            </span>
          )}
        </div>
      </div>

      {/* Desktop & Tablet Table Representation */}
      <div className="hidden md:block rounded-3xl border border-slate-800 bg-[#0c101a] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#05070c]/90 text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-400">
              <th scope="col" className="py-4 px-6 w-1/5">Standard</th>
              <th scope="col" className="py-4 px-6 w-1/4">Reference</th>
              <th scope="col" className="py-4 px-6">Implementation</th>
              <th scope="col" className="py-4 px-6 w-1/6">Published By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 text-xs text-slate-300">
            {filteredStandards.length > 0 ? (
              filteredStandards.map((std) => (
                <tr
                  key={std.id}
                  className="hover:bg-[#121726]/60 transition-colors group"
                >
                  <td className="py-4 px-6 font-extrabold text-white align-top">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-amber-400/70">#{std.order}</span>
                      <span className="group-hover:text-amber-400 transition-colors">{std.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-[11px] text-slate-400 align-top leading-relaxed">
                    {std.reference}
                  </td>
                  <td className="py-4 px-6 text-slate-300 leading-relaxed align-top">
                    {std.implementation}
                  </td>
                  <td className="py-4 px-6 align-top">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#05070c] border border-slate-800 text-[10px] font-mono font-semibold text-slate-300">
                      {std.publishedBy}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-500 font-mono text-xs">
                  No standards found matching your search. Click reset to clear filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack Representation (320px–767px) */}
      <div className="block md:hidden space-y-4">
        {filteredStandards.length > 0 ? (
          filteredStandards.map((std) => (
            <div
              key={std.id}
              className="rounded-2xl border border-slate-800 bg-[#0c101a] p-5 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                  <span className="text-[10px] font-mono text-amber-400">#{std.order}</span>
                  <span>{std.name}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#05070c] border border-slate-800 text-[10px] font-mono text-slate-300 shrink-0">
                  {std.publishedBy}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-amber-400 font-semibold">Reference</div>
                <p className="text-xs text-slate-400 font-mono">{std.reference}</p>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-slate-400 font-semibold">Implementation</div>
                <p className="text-xs text-slate-300 leading-relaxed">{std.implementation}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-[#0c101a] p-8 text-center text-slate-500 font-mono text-xs">
            No standards found matching your search.
          </div>
        )}
      </div>

      {/* External Reference Maintenance Disclaimer Note */}
      <div className="rounded-2xl border border-slate-800/90 bg-[#070a12] p-4 text-xs text-slate-400 leading-relaxed space-y-1">
        <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">
          MAINTENANCE DISCLAIMER & NOTICE
        </span>
        <p>
          External platform policies and technical requirements may change over time. Mini Post App standards should be reviewed and updated as the relevant platform documentation evolves. Reference alignment with external platforms does not imply official endorsement or certification by third-party providers.
        </p>
      </div>
    </section>
  );
}
