'use client';

import React, { useState, useTransition, useRef } from 'react';
import { generateMultiPlatformPostsAction, AIModelChoice } from '@/modules/ai/actions/generate-post.action';
import { createPostAction } from '../actions/create-post.action';
import { PlatformPreviewCard } from './PlatformPreviewCard';
import { READY_TEMPLATES, SocialTemplate } from '../data/templates';
import { PlatformAdaptations } from '../types/post.types';
import { platformGeometryPresets, FormatPresetMode } from '../config/geometry.config';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { Sparkles, Layers, Save, Check, Copy, RefreshCw, Zap, BookmarkCheck, X, Play, Image as ImageIcon, MessageSquare, ArrowRight, Eye, Sliders, Maximize2, Minimize2, FileText, Upload, Wand2, Trash2 } from 'lucide-react';

import { executeWithCrashFallback, cachePayloadState, getCachedPayloadState } from '@/lib/crash-recovery';
import { StudioClientService } from '@/lib/services/studioClientService';

interface MultiPlatformStudioProps {
  onPostSaved?: () => void;
}

export function MultiPlatformStudio({ onPostSaved }: MultiPlatformStudioProps) {
  const { user } = useAuth();

  // Form & Content state
  const [title, setTitle] = useState('');
  const [masterContent, setMasterContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Adaptations & Geometry Preset state
  const [adaptations, setAdaptations] = useState<PlatformAdaptations>({});
  const [activeTab, setActiveTab] = useState<'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok'>('facebook');
  const [formatMode, setFormatMode] = useState<FormatPresetMode>('normal');
  const [providerUsed, setProviderUsed] = useState<'gemini' | null>(null);

  // Status & loading states
  const [isGenerating, startGenerating] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Preset Template Category tab state & Selected Template Modal state
  const [presetCategory, setPresetCategory] = useState<'facebook' | 'linkedin' | 'instagram' | 'twitter' | 'tiktok'>('facebook');
  const [previewTemplate, setPreviewTemplate] = useState<SocialTemplate | null>(null);

  const activeGeometry = platformGeometryPresets[activeTab];
  const filteredTemplates = READY_TEMPLATES.filter((t) => t.platform === presetCategory);

  // Handler when user clicks "Use This Template" -> Loads EMPTY template structure
  const handleSelectTemplate = (tpl: SocialTemplate) => {
    setTitle(''); // Empty title -> Shows "write your title" placeholder
    setMasterContent(''); // Empty content -> Shows "create ai text" placeholder
    setAdaptations({}); // Empty adaptations
    setImageUrl(null); // Empty image -> Shows "Create AI Image" and "Import Image" options
    setPreviewTemplate(null);
    setErrorMsg(null);
    setSuccessMsg(`✨ Empty template structure activated for ${tpl.platform.toUpperCase()}! Add your title, text, or image below.`);

    const formElement = document.getElementById('master-input-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const handleCreateAiImage = async () => {
    setIsGeneratingImage(true);
    setErrorMsg(null);
    try {
      const promptText = title.trim() || masterContent.trim() || "High-tech executive startup dashboard";
      const opMode = imageUrl ? 'recreate' : 'generate';

      const res = await StudioClientService.recreateImage({
        operation: opMode,
        postTopic: promptText,
        originalImagePrompt: promptText,
        sourceImageUrl: imageUrl || undefined,
        aspectRatio: '1:1',
      });

      if (res.success && res.data?.imageUrl) {
        setImageUrl(res.data.imageUrl);
        setSuccessMsg(`✨ AI Image ${opMode === 'recreate' ? 'recreated' : 'generated'} & versioned successfully!`);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res.error?.message || "Failed to generate AI image. Please try again.");
      }
    } catch (err: any) {
      console.error("AI Image Generation Error:", err);
      setErrorMsg("Failed to generate AI image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleImportImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
        setSuccessMsg("📷 Custom image imported successfully!");
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateAdaptations = () => {
    if (!masterContent || masterContent.trim().length < 3) {
      setErrorMsg('Please enter a master post or select a template preset first.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    startGenerating(async () => {
      const payload = {
        title,
        masterContent,
        formatMode,
        userId: user?.uid || 'guest-user',
      };

      const modeInstruction =
        formatMode === 'summary'
          ? 'Shortened / Summary Preset (Quick punchy takeaway, micro-hook)'
          : formatMode === 'lengthened'
          ? 'Lengthened Preset (Deep-dive community post, detailed analytical sections)'
          : 'Normal Standard Preset (Balanced structured article)';

      const fullPrompt = `[MODE: ${modeInstruction}]\n${title ? title + '\n\n' : ''}${masterContent}`;

      // 2-Tier AI Generation Handlers (Tier 1: Full Prompt, Tier 2: Simplified Prompt)
      try {
        let res = await generateMultiPlatformPostsAction(fullPrompt, user?.uid || 'guest-user', 'starter');
        if (!res.success || !res.data) {
          console.warn('[MultiPlatformStudio] Primary prompt generation failed, trying simplified prompt tier...');
          const simplePrompt = `${title ? title + ': ' : ''}${masterContent}`;
          res = await generateMultiPlatformPostsAction(simplePrompt, user?.uid || 'guest-user', 'starter');
        }

        if (res.success && res.data) {
          setAdaptations(res.data);
          setProviderUsed('gemini');
          setSuccessMsg('✨ Multi-platform posts generated successfully!');
          setTimeout(() => setSuccessMsg(null), 5000);
        } else {
          setErrorMsg(res.error || 'Failed to generate multi-platform adaptations.');
        }
      } catch (err: any) {
        console.error('[MultiPlatformStudio] AI generation failed:', err);
        setErrorMsg(err?.message || 'Failed to generate multi-platform adaptations.');
      }
    });
  };

  const handleSaveToFirestore = () => {
    if (!title && !masterContent) {
      setErrorMsg('Please write your title or content before saving.');
      return;
    }

    setErrorMsg(null);

    startSaving(async () => {
      const result = await createPostAction({
        title: title || 'Untitled Post',
        content: masterContent || 'Master content placeholder',
        adaptations,
        userId: user?.uid || 'guest-user',
        userEmail: user?.email || 'guest@minipost.app',
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Failed to save to Firebase.');
      } else {
        setSuccessMsg('Post & adaptations saved to Firebase Firestore!');
        setTimeout(() => setSuccessMsg(null), 4000);
        onPostSaved?.();
      }
    });
  };

  const handleCopyAll = () => {
    if (!Object.keys(adaptations).length) return;
    const compiled = `--- FACEBOOK ---\n${adaptations.facebook || ''}\n\n--- INSTAGRAM ---\n${adaptations.instagram || ''}\n\n--- LINKEDIN ---\n${adaptations.linkedin || ''}\n\n--- TWITTER / X ---\n${adaptations.twitter || ''}\n\n--- TIKTOK / SHORTS ---\n${adaptations.tiktok || ''}`;
    navigator.clipboard.writeText(compiled);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="w-full space-y-8">
      {/* Hidden File Input for Image Import */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImportImage}
        className="hidden"
      />

      {/* PREVIEW TEMPLATE MODAL WITH SAMPLE DATA, IMAGES & VIDEO */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#090D16] border border-[#1E2638] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/80 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-[#121826] hover:bg-[#1C2538] rounded-full border border-[#1E2638] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                {previewTemplate.platform.toUpperCase()} PRESET
              </span>
              {previewTemplate.aestheticBadge && (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  ✨ {previewTemplate.aestheticBadge}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                {previewTemplate.category}
              </span>
            </div>

            <h3 className="text-xl font-black text-white mb-2 leading-snug">
              {previewTemplate.title}
            </h3>

            {/* Media Showcase: Image & Video */}
            <div className="my-4 space-y-3">
              {previewTemplate.sampleVideo ? (
                <div className="relative rounded-2xl overflow-hidden border border-[#1E2638] bg-black shadow-lg">
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-400 text-[11px] font-bold flex items-center gap-1.5 border border-amber-500/30">
                    <Play className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Sample Video Reel Preview</span>
                  </div>
                  <video
                    src={previewTemplate.sampleVideo}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full h-56 sm:h-64 object-cover"
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-[#1E2638] bg-black shadow-lg group">
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 border border-cyan-500/30">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Sample Visual Artwork</span>
                  </div>
                  <img
                    src={previewTemplate.sampleImage}
                    alt={previewTemplate.title}
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Engagement Metric */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0D1322] border border-[#1E2638] text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Zap className="w-4 h-4 fill-emerald-400" /> Projected Benchmark
                </span>
                <span className="font-mono text-slate-200 font-bold">{previewTemplate.sampleData.engagementMetric}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => handleSelectTemplate(previewTemplate)}
                className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="w-full sm:w-auto py-3.5 px-5 bg-[#121826] hover:bg-[#1C2538] border border-[#1E2638] text-slate-300 text-xs font-bold rounded-xl transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Studio Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/30 transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-black tracking-tight text-slate-100">
                  Multi-Platform Creator Studio
                </h2>
                <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 border-2 border-amber-400 text-amber-300 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 transform -rotate-1 inline-flex items-center gap-1">
                  ⚡ FAST POST CREATION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                1 Master Template ➡️ Auto-Convert for Facebook, Instagram, LinkedIn, X & TikTok
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/dashboard/fast-post"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>⚡ Open 7-Step Pipeline Creator Studio</span>
            </a>
          </div>
        </div>

        {/* READY-TO-USE PRESET TEMPLATE SELECTOR (3 Per Platform) */}
        <div className="mb-6 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4" /> Ready-to-Use Presets (3 Per Platform)
            </span>
            <span className="text-[11px] text-slate-400">Click any template card to open preview & select "Use This Template"</span>
          </div>

          {/* Platform category selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
            {(['facebook', 'linkedin', 'instagram', 'twitter', 'tiktok'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setPresetCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap ${
                  presetCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat === 'facebook' && '🔵 FB (3)'}
                {cat === 'linkedin' && '💼 LinkedIn (3)'}
                {cat === 'instagram' && '📸 Instagram (3)'}
                {cat === 'twitter' && '🐦 X (3)'}
                {cat === 'tiktok' && '🎵 TikTok (3)'}
              </button>
            ))}
          </div>

          {/* Template cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredTemplates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setPreviewTemplate(tpl)}
                className="text-left p-3.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800/80 hover:border-indigo-500/60 rounded-2xl transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative w-full h-24 mb-2.5 rounded-xl overflow-hidden border border-slate-800 bg-black">
                    <img
                      src={tpl.sampleImage}
                      alt={tpl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    {tpl.sampleVideo && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-bold flex items-center gap-1">
                        <Play className="w-3 h-3 fill-amber-300" /> VIDEO REEL
                      </div>
                    )}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                      OPEN PREVIEW
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                    {tpl.title}
                  </div>
                  <div className="text-[11px] text-indigo-400 font-semibold mb-1.5">{tpl.category}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {tpl.content}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-emerald-400">
                    <Zap className="w-3 h-3" /> {tpl.sampleData.engagementMetric}
                  </span>
                  <span className="font-bold text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <Eye className="w-3 h-3" /> View & Select
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FORMAT PRESET MODE SELECTOR (Normal, Short/Summary, Lengthened) */}
        <div className="mb-6 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Generation Length Presets
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {formatMode === 'normal' && activeGeometry.normalRange}
              {formatMode === 'summary' && activeGeometry.summaryRange}
              {formatMode === 'lengthened' && activeGeometry.lengthenedRange}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setFormatMode('normal')}
              className={`p-3 rounded-xl border text-left transition-all ${
                formatMode === 'normal'
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Normal Standard</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {activeGeometry.presetDescriptions.normal}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormatMode('summary')}
              className={`p-3 rounded-xl border text-left transition-all ${
                formatMode === 'summary'
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Short / Summary</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {activeGeometry.presetDescriptions.summary}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormatMode('lengthened')}
              className={`p-3 rounded-xl border text-left transition-all ${
                formatMode === 'lengthened'
                  ? 'bg-purple-500/10 border-purple-500/50 text-purple-300 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Lengthened Deep-Dive</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {activeGeometry.presetDescriptions.lengthened}
              </p>
            </button>
          </div>
        </div>

        {/* Success & Error Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 animate-fadeIn">
            <Zap className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3 animate-fadeIn">
            <span className="font-bold shrink-0">•</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Master Input Form */}
        <div id="master-input-form" className="space-y-5">
          {/* TITLE SECTION WITH PLACEHOLDER "write your title" */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Title Section <span className="text-indigo-400">*</span></span>
              {title && <span className="text-[10px] text-emerald-400 font-mono">Title Active</span>}
            </label>
            <input
              type="text"
              placeholder="write your title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all font-sans"
            />
          </div>

          {/* TEXT SECTION WITH PLACEHOLDER "create ai text" */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Text Section / Core Story <span className="text-indigo-400">*</span></span>
              {masterContent && <span className="text-[10px] text-emerald-400 font-mono">Text Active</span>}
            </label>
            <textarea
              rows={5}
              placeholder="create ai text"
              value={masterContent}
              onChange={(e) => setMasterContent(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all leading-relaxed font-sans"
            />
          </div>

          {/* VISUAL / IMAGE SECTION WITH "Create AI Image" & "Import Image" DUAL OPTIONS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
              <span>Visual Asset / Artwork Section</span>
              {imageUrl && <span className="text-[10px] text-emerald-400 font-mono">Image Active</span>}
            </label>

            {imageUrl ? (
              <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-slate-800 bg-black group shadow-xl">
                <img
                  src={imageUrl}
                  alt="Template Artwork"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all border border-slate-700"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Image
                </button>
              </div>
            ) : (
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400 mb-3 text-center">
                  Select an option to attach artwork to your template. Placeholders disappear when image arrives.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Create AI Image */}
                  <button
                    type="button"
                    onClick={handleCreateAiImage}
                    disabled={isGeneratingImage}
                    className="p-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all active:scale-98 disabled:opacity-50"
                  >
                    {isGeneratingImage ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    ) : (
                      <Wand2 className="w-4 h-4 text-amber-300" />
                    )}
                    <span>{isGeneratingImage ? 'Generating AI Image...' : 'Create AI Image'}</span>
                  </button>

                  {/* Option 2: Import Image */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2.5 transition-all active:scale-98"
                  >
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Import Image</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleGenerateAdaptations}
              disabled={isGenerating}
              className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Converting for All Apps ({formatMode.toUpperCase()})...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>Adapt to All Platforms ({formatMode.toUpperCase()} 1-Click AI)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveToFirestore}
              disabled={isSaving || (!title && !masterContent)}
              className="w-full sm:w-auto py-3.5 px-6 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 text-emerald-400" />
              )}
              <span>Save to Firebase</span>
            </button>
          </div>
        </div>
      </div>

      {/* PLATFORM STUDIO PREVIEW TABS & CARDS */}
      {Object.keys(adaptations).length > 0 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Bar for Previews */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Live Platform Previews
              </h3>
              {providerUsed && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Generated via {providerUsed.toUpperCase()}
                </span>
              )}
            </div>

            <button
              onClick={handleCopyAll}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                copiedAll
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-indigo-400" />}
              <span>{copiedAll ? 'Copied All 5 Platforms!' : 'Copy All Platforms'}</span>
            </button>
          </div>

          {/* Platform Selector Tabs with Geometry Labels */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveTab('facebook')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'facebook'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>🔵 Facebook (16:9)</span>
            </button>
            <button
              onClick={() => setActiveTab('instagram')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'instagram'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>📸 Instagram (1:1)</span>
            </button>
            <button
              onClick={() => setActiveTab('linkedin')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'linkedin'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>💼 LinkedIn (1.91:1)</span>
            </button>
            <button
              onClick={() => setActiveTab('twitter')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'twitter'
                  ? 'bg-slate-100 text-slate-950 font-extrabold shadow-lg shadow-slate-100/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>𝕏 Twitter (16:9)</span>
            </button>
            <button
              onClick={() => setActiveTab('tiktok')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'tiktok'
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-lg shadow-teal-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>🎵 TikTok (9:16)</span>
            </button>
          </div>

          {/* Active Preview Card */}
          <div className="pt-2">
            <PlatformPreviewCard
              platform={activeTab}
              content={adaptations[activeTab] || ''}
              imageUrl={imageUrl}
              userEmail={user?.email || 'Creator Studio'}
              onContentChange={(updated) =>
                setAdaptations((prev) => ({ ...prev, [activeTab]: updated }))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
