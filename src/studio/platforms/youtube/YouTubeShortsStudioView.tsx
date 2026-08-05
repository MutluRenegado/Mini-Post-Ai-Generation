'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  Sparkles,
  Wand2,
  Mic,
  Music,
  Type,
  Send,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Clock,
  CheckCircle2,
  Play,
  Film,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import {
  YouTubeShortsService,
  ShortsScript,
} from './youtube-shorts.service';
import { RbacAuthGuard } from '@/lib/services/rbacAuthGuard';

interface YouTubeShortsStudioViewProps {
  onBack?: () => void;
}

export function YouTubeShortsStudioView({ onBack }: YouTubeShortsStudioViewProps) {
  const [mounted, setMounted] = useState(false);
  const [topic, setTopic] = useState('How to Build a $10k/mo AI SaaS in 60 Seconds');
  const [selectedVoice, setSelectedVoice] = useState('v_rachel');
  const [selectedTrack, setSelectedTrack] = useState('t_saas_synth');
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState('c_yellow_pop');
  const [animationStyle, setAnimationStyle] = useState('Kinetic Cyberpunk 3D');
  const [isGenerating, setIsGenerating] = useState(false);

  const [script, setScript] = useState<ShortsScript>({
    hook: '',
    middle: '',
    cta: '',
    estimatedDurationSeconds: 58,
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    handleGenerateScript();
  }, []);

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    setDispatchStatus(null);
    try {
      const generated = await YouTubeShortsService.generateShortsScript(topic);
      setScript(generated);
    } catch (err: any) {
      console.error('YouTube Shorts generation error:', err);
      setDispatchStatus(`Generation Error: ${err?.message || 'Failed to generate YouTube Shorts script.'}`);
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

    const result = await YouTubeShortsService.scheduleYouTubeShort({
      id: `yt_${Date.now()}`,
      title: topic,
      script,
      visualPrompt: `9:16 vertical video animation in ${animationStyle} style for topic: ${topic}`,
      voicePreset: selectedVoice,
      backgroundMusic: selectedTrack,
      captionStyle: selectedCaptionStyle,
      tags: ['#YouTubeShorts', '#Shorts', '#AISaaS', '#MiniPostApp'],
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    });

    if (result.success) {
      setDispatchStatus(`Successfully scheduled for YouTube Shorts dispatch! Log ID: ${result.dispatchId}`);
      setTimeout(() => setDispatchStatus(null), 5000);
    }
  };

  if (!mounted) {
    return <div className="p-8 max-w-7xl mx-auto text-slate-400 font-mono text-sm animate-pulse">Loading YouTube Shorts Creation Studio...</div>;
  }

  const audioOptions = YouTubeShortsService.getAudioOptions();
  const captionStyles = YouTubeShortsService.getCaptionStyles();
  const brandPalette = YouTubeShortsService.getBrandPalette();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 via-cyan-500/20 to-amber-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold">
            <Video className="w-4 h-4 text-red-400" /> YOUTUBE SHORTS AI CREATION STUDIO
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">YouTube Shorts 9:16 Vertical Video Studio</h1>
          <p className="text-xs text-slate-400">Automated 60-second scripting, voiceover audio, auto-captioning, & vertical video dispatch.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setTopic('Top 5 AI Tools in 2026'); handleGenerateScript(); }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <button
            type="button"
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 hover:from-red-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span>Regenerate 60s Script</span>
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

      {/* 2. MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: 60s AI Script & Voiceover Tools */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Scripting Studio */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-red-400" /> 1. 60-Second Video Script Engine
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                {script.estimatedDurationSeconds}s DURATION
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">Shorts Topic / Core Angle</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            {/* Script Step Breakdown: Hook, Middle, CTA */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-red-500/30 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-red-400">
                  <span>HOOK (0s - 5s)</span>
                  <button type="button" onClick={() => handleCopy(script.hook, 'hook')} className="text-slate-400 hover:text-white flex items-center gap-1">
                    {copiedKey === 'hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={script.hook}
                  onChange={(e) => setScript({ ...script, hook: e.target.value })}
                  className="w-full bg-transparent border-none text-xs text-white focus:outline-none font-sans font-bold"
                />
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400">
                  <span>CORE BREAKDOWN (5s - 45s)</span>
                  <button type="button" onClick={() => handleCopy(script.middle, 'middle')} className="text-slate-400 hover:text-white flex items-center gap-1">
                    {copiedKey === 'middle' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={script.middle}
                  onChange={(e) => setScript({ ...script, middle: e.target.value })}
                  className="w-full bg-transparent border-none text-xs text-slate-200 focus:outline-none font-sans leading-relaxed"
                />
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-400">
                  <span>CALL TO ACTION (45s - 60s)</span>
                  <button type="button" onClick={() => handleCopy(script.cta, 'cta')} className="text-slate-400 hover:text-white flex items-center gap-1">
                    {copiedKey === 'cta' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={script.cta}
                  onChange={(e) => setScript({ ...script, cta: e.target.value })}
                  className="w-full bg-transparent border-none text-xs text-white focus:outline-none font-sans font-bold"
                />
              </div>
            </div>
          </div>

          {/* Voiceover Text-to-Speech & Background Track Selector */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-cyan-400" /> 2. AI Voiceover & Background Music Studio
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Voice Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 block flex items-center gap-1">
                  <Mic className="w-3 h-3 text-red-400" /> Voiceover TTS Accent
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                >
                  {audioOptions.voices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.style})
                    </option>
                  ))}
                </select>
              </div>

              {/* Music Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 block flex items-center gap-1">
                  <Music className="w-3 h-3 text-cyan-400" /> Background Audio Track
                </label>
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {audioOptions.tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.genre})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 9:16 Vertical Video Asset, Auto-Captioning, & Direct Dispatch */}
        <div className="lg:col-span-5 space-y-6">
          {/* 9:16 Vertical Preview Container */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-red-400" /> 3. Vertical 9:16 Motion Asset
              </h3>
              <span className="text-[10px] font-mono text-slate-400">1080 x 1920 px</span>
            </div>

            {/* Animation Style Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">Motion Style Transfer</label>
              <select
                value={animationStyle}
                onChange={(e) => setAnimationStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              >
                <option value="Kinetic Cyberpunk 3D">Kinetic Cyberpunk 3D</option>
                <option value="Modern Minimalist Executive">Modern Minimalist Executive</option>
                <option value="Vibrant Studio Neon">Vibrant Studio Neon</option>
              </select>
            </div>

            {/* 9:16 Aspect Card Preview */}
            <div className="w-full h-72 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-500 via-purple-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-red-500/20">
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">9:16 YouTube Shorts Preview</div>
                <div className="text-[10px] text-red-400 font-mono">{animationStyle}</div>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono text-yellow-400 font-bold max-w-xs truncate">
                {captionStyles.find((c) => c.id === selectedCaptionStyle)?.preview}
              </div>
            </div>

            {/* Auto-Captioning Styling Presets */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-slate-400 block flex items-center gap-1">
                <Type className="w-3 h-3 text-yellow-400" /> Auto-Captioning Style Preset
              </label>
              <div className="space-y-1.5">
                {captionStyles.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCaptionStyle(c.id)}
                    className={`w-full p-2.5 rounded-xl text-xs text-left transition-all border cursor-pointer ${
                      selectedCaptionStyle === c.id
                        ? 'bg-slate-950 border-yellow-500/50 text-yellow-400 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-white">{c.name}</div>
                    <div className="text-[9px] font-mono text-slate-500">{c.preview}</div>
                  </button>
                ))}
              </div>
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

          {/* YouTube Shorts Direct Schedule Action */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-between gap-4 shadow-xl">
            <div className="w-full text-left">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-red-400" /> 4. YouTube Shorts Direct Publishing
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">Dispatches via PublishingDispatchService directly to YouTube Shorts queue.</p>
            </div>

            <button
              type="button"
              onClick={handleScheduleDispatch}
              className="w-full py-3 bg-gradient-to-r from-red-500 via-purple-600 to-cyan-500 hover:from-red-400 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Schedule & Dispatch YouTube Short</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YouTubeShortsStudioView;
