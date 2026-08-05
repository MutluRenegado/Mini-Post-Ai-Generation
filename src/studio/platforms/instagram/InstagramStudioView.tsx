'use client';

import React, { useState, useEffect } from 'react';
import {
  Camera,
  Sparkles,
  Video,
  Layers,
  Image as ImageIcon,
  Clock,
  Send,
  Copy,
  Check,
  RefreshCw,
  Hash,
  Palette,
  ShieldCheck,
  Wand2,
  ExternalLink,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import {
  InstagramStudioService,
  InstagramFormat,
  AspectRatio,
  InstagramHashtagGroup,
} from './instagram.service';
import { RbacAuthGuard } from '@/lib/services/rbacAuthGuard';

interface InstagramStudioViewProps {
  onBack?: () => void;
}

export function InstagramStudioView({ onBack }: InstagramStudioViewProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<InstagramFormat>('reels');
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>('9:16');
  const [topic, setTopic] = useState('5 AI Growth Catalysts for Scaling Creators in 2026');
  const [styleTransfer, setStyleTransfer] = useState('Glassmorphism 3D Neon');
  const [isGenerating, setIsGenerating] = useState(false);

  const [captionData, setCaptionData] = useState<{ caption: string; firstComment: string }>({
    caption: '',
    firstComment: '',
  });
  const [hashtags, setHashtags] = useState<InstagramHashtagGroup[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    handleGenerateAll();
  }, []);

  useEffect(() => {
    const specs = InstagramStudioService.getFormatSpecs(selectedFormat);
    setSelectedAspect(specs.recommendedAspect);
  }, [selectedFormat]);

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    setDispatchStatus(null);
    try {
      const generated = await InstagramStudioService.generateInstagramCaption(topic, selectedFormat);
      const tags = InstagramStudioService.getHashtagResearch(topic);
      setCaptionData(generated);
      setHashtags(tags);
    } catch (err: any) {
      console.error('Instagram generation error:', err);
      setDispatchStatus(`Generation Error: ${err?.message || 'Failed to generate Instagram caption.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleScheduleDispatch = async () => {
    const userContext = {
      userId: 'usr_current',
      role: 'editor' as const,
      tier: 'pro' as const,
      isSubscriptionActive: true,
    };

    if (!RbacAuthGuard.canPublish(userContext)) {
      setDispatchStatus('Permission Denied: Your role does not have publish access.');
      return;
    }

    const allTags = hashtags.flatMap((g) => g.tags);
    const result = await InstagramStudioService.scheduleInstagramPost({
      id: `insta_${Date.now()}`,
      format: selectedFormat,
      caption: captionData.caption,
      firstComment: captionData.firstComment,
      hashtags: allTags,
      aspectRatio: selectedAspect,
      visualAssetPrompt: `High resolution Instagram ${selectedFormat} graphic in ${styleTransfer} style for: ${topic}`,
      colorPalette: InstagramStudioService.getBrandPalette(),
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      status: 'queued',
    });

    if (result.success) {
      setDispatchStatus(`Successfully queued for Instagram dispatch! Log ID: ${result.dispatchId}`);
      setTimeout(() => setDispatchStatus(null), 5000);
    }
  };

  if (!mounted) {
    return <div className="p-8 max-w-7xl mx-auto text-slate-400 font-mono text-sm animate-pulse">Loading Instagram AI Creation Studio...</div>;
  }

  const formatSpecs = InstagramStudioService.getFormatSpecs(selectedFormat);
  const brandPalette = InstagramStudioService.getBrandPalette();
  const userAccess = RbacAuthGuard.canPublish({ userId: 'usr_1', role: 'editor', tier: 'pro', isSubscriptionActive: true });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 border border-pink-500/40 text-pink-400 text-xs font-mono font-bold">
            <Camera className="w-4 h-4 text-pink-400" /> INSTAGRAM AI CREATION STUDIO
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Instagram Multi-Modal AI Generator</h1>
          <p className="text-xs text-slate-400">Tailored 4-step AI generation pipeline for Reels, Carousels, Stories, & Feed Posts.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setTopic('Luxury Brand Aesthetics'); handleGenerateAll(); }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <button
            type="button"
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span>Generate Post Bundle</span>
          </button>
        </div>
      </div>

      {/* DISPATCH NOTIFICATION */}
      {dispatchStatus && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-mono text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{dispatchStatus}</span>
          </div>
        </div>
      )}

      {/* 2. FORMAT SELECTOR TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'reels', label: 'Instagram Reels', aspect: '9:16', icon: Video, desc: 'Vertical Video (9:16)' },
          { id: 'carousel', label: 'Multi-Slide Carousel', aspect: '4:5', icon: Layers, desc: '+38.2% Engagement' },
          { id: 'single', label: 'Single Post', aspect: '1:1', icon: ImageIcon, desc: 'Feed Square (1:1)' },
          { id: 'story', label: 'Instagram Story', aspect: '9:16', icon: Clock, desc: 'Vertical Card (9:16)' },
        ].map((fmt) => {
          const Icon = fmt.icon;
          const isSelected = selectedFormat === fmt.id;
          return (
            <button
              key={fmt.id}
              type="button"
              onClick={() => setSelectedFormat(fmt.id as InstagramFormat)}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-950/80 to-slate-900 border-pink-500/50 text-white shadow-xl shadow-pink-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl border ${isSelected ? 'bg-pink-500/20 border-pink-500/40 text-pink-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-pink-400 font-bold">{fmt.aspect}</span>
              </div>
              <div>
                <div className="text-xs font-bold text-white">{fmt.label}</div>
                <div className="text-[10px] text-slate-500 font-mono">{fmt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN CREATION CANVAS (VISUAL ASSETS + CAPTION & HASHTAGS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Visual Asset Generator & Brand Kit Palette */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual Asset Studio */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-pink-400" /> 1. Visual Asset AI Resizer
              </h3>
              <span className="text-[10px] font-mono text-slate-400">{formatSpecs.resolution}</span>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1:1', '4:5', '9:16'] as AspectRatio[]).map((aspect) => (
                  <button
                    key={aspect}
                    type="button"
                    onClick={() => setSelectedAspect(aspect)}
                    className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                      selectedAspect === aspect
                        ? 'bg-pink-500 text-black border-pink-400 shadow-md font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {aspect}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Transfer Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">Style Transfer Preset</label>
              <select
                value={styleTransfer}
                onChange={(e) => setStyleTransfer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
              >
                <option value="Glassmorphism 3D Neon">Glassmorphism 3D Neon</option>
                <option value="Modern Minimalist Studio">Modern Minimalist Studio</option>
                <option value="Cyberpunk Executive">Cyberpunk Executive</option>
                <option value="Vibrant Gradient Punch">Vibrant Gradient Punch</option>
              </select>
            </div>

            {/* Visual Canvas Preview Box */}
            <div
              className={`w-full bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden transition-all ${
                selectedAspect === '9:16' ? 'h-72' : selectedAspect === '4:5' ? 'h-60' : 'h-48'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-500 flex items-center justify-center text-white font-black text-xs shadow-lg">
                AI
              </div>
              <div>
                <div className="text-xs font-bold text-white">{selectedFormat.toUpperCase()} Visual Layout</div>
                <div className="text-[10px] text-pink-400 font-mono">{styleTransfer} • {selectedAspect}</div>
              </div>
              <p className="text-[10px] text-slate-500 max-w-xs">{formatSpecs.tips}</p>
            </div>

            {/* Brand Kit 3-Color Palette Integration */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 font-bold text-white"><Palette className="w-3 h-3 text-pink-400" /> Brand Kit 3-Color Palette</span>
                <span>Active Spec</span>
              </div>
              <div className="flex items-center gap-2">
                {brandPalette.map((hex, idx) => (
                  <div key={idx} className="flex-1 flex items-center gap-2 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: hex }} />
                    <span className="text-[10px] font-mono text-slate-300">{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Captions, Hashtag Research, and Direct Calendar Schedule */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Caption & First Comment Generator */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-purple-400" /> 2. AI Caption & First Comment
              </h3>
              <button
                type="button"
                onClick={() => handleCopy(captionData.caption, 'caption')}
                className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedKey === 'caption' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Caption</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">Post Topic / Core Angle</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">Generated Instagram Caption</label>
              <textarea
                rows={6}
                value={captionData.caption}
                onChange={(e) => setCaptionData({ ...captionData, caption: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-pink-500 font-sans leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">First Comment Hashtag Strategy</label>
              <input
                type="text"
                value={captionData.firstComment}
                onChange={(e) => setCaptionData({ ...captionData, firstComment: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-pink-300 focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>
          </div>

          {/* Strategic Performance Hashtag Research */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-pink-400" /> 3. Tiered Hashtag Research
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">Algorithmic Reach Index</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {hashtags.map((group, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-white">{group.niche}</span>
                    <span className="text-[9px] font-mono text-emerald-400">{group.reach}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-pink-300 border border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Calendar & Direct Dispatch Actions */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" /> 4. Instagram Direct Dispatch
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">Dispatches via publishingDispatchService to Instagram queue.</p>
            </div>

            <button
              type="button"
              onClick={handleScheduleDispatch}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Schedule to Instagram Queue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstagramStudioView;
