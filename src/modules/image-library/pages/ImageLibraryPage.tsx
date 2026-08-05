'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  VisualReference,
  ImageLibrarySearchFilters,
  PaginationResult,
  ReviewStatus,
} from '../models/visual-reference.model';
import { ImageLibraryAdminService } from '../services/image-library-admin.service';
import { FirestoreImageLibraryRepository } from '../repositories/firestore-image-library.repository';
import { ImageLibraryFilterPanel } from '../components/ImageLibraryFilterPanel';
import { ImageThumbnailGrid } from '../components/ImageThumbnailGrid';
import { ImageDetailModal } from '../components/ImageDetailModal';
import { ImageUploadModal } from '../components/ImageUploadModal';
import {
  Search,
  Upload,
  Filter,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

const repository = new FirestoreImageLibraryRepository();
const adminService = new ImageLibraryAdminService(repository);

export function ImageLibraryPage() {
  const [filters, setFilters] = useState<ImageLibrarySearchFilters>({
    page: 1,
    pageSize: 12,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });

  const [pagination, setPagination] = useState<PaginationResult<VisualReference>>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 1,
  });

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeDetailRef, setActiveDetailRef] = useState<VisualReference | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await repository.search(filters);
      setPagination(res);

      const all = await repository.getAll();
      setStats({
        total: all.length,
        approved: all.filter((r) => r.review?.status === 'APPROVED').length,
        pending: all.filter((r) => r.review?.status === 'PENDING').length,
        rejected: all.filter((r) => r.review?.status === 'REJECTED').length,
      });
    } catch {
      // Load error handle
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleSearchQueryChange = (q: string) => {
    setFilters((prev) => ({ ...prev, query: q, page: 1 }));
  };

  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleApprove = async (id: string) => {
    try {
      await adminService.setReviewStatus(id, 'APPROVED');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Cannot approve reference without confirmed rights.');
    }
  };

  const handleReject = async (id: string) => {
    await adminService.setReviewStatus(id, 'REJECTED');
    await loadData();
  };

  const handleArchive = async (id: string) => {
    await adminService.setReviewStatus(id, 'ARCHIVED');
    await loadData();
  };

  const handleUploadFile = async (file: File) => {
    const reader = new FileReader();
    return new Promise<any>((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const res = await adminService.processUpload({
            base64Data,
            originalFileName: file.name,
            mimeType: file.type || 'image/jpeg',
            fileSizeBytes: file.size,
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read local file.'));
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07090E] text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Header */}
      <header className="bg-[#0C0F17] border-b border-[#1C2234] px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-500/20">
            VL
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
              Visual Intelligence Image Library
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                MILESTONE 1
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">
              Canonical Reference Photo & Visual Intelligence Repository
            </p>
          </div>
        </div>

        {/* Stats Pill Bar */}
        <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Total: <strong>{stats.total}</strong></span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved: <strong>{stats.approved}</strong></span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending: <strong>{stats.pending}</strong></span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected: <strong>{stats.rejected}</strong></span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowFilterPanel((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showFilterPanel
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> Filter Panel
          </button>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Images
          </button>
        </div>
      </header>

      {/* Main Search & Secondary Bar */}
      <div className="bg-[#090C13] border-b border-[#1C2234] px-6 py-2.5 flex items-center justify-between gap-4 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, topic, industry, scene, objects..."
            value={filters.query || ''}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:border-cyan-500 outline-none"
          />
        </div>

        <div className="text-xs font-mono text-slate-400">
          Selected: <strong className="text-cyan-400">{selectedIds.length}</strong> items
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Filter Panel */}
        {showFilterPanel && (
          <ImageLibraryFilterPanel
            filters={filters}
            onChange={(f) => setFilters(f)}
            onReset={() => setFilters({ page: 1, pageSize: 12 })}
          />
        )}

        {/* Center Grid Content */}
        <ImageThumbnailGrid
          pagination={pagination}
          selectedIds={selectedIds}
          onSelectToggle={handleSelectToggle}
          onPreview={(ref) => setActiveDetailRef(ref)}
          onEdit={(ref) => setActiveDetailRef(ref)}
          onApprove={handleApprove}
          onReject={handleReject}
          onArchive={handleArchive}
          onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
        />
      </div>

      {/* Modals */}
      {showUploadModal && (
        <ImageUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadFile={handleUploadFile}
          onUploadSuccess={loadData}
        />
      )}

      {activeDetailRef && (
        <ImageDetailModal
          reference={activeDetailRef}
          onClose={() => setActiveDetailRef(null)}
          onSaveMetadata={async (id, updates) => {
            await adminService.updateMetadata(id, updates);
            await loadData();
          }}
          onUpdateRights={async (id, rights) => {
            await adminService.updateRights(id, rights);
            await loadData();
          }}
          onSetReviewStatus={async (id, status, notes, reason) => {
            await adminService.setReviewStatus(id, status, 'admin', notes, reason);
            await loadData();
          }}
        />
      )}
    </div>
  );
}
