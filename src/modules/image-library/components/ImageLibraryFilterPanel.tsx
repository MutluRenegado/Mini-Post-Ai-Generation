'use client';

import React from 'react';
import { ImageLibrarySearchFilters, ReviewStatus, SourceType } from '../models/visual-reference.model';
import { Filter, RotateCcw, ShieldCheck, Tag, Layers, Monitor } from 'lucide-react';

interface ImageLibraryFilterPanelProps {
  filters: ImageLibrarySearchFilters;
  onChange: (newFilters: ImageLibrarySearchFilters) => void;
  onReset: () => void;
}

export function ImageLibraryFilterPanel({ filters, onChange, onReset }: ImageLibraryFilterPanelProps) {
  const handleStatusToggle = (status: ReviewStatus) => {
    const current = Array.isArray(filters.reviewStatus)
      ? filters.reviewStatus
      : filters.reviewStatus
      ? [filters.reviewStatus]
      : [];

    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];

    onChange({
      ...filters,
      reviewStatus: updated.length === 0 ? undefined : updated,
      page: 1,
    });
  };

  return (
    <aside className="w-64 bg-[#0C0F17] border-r border-[#1C2234] p-4 flex flex-col space-y-6 text-xs text-slate-300 font-sans select-none overflow-y-auto shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1C2234] pb-3">
        <div className="flex items-center gap-2 font-bold text-white tracking-tight">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Refinement Filters</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="p-1 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono text-[10px]"
          title="Reset Filters"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Review Status Section */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1.5 uppercase">
          <ShieldCheck className="w-3.5 h-3.5" /> Approval Status
        </label>
        <div className="space-y-1.5">
          {(['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_CHANGES', 'ARCHIVED'] as ReviewStatus[]).map(
            (status) => {
              const current = Array.isArray(filters.reviewStatus)
                ? filters.reviewStatus
                : filters.reviewStatus
                ? [filters.reviewStatus]
                : [];
              const isChecked = current.includes(status);

              return (
                <label
                  key={status}
                  className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleStatusToggle(status)}
                    className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/40"
                  />
                  <span>{status}</span>
                </label>
              );
            }
          )}
        </div>
      </div>

      {/* Rights Confirmation Status */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1.5 uppercase">
          <ShieldCheck className="w-3.5 h-3.5" /> Rights Status
        </label>
        <select
          value={filters.rightsConfirmed === undefined ? '' : String(filters.rightsConfirmed)}
          onChange={(e) =>
            onChange({
              ...filters,
              rightsConfirmed:
                e.target.value === '' ? undefined : e.target.value === 'true',
              page: 1,
            })
          }
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 outline-none"
        >
          <option value="">All Rights Statuses</option>
          <option value="true">Confirmed Only</option>
          <option value="false">Unconfirmed / Pending</option>
        </select>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1.5 uppercase">
          <Monitor className="w-3.5 h-3.5" /> Aspect Ratio
        </label>
        <select
          value={filters.aspectRatio || ''}
          onChange={(e) =>
            onChange({
              ...filters,
              aspectRatio: e.target.value || undefined,
              page: 1,
            })
          }
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 outline-none"
        >
          <option value="">All Aspect Ratios</option>
          <option value="1:1">1:1 Square</option>
          <option value="16:9">16:9 Landscape</option>
          <option value="4:5">4:5 Vertical</option>
          <option value="9:16">9:16 Full Vertical</option>
          <option value="4:3">4:3 Standard</option>
        </select>
      </div>

      {/* Source Type */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1.5 uppercase">
          <Layers className="w-3.5 h-3.5" /> Source Origin
        </label>
        <select
          value={
            typeof filters.sourceType === 'string' ? filters.sourceType : ''
          }
          onChange={(e) =>
            onChange({
              ...filters,
              sourceType: (e.target.value as SourceType) || undefined,
              page: 1,
            })
          }
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 outline-none"
        >
          <option value="">All Sources</option>
          <option value="Internal Upload">Internal Upload</option>
          <option value="Generated Approved">Generated Approved</option>
          <option value="Generated Rejected">Generated Rejected</option>
          <option value="Licensed External">Licensed External</option>
          <option value="Unsplash Reference">Unsplash Reference</option>
          <option value="Imported Folder">Imported Folder</option>
        </select>
      </div>

      {/* Industry Filter */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1.5 uppercase">
          <Tag className="w-3.5 h-3.5" /> Industry
        </label>
        <input
          type="text"
          placeholder="Filter by industry..."
          value={filters.industry || ''}
          onChange={(e) =>
            onChange({
              ...filters,
              industry: e.target.value || undefined,
              page: 1,
            })
          }
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 outline-none"
        />
      </div>
    </aside>
  );
}
