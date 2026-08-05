'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Wand2,
  Send,
  Copy,
  Check,
  RefreshCw,
  Palette,
  CheckCircle2,
  Layers,
  Flame,
  BookOpen,
  HelpCircle,
  ImageIcon,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  ThreadsStudioService,
  ThreadsTone,
  ThreadsThreadPackage,
  ThreadsPostPart,
} from './threads.service';
import { RbacAuthGuard } from '@/lib/services/rbacAuthGuard';

interface ThreadsStudioViewProps {
  onBack?: () => void;
}

export function ThreadsStudioView({ onBack }: ThreadsStudioViewProps) {
  const [mounted, setMounted] = useState(false);
  const [topic, setTopic] = useState('Why 99% of SaaS Creators Fail at Threads Growth');
  const [selectedTone, setSelectedTone] = useState<ThreadsTone>('provocative');
  const [visualAspect, setVisualAspect] = useState<'4:5' | '1:1'>('4:5');
  const [isGenerating, setIsGenerating] = useState(false);

  const [threadPkg, setThreadPkg] = useState<ThreadsThreadPackage>({
    topic: '',
    tone: 'provocative',
    parts: [],
    visualPrompt: '',
    colorPalette: ['#000000', '#06B6D4', '#EC4899'],
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    handleGenerateThread();
  }, []);

  const handleGenerateThread = async () => {
    setIsGenerating(true);
    setDispatchStatus(null);
    try {
      const generated = await ThreadsStudioService.generateSerializedThread(topic, selectedTone);
      setThreadPkg(generated);
    } catch (err: any) {
      console.error('Threads generation error:', err);
      setDispatchStatus(`Generation Error: ${err?.message || 'Failed to generate Threads thread.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePartContentChange = (index: number, newContent: string) => {
    const updated = [...threadPkg.parts];
    updated[index] = {
      ...updated[index],
      content: newContent,
      charCount: newContent.length,
    };
    setThreadPkg({ ...threadPkg, parts: updated });
  };

  const handleAddPart = () => {
    const nextIdx = threadPkg.parts.length + 1;
    const newPart: ThreadsPostPart = {
      partIndex: nextIdx,
      content: `${nextIdx}/ Additional point in your serial thread breakdown...`,
      charCount: 50,
      hasVisualAsset: false,
    };
    setThreadPkg({ ...threadPkg, parts: [...threadPkg.parts, newPart] });
  };

  const handleRemovePart = (index: number) => {
    if (threadPkg.parts.length <= 2) return;
    const updated = threadPkg.parts.filter((_, idx) => idx !== index).map((p, idx) => ({ ...p, partIndex: idx + 1 }));
    setThreadPkg({ ...threadPkg, parts: updated });
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

    const result = await ThreadsStudioService.scheduleThreadsPackage(threadPkg);

    if (result.success) {
      setDispatchStatus(`Successfully queued multi-part thread dispatch to Meta Threads! Log ID: ${result.dispatchId}`);
      setTimeout(() => setDispatchStatus(null), 5000);
    }
  };

  if (!mounted) {
    return <div className="p-8 max-w-7xl mx-auto text-slate-400 font-mono text-sm animate-pulse">Loading Threads Creation Studio...</div>;
  }

  const brandPalette = ThreadsStudioService.getBrandPalette();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 via-pink-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            <MessageSquare className="w-4 h-4 text-pink-400" /> THREADS CREATION STUDIO (META THREADS)
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Conversational Multi-Part Thread Serializer</h1>
          <p className="text-xs text-slate-400">Algorithmic reply-optimizing hooks, serial post breakdown, & direct Threads dispatch.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setTopic('Conversational Product Launch Strategy'); handleGenerateThread(); }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <button
            type="button"
            onClick={handleGenerateThread}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span>Regenerate Thread</span>
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

      {/* 2. CONVERSATIONAL TONE ADJUSTER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'provocative', label: 'Provocative Thought-Leadership', icon: Flame, desc: 'High engagement & debate' },
          { id: 'storytelling', label: 'Casual Founder Storytelling', icon: BookOpen, desc: 'Relatable narrative & journey' },
          { id: 'educational', label: 'Educational Breakdown', icon: HelpCircle, desc: 'Step-by-step framework' },
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = selectedTone === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSelectedTone(t.id as ThreadsTone);
              }}
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
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold">ACTIVE TONE</span>
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t.label}</div>
                <div className="text-[10px] text-slate-500 font-mono">{t.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN CREATION CANVAS (SERIAL THREAD POST CARDS + VISUAL CARD & DISPATCH) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Multi-Part Serial Post Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-400" /> 1. Multi-Part Serial Thread Posts ({threadPkg.parts.length} Parts)
              </h3>
              <button
                type="button"
                onClick={handleAddPart}
                className="px-3 py-1 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Thread Part
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">Thread Core Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-sans"
              />
            </div>

            {/* Render Each Serial Thread Part Card */}
            <div className="space-y-3 pt-2">
              {threadPkg.parts.map((part, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 relative">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                    <span className="text-pink-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-[10px] text-white">
                        {part.partIndex}
                      </span>
                      {part.partIndex === 1 ? 'POST 1 (HOOK)' : part.partIndex === threadPkg.parts.length ? 'FINAL POST (CTA & REPLY LOOP)' : `POST ${part.partIndex} (NARRATIVE)`}
                    </span>

                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="text-[10px] text-slate-500">{part.charCount} chars</span>
                      <button type="button" onClick={() => handleCopy(part.content, `part_${idx}`)} className="hover:text-white flex items-center gap-1">
                        {copiedKey === `part_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy
                      </button>
                      {threadPkg.parts.length > 2 && (
                        <button type="button" onClick={() => handleRemovePart(idx)} className="hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={part.content}
                    onChange={(e) => handlePartContentChange(idx, e.target.value)}
                    className="w-full bg-transparent border-none text-xs text-slate-200 focus:outline-none font-sans leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4:5 Text-Card Graphic & Direct Threads Dispatch */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual Text-Card Graphic Studio */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" /> 2. 4:5 Text-Card Graphic Integration
              </h3>
              <div className="flex items-center gap-1">
                {(['4:5', '1:1'] as const).map((asp) => (
                  <button
                    key={asp}
                    type="button"
                    onClick={() => setVisualAspect(asp)}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded cursor-pointer ${
                      visualAspect === asp ? 'bg-pink-500 text-black' : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {asp}
                  </button>
                ))}
              </div>
            </div>

            {/* 4:5 Card Preview */}
            <div className={`w-full bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between p-5 relative overflow-hidden transition-all ${visualAspect === '4:5' ? 'h-64' : 'h-52'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-widest">MINI POST • THREADS CARD</span>
                <div className="flex items-center gap-1">
                  {brandPalette.map((hex, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hex }} />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-black text-white leading-snug tracking-tight">
                  "{topic}"
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {selectedTone.toUpperCase()} • 4:5 CAROUSEL GRAPHIC
                </div>
              </div>

              <div className="text-[9px] font-mono text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                <span>SWIPE FOR THREAD FULL BREAKDOWN 👉</span>
                <span className="text-pink-400 font-bold">POST 1/5</span>
              </div>
            </div>

            {/* Brand Kit Palette */}
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

          {/* Threads Queue Direct Dispatch Action */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-between gap-4 shadow-xl">
            <div className="w-full text-left">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-pink-400" /> 3. Meta Threads Queue Direct Dispatch
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">Dispatches via PublishingDispatchService directly to Meta Threads queue.</p>
            </div>

            <button
              type="button"
              onClick={handleScheduleDispatch}
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Schedule & Dispatch Serial Thread ({threadPkg.parts.length} Posts)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreadsStudioView;
