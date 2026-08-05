'use client';

import React from 'react';
import { VisualReference } from '../models/visual-reference.model';
import { ShieldCheck, ShieldAlert, Eye, Edit3, CheckCircle, XCircle, Archive, Sparkles } from 'lucide-react';

interface ImageCardProps {
  reference: VisualReference;
  isSelected?: boolean;
  onSelectToggle?: (id: string) => void;
  onPreview: (reference: VisualReference) => void;
  onEdit: (reference: VisualReference) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onArchive?: (id: string) => void;
}

export function ImageCard({
  reference,
  isSelected,
  onSelectToggle,
  onPreview,
  onEdit,
  onApprove,
  onReject,
  onArchive,
}: ImageCardProps) {
  const status = reference.review.status;
  const rights = reference.rights.rightsConfirmed;

  const getStatusBadge = () => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'NEEDS_CHANGES':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'ARCHIVED':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div
      className={`group relative bg-[#0C0F17] border rounded-2xl overflow-hidden transition-all duration-200 hover:border-cyan-500/50 flex flex-col ${
        isSelected ? 'border-cyan-500 shadow-lg shadow-cyan-500/10' : 'border-[#1C2234]'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden select-none flex items-center justify-center">
        {reference.thumbnailPath ? (
          <img
            src={reference.thumbnailPath}
            alt={reference.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-slate-600 font-mono text-xs flex flex-col items-center gap-1">
            <Sparkles className="w-6 h-6 text-slate-700" />
            <span>No Thumbnail</span>
          </div>
        )}

        {/* Selection Checkbox Overlay */}
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={!!isSelected}
            onChange={() => onSelectToggle && onSelectToggle(reference.id)}
            className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/40 bg-slate-900/80 cursor-pointer"
          />
        </div>

        {/* Top Right Badges */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
          {rights ? (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"
              title="Rights Confirmed"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Rights
            </span>
          ) : (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1"
              title="Rights Pending"
            >
              <ShieldAlert className="w-3 h-3 text-amber-400" /> Unconfirmed
            </span>
          )}
        </div>

        {/* Quick Action Overlay Bar */}
        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(reference)}
            className="p-2 rounded-xl bg-slate-900/90 text-slate-200 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Preview Image"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(reference)}
            className="p-2 rounded-xl bg-slate-900/90 text-slate-200 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Edit Metadata & Rights"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          {status !== 'APPROVED' && onApprove && (
            <button
              type="button"
              onClick={() => onApprove(reference.id)}
              className="p-2 rounded-xl bg-emerald-950/90 text-emerald-300 hover:bg-emerald-900 transition-colors"
              title="Approve Reference"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {status !== 'REJECTED' && onReject && (
            <button
              type="button"
              onClick={() => onReject(reference.id)}
              className="p-2 rounded-xl bg-rose-950/90 text-rose-300 hover:bg-rose-900 transition-colors"
              title="Reject Reference"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
          {status !== 'ARCHIVED' && onArchive && (
            <button
              type="button"
              onClick={() => onArchive(reference.id)}
              className="p-2 rounded-xl bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Archive Reference"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Card Info Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-xs text-slate-100 truncate" title={reference.title}>
              {reference.title}
            </h4>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getStatusBadge()}`}
            >
              {status}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
            <span className="truncate">{reference.sourceType}</span>
            <span>{reference.aspectRatio}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1C2234] flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="truncate">{reference.industry || 'General Industry'}</span>
          {reference.qualityScores?.overallQualityScore && (
            <span className="text-cyan-400 font-bold">
              Score: {reference.qualityScores.overallQualityScore}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
