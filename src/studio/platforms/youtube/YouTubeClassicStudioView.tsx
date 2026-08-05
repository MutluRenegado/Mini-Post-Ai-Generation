'use client';

import React, { useState, useEffect } from 'react';
import {
  Tv,
  Sparkles,
  Wand2,
  ListOrdered,
  Image as ImageIcon,
  Search,
  Send,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Clock,
  CheckCircle2,
  Play,
  Film,
  TrendingUp,
  Hash,
  Tag,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import {
  YouTubeClassicService,
  YouTubeLongFormScript,
  YouTubeThumbnailConcept,
  YouTubeSeoMetadata,
} from './youtube-classic.service';
import { RbacAuthGuard } from '@/lib/services/rbacAuthGuard';

interface YouTubeClassicStudioViewProps {
  onBack?: () => void;
}

export function YouTubeClassicStudioView({ onBack }: YouTubeClassicStudioViewProps) {
  const [mounted, setMounted] = useState(false);
  const [topic, setTopic] = useState('Build a Complete Multi-Channel AI Video Engine in Next.js');
  const [selectedSeoTitle, setSelectedSeoTitle] = useState('');
  const [selectedThumbnailId, setSelectedThumbnailId] = useState('thumb_1');
  const [isGenerating, setIsGenerating] = useState(false);

  const [script, setScript] = useState<YouTubeLongFormScript>({
    videoTitle: '',
    estimatedDurationMinutes: 14,
    chapters: [],
    fullOutlineText: '',
  });

  const [thumbnails, setThumbnails] = useState<YouTubeThumbnailConcept[]>([]);
  const [seoData, setSeoData] = useState<YouTubeSeoMetadata>({
    seoTitles: [],
    description: '',
    tags: [],
    keywords: [],
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    handleGenerateAll();
  }, []);

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    setDispatchStatus(null);
    try {
      const generatedScript = await YouTubeClassicService.generateLongFormScript(topic);
      const generatedThumbs = YouTubeClassicService.generateThumbnailConcepts(topic);
      const generatedSeo = YouTubeClassicService.generateSeoMetadata(topic, generatedScript);

      setScript(generatedScript);
      setThumbnails(generatedThumbs);
      setSeoData(generatedSeo);
      if (generatedSeo.seoTitles.length > 0) {
        setSelectedSeoTitle(generatedSeo.seoTitles[0].title);
      }
    } catch (err: any) {
      console.error('YouTube Classic generation error:', err);
      setDispatchStatus(`Generation Error: ${err?.message || 'Failed to generate YouTube script and metadata.'}`);
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

    const activeThumb = thumbnails.find((t) => t.id === selectedThumbnailId) || thumbnails[0];

    const result = await YouTubeClassicService.scheduleYouTubeClassicPost({
      id: `yt_classic_${Date.now()}`,
      videoTitle: selectedSeoTitle || script.videoTitle,
      script,
      thumbnail: activeThumb,
      metadata: seoData,
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    });

    if (result.success) {
      setDispatchStatus(`Successfully scheduled long-form video dispatch to YouTube! Log ID: ${result.dispatchId}`);
      setTimeout(() => setDispatchStatus(null), 5000);
    }
  };

  if (!mounted) {
    return <div className="p-8 max-w-7xl mx-auto text-slate-400 font-mono text-sm animate-pulse">Loading YouTube Classic Creation Studio...</div>;
  }

  const activeThumb = thumbnails.find((t) => t.id === selectedThumbnailId) || thumbnails[0];
  const brandPalette = YouTubeClassicService.getBrandPalette();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 via-cyan-500/20 to-amber-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold">
            <Tv className="w-4 h-4 text-red-400" /> YOUTUBE CLASSIC CREATION STUDIO (16:9 LONG-FORM)
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Horizontal Long-Form Video AI Studio</h1>
          <p className="text-xs text-slate-400">Chapter scripting, 16:9 high-CTR thumbnail optimization, SEO metadata, & direct channel publishing.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setTopic('Full Enterprise AI Architecture Breakdown'); handleGenerateAll(); }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <button
            type="button"
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 hover:from-red-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span>Regenerate Long-Form AI</span>
          </button>
        </div>
      </div>

      {/* DISPATCH STATUS NOTIFICATION */}
      {dispatchStatus && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-mono text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{dispatchStatus}</span>
          </div>
        </div>
      )}

      {/* 2. MAIN CREATION CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Chapter Scripting & Detailed Outline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Chapter Breakdown Studio */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-red-400" /> 1. Long-Form Chapter Scripting & Outlining
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                ~{script.estimatedDurationMinutes} MIN DURATION
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">Core Topic / Master Thesis</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            {/* Timestamps & Chapter List */}
            <div className="space-y-3 pt-2">
              <label className="text-[11px] font-mono text-slate-400 block">Timestamped Chapter Structure</label>
              {script.chapters.map((ch, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white">
                    <span className="text-red-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> [{ch.timestamp}] {ch.title}
                    </span>
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-0.5 pl-4 list-disc font-sans pt-1">
                    {ch.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleCopy(script.fullOutlineText, 'outline')}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedKey === 'outline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Full Chapter Outline</span>
              </button>
            </div>
          </div>

          {/* SEO Description & Keyword Tags */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" /> 3. SEO Metadata & Timestamped Description
              </h3>
              <button
                type="button"
                onClick={() => handleCopy(seoData.description, 'description')}
                className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedKey === 'description' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Description</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">SEO Video Description</label>
              <textarea
                rows={7}
                value={seoData.description}
                onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">Keyword Tags (#SEO)</label>
              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                {seoData.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 16:9 Thumbnail Generator, SEO Title Optimizer, & Dispatch */}
        <div className="lg:col-span-5 space-y-6">
          {/* SEO Title Selector */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> High-CTR SEO Title Optimizer
            </h3>

            <div className="space-y-2">
              {seoData.seoTitles.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSeoTitle(t.title)}
                  className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedSeoTitle === t.title
                      ? 'bg-slate-950 border-red-500/50 text-white font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs truncate">{t.title}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded shrink-0">
                    +{t.ctrScore}% CTR
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 16:9 High-CTR Thumbnail Studio */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-red-400" /> 2. 16:9 Thumbnail Studio
              </h3>
              <span className="text-[10px] font-mono text-slate-400">1920 x 1080 px</span>
            </div>

            {/* Active Thumbnail 16:9 Preview Card */}
            <div className="w-full h-44 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 text-center space-y-2 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-500 via-purple-600 to-amber-500 flex items-center justify-center text-white font-black text-xs shadow-lg">
                16:9
              </div>
              <div>
                <div className="text-xs font-bold text-white max-w-xs truncate">{activeThumb?.layoutTitle}</div>
                <div className="text-[10px] text-red-400 font-mono">{activeThumb?.expressionStyle}</div>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                ESTIMATED CTR: {activeThumb?.ctrEstimateScore}%
              </span>
            </div>

            {/* Thumbnail Concept Options */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-slate-400 block">Thumbnail Concepts</label>
              {thumbnails.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedThumbnailId(t.id)}
                  className={`w-full p-2.5 rounded-xl text-xs text-left transition-all border cursor-pointer ${
                    selectedThumbnailId === t.id
                      ? 'bg-slate-950 border-red-500/50 text-red-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-[11px] font-bold text-white">{t.layoutTitle}</div>
                  <div className="text-[9px] font-mono text-slate-500">{t.expressionStyle}</div>
                </button>
              ))}
            </div>

            {/* Brand Kit 3-Color Palette */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 font-bold text-white">
                  <Palette className="w-3 h-3 text-red-400" /> Brand 3-Color Palette
                </span>
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

          {/* YouTube Channel Direct Publishing Action */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-between gap-4 shadow-xl">
            <div className="w-full text-left">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-red-400" /> 4. YouTube Channel Direct Publishing
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">Dispatches via PublishingDispatchService directly to YouTube long-form video queue.</p>
            </div>

            <button
              type="button"
              onClick={handleScheduleDispatch}
              className="w-full py-3 bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 hover:from-red-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Schedule & Dispatch Long-Form Video</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YouTubeClassicStudioView;
