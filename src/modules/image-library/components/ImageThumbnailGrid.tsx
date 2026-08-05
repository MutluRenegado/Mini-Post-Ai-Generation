'use client';

import React from 'react';
import { VisualReference, PaginationResult } from '../models/visual-reference.model';
import { ImageCard } from './ImageCard';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface ImageThumbnailGridProps {
  pagination: PaginationResult<VisualReference>;
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onPreview: (reference: VisualReference) => void;
  onEdit: (reference: VisualReference) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onArchive?: (id: string) => void;
  onPageChange: (newPage: number) => void;
}

export function ImageThumbnailGrid({
  pagination,
  selectedIds,
  onSelectToggle,
  onPreview,
  onEdit,
  onApprove,
  onReject,
  onArchive,
  onPageChange,
}: ImageThumbnailGridProps) {
  const { items, total, page, totalPages } = pagination;

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#07090E] border border-dashed border-[#1C2234] rounded-2xl m-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
          <ImageIcon className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-sm text-slate-200">No Image References Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          No records match your search criteria or filter configuration. Upload new visual images to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 overflow-y-auto">
      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {items.map((ref) => (
          <ImageCard
            key={ref.id}
            reference={ref}
            isSelected={selectedIds.includes(ref.id)}
            onSelectToggle={onSelectToggle}
            onPreview={onPreview}
            onEdit={onEdit}
            onApprove={onApprove}
            onReject={onReject}
            onArchive={onArchive}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pt-4 border-t border-[#1C2234] flex items-center justify-between text-xs text-slate-400 font-mono">
        <div>
          Showing {items.length} of <span className="text-slate-200 font-bold">{total}</span> total references
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 disabled:opacity-40 disabled:hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span>
            Page <strong className="text-slate-200">{page}</strong> of{' '}
            <strong className="text-slate-200">{totalPages}</strong>
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 disabled:opacity-40 disabled:hover:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
