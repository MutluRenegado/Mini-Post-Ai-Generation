'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  Sparkles,
  Wand2,
  Send,
  Copy,
  Check,
  RefreshCw,
  Palette,
  CheckCircle2,
  Play,
  Film,
  Music,
  Flame,
  Zap,
  ShoppingBag,
  Megaphone,
  ShieldCheck,
  Type,
} from 'lucide-react';
import {
  TikTokStudioService,
  TikTokCampaignMode,
  TikTokMultiAssetBundle,
} from './tiktok.service';
import { RbacAuthGuard } from '@/lib/services/rbacAuthGuard';

interface TikTokStudioViewProps {
  onBack?: () => void;
}

export function TikTokStudioView({ onBack }: TikTokStudioViewProps) {
  const [mounted, setMounted] = useState(false);
  const [topic, setTopic] = useState('How to Automate 100% of TikTok Video Content in 10s');
  const [campaignMode, setCampaignMode] = useState<TikTokCampaignMode>('organic_viral');
  const [isGenerating, setIsGenerating] = useState(false);
  const [bundle, setBundle] = useState<TikTokMultiAssetBundle | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    handleGenerateBundle();
  }, []);

  const handleGenerateBundle = async () => {
    setIsGenerating(true);
    setDispatchStatus(null);
    try {
      const generated = await TikTokStudioService.generateTikTokBundle(topic, campaignMode);
      setBundle(generated);
    } catch (err: any) {
      console.error('TikTok bundle generation error:', err);
      setDispatchStatus(`Generation Error: ${err?.message || 'Failed to generate TikTok bundle.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleScheduleDispatch = async () => {
    if (!bundle) return;
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

    const result = await TikTokStudioService.scheduleTikTokBundle(bundle);

    if (result.success) {
      setDispatchStatus(`Successfully scheduled TikTok campaign dispatch! Log ID: ${result.dispatchId}`);
      setTimeout(() => setDispatchStatus(null), 5000);
    }
  };

  if (!mounted) {
    return <div className="p-8 max-w-7xl mx-auto text-slate-400 font-mono text-sm animate-pulse">Loading TikTok AI Creation Studio...</div>;
  }

  const tips = TikTokStudioService.getAlgorithmTips(campaignMode);
  const brandPalette = TikTokStudioService.getBrandPalette();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 via-cyan-500/20 to-purple-500/20 border border-pink-500/40 text-pink-400 text-xs font-mono font-bold">
            <Video className="w-4 h-4 text-pink-400" /> TIKTOK AI CREATION STUDIO (FYP ENGINE)
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">TikTok 9:16 FYP Video AI Generator</h1>
          <p className="text-xs text-slate-400">Pattern-interrupt hooks, scene-by-scene 9:16 storyboarding, trending sound triggers, & direct TikTok dispatch.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setTopic('Viral SaaS Growth Hacking Hacks'); handleGenerateBundle(); }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <button
            type="button"
            onClick={handleGenerateBundle}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span>Generate FYP Campaign</span>
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

      {/* 2. CAMPAIGN MODE SELECTORS & ALGORITHM INTELLIGENCE CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { id: 'organic_viral', label: 'Organic FYP Viral', icon: Flame, desc: 'Watch completion & comment loops' },
          { id: 'spark_ads', label: 'Spark Ads Campaign', icon: Zap, desc: '+45% organic view boost' },
          { id: 'tiktok_shop', label: 'TikTok Shop Showcase', icon: ShoppingBag, desc: 'In-app product checkout' },
          { id: 'creator_marketplace', label: 'Creator Collaboration', icon: Megaphone, desc: 'Genuine 2.4X longer retention' },
        ].map((m) => {
          const Icon = m.icon;
          const isSelected = campaignMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setCampaignMode(m.id as TikTokCampaignMode)}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-pink-950/80 via-purple-950 to-slate-900 border-pink-500/50 text-white shadow-xl shadow-pink-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl border ${isSelected ? 'bg-pink-500/20 border-pink-500/40 text-pink-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold">MODE</span>
              </div>
              <div>
                <div className="text-xs font-bold text-white">{m.label}</div>
                <div className="text-[10px] text-slate-500 font-mono">{m.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ALGORITHM TIPS CARD */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-[10px] font-mono text-slate-400 block">HOOK STRENGTH</span>
          <span className="font-bold text-pink-400">{tips.hookStrength}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-400 block">OPTIMAL DURATION</span>
          <span className="font-bold text-cyan-400">{tips.optimalDuration}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-400 block">SOUND STRATEGY</span>
          <span className="font-bold text-purple-400">{tips.soundStrategy}</span>
        </div>
      </div>

      {/* 3. MAIN CREATION CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: 9:16 Video Storyboard & Script Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-pink-400" /> 1. Scene-by-Scene 9:16 Storyboard Engine
              </h3>
              <button
                type="button"
                onClick={() => handleCopy(bundle?.viralHookText || '', 'hook')}
                className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedId === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy POV Hook</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">TikTok FYP Topic / Angle</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-sans"
              />
            </div>

            {/* Render Storyboard Scenes */}
            {bundle && (
              <div className="space-y-3 pt-2">
                <label className="text-[11px] font-mono text-slate-400 block">FYP Video Scene Scripting</label>
                {bundle.storyboard.map((sc) => (
                  <div key={sc.sceneIndex} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white">
                      <span className="text-pink-400">Scene {sc.sceneIndex} [{sc.timeRange}]</span>
                      <span className="text-cyan-400 text-[10px]">{sc.trendingSoundHook}</span>
                    </div>
                    <div className="text-xs text-slate-300 font-sans leading-relaxed">
                      <span className="text-slate-500 font-mono text-[10px] block">VISUAL ACTION:</span>
                      {sc.visualAction}
                    </div>
                    <div className="text-xs text-white font-sans font-bold pt-1">
                      <span className="text-slate-500 font-mono text-[10px] block font-normal">VOICEOVER SCRIPT:</span>
                      "{sc.audioVoiceover}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: 9:16 FYP Video Card, Trending Audio, & Direct Dispatch */}
        <div className="lg:col-span-5 space-y-6">
          {/* 9:16 Vertical Preview Box */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-pink-400" /> 2. 9:16 FYP Video Preview Card
              </h3>
              <span className="text-[10px] font-mono text-slate-400">1080 x 1920 px</span>
            </div>

            <div className="w-full h-72 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-pink-500/20">
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white max-w-xs truncate">{bundle?.viralHookText}</div>
                <div className="text-[10px] text-pink-400 font-mono">{bundle?.trendingAudioTrack}</div>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono text-yellow-400 font-bold max-w-xs truncate">
                {bundle?.autoCaptionsStyle}
              </div>
            </div>

            {/* Trending Audio & Auto-Captions Specs */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 font-bold text-white">
                  <Music className="w-3 h-3 text-cyan-400" /> Trending Sound Match
                </span>
                <span className="text-emerald-400">FYP Recommended</span>
              </div>
              <div className="text-xs font-mono text-cyan-300">{bundle?.trendingAudioTrack}</div>
            </div>

            {/* Brand Kit 3-Color Palette */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 font-bold text-white">
                  <Palette className="w-3 h-3 text-pink-400" /> Brand 3-Color Palette
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

          {/* TikTok Direct Dispatch Action */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-between gap-4 shadow-xl">
            <div className="w-full text-left">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-pink-400" /> 3. Direct TikTok FYP Publishing
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">Dispatches via PublishingDispatchService directly to TikTok FYP queue.</p>
            </div>

            <button
              type="button"
              onClick={handleScheduleDispatch}
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Schedule & Dispatch TikTok Campaign</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TikTokStudioView;
