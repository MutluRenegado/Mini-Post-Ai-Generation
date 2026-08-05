'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Search,
  UploadCloud,
  Image as ImageIcon,
  Video as VideoIcon,
  FileCode,
  Tag,
  Trash2,
  Copy,
  Check,
  ArrowLeft,
  Filter,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { AssetManagerService } from './assets.service';
import { MediaAsset } from '../types/studio.types';

interface AssetLibraryViewProps {
  onBack?: () => void;
}

export function AssetLibraryView({ onBack }: AssetLibraryViewProps) {
  const [mounted, setMounted] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAssetModal, setActiveAssetModal] = useState<MediaAsset | null>(null);

  useEffect(() => {
    setMounted(true);
    setAssets(AssetManagerService.getStoredAssets());
  }, []);

  const handleSimulatedUpload = () => {
    setUploading(true);
    setTimeout(() => {
      const samplePhotos = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800',
      ];
      const randomUrl = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
      const types: MediaAsset['type'][] = ['image', 'video', 'logo'];
      const randomType = types[Math.floor(Math.random() * types.length)];

      const updated = AssetManagerService.saveAsset({
        name: `Uploaded-Asset-${Date.now().toString().slice(-4)}.${randomType === 'video' ? 'mp4' : 'png'}`,
        type: randomType,
        url: randomUrl,
        sizeBytes: Math.floor(Math.random() * 5000000) + 1000000,
        tags: ['uploaded', 'studio', randomType],
      });

      setAssets(updated);
      setUploading(false);
    }, 1000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = AssetManagerService.deleteAsset(id);
    setAssets(updated);
    if (activeAssetModal?.id === id) {
      setActiveAssetModal(null);
    }
  };

  const handleCopyLink = (url: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType =
      selectedType === 'all' ||
      asset.type === selectedType ||
      (selectedType === 'vector' && asset.type === 'logo');
    return matchesSearch && matchesType;
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!mounted) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-slate-400 font-mono text-sm animate-pulse">
        Loading Asset Library Hub...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <FolderKanban className="w-3.5 h-3.5" /> CLOUD ASSET HUB
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight pt-1">📂 Asset Library Studio</h1>
          <p className="text-xs text-slate-400">
            Centralized media storage for high-res images, videos, vectors, and AI generated post assets.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSimulatedUpload}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <>
              <UploadCloud className="w-4 h-4 animate-bounce" /> Uploading Media...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Upload New Asset
            </>
          )}
        </button>
      </div>

      {/* Controls Bar: Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by asset name or tags..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'image', label: 'Images' },
            { id: 'video', label: 'Videos' },
            { id: 'vector', label: 'Logos & Vectors' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedType(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedType === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-3">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-400">No media assets found matching filter.</p>
          <button
            type="button"
            onClick={handleSimulatedUpload}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            + Upload First Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredAssets.map((asset) => {
            const isVideo = asset.type === 'video';
            const isLogo = asset.type === 'logo' || asset.type === 'icon';

            return (
              <div
                key={asset.id}
                onClick={() => setActiveAssetModal(asset)}
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 flex flex-col justify-between backdrop-blur-md transition-all group cursor-pointer shadow-lg hover:shadow-cyan-950/30"
              >
                {/* Media Preview Box */}
                <div className="h-40 bg-slate-950 rounded-xl mb-3 flex items-center justify-center border border-slate-800/80 overflow-hidden relative">
                  {isVideo ? (
                    <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:scale-105 transition-transform duration-300">
                      <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                        <VideoIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-purple-300">Video Reel</span>
                    </div>
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="object-cover w-full h-full opacity-85 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Type Badge */}
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 bg-slate-950/80 text-cyan-300 border border-slate-800 rounded-md uppercase font-bold backdrop-blur-xs">
                    {asset.type}
                  </span>
                </div>

                {/* Info & Tags */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                    {asset.name}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{formatSize(asset.sizeBytes)}</span>
                    <span className="text-slate-500">
                      {new Date(asset.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {asset.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(asset.url, asset.id, e)}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Copy Media URL"
                  >
                    {copiedId === asset.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(asset.id, e)}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-900/40 transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Asset Preview Modal */}
      {activeAssetModal && (
        <div
          onClick={() => setActiveAssetModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white truncate">{activeAssetModal.name}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {activeAssetModal.type.toUpperCase()}
              </span>
            </div>

            <div className="max-h-72 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-2">
              <img
                src={activeAssetModal.url}
                alt={activeAssetModal.name}
                className="max-h-64 object-contain rounded-xl"
              />
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="text-slate-200">{formatSize(activeAssetModal.sizeBytes)}</span>
              </div>
              <div className="flex justify-between">
                <span>MIME Type:</span>
                <span className="text-slate-200">{activeAssetModal.mimeType}</span>
              </div>
              <div className="flex justify-between">
                <span>Created At:</span>
                <span className="text-slate-200">{new Date(activeAssetModal.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <a
                href={activeAssetModal.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Original
              </a>
              <button
                type="button"
                onClick={() => setActiveAssetModal(null)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetLibraryView;

