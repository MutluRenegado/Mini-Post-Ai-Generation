'use client';

import React, { useState, useRef } from 'react';
import { UploadResult } from '../services/image-library-admin.service';
import { Upload, X, AlertCircle, CheckCircle2, FileImage, Sparkles } from 'lucide-react';

interface ImageUploadModalProps {
  onClose: () => void;
  onUploadFile: (file: File) => Promise<UploadResult>;
  onUploadSuccess: () => void;
}

export function ImageUploadModal({ onClose, onUploadFile, onUploadSuccess }: ImageUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<{ fileName: string; result?: UploadResult; error?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      validFiles.push(files[i]);
    }
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    const newResults = [];

    for (const file of selectedFiles) {
      try {
        const res = await onUploadFile(file);
        newResults.push({ fileName: file.name, result: res });
      } catch (err: any) {
        newResults.push({ fileName: file.name, error: err.message || 'Upload failed' });
      }
    }

    setResults(newResults);
    setIsUploading(false);
    onUploadSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0C0F17] border border-[#1C2234] rounded-3xl w-full max-w-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1C2234] flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="font-extrabold text-base text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" /> Upload Images to Visual Library
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              Drag & Drop files • Supported: JPG, JPEG, PNG, WebP (Max 25MB)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#1C2234] hover:border-cyan-500/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-200">
              Click to browse or drag and drop image files here
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Supports single or multi-file selection
            </p>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 font-mono">
                Selected Files ({selectedFiles.length}):
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileImage className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Summary */}
          {results.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#1C2234]">
              <h4 className="text-xs font-bold text-slate-300 font-mono">Upload Status:</h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-xs">
                {results.map((r, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200">{r.fileName}</span>
                      {r.error ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      ) : r.result?.blocked ? (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Duplicate Blocked
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded (PENDING)
                        </span>
                      )}
                    </div>
                    {r.error && <p className="text-[10px] text-rose-300">{r.error}</p>}
                    {r.result?.blockReason && (
                      <p className="text-[10px] text-amber-300">{r.result.blockReason}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#1C2234] bg-slate-900/50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Initial Status: <strong>PENDING REVIEW</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              disabled={selectedFiles.length === 0 || isUploading}
              onClick={handleStartUpload}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> {isUploading ? 'Uploading...' : 'Process Uploads'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
