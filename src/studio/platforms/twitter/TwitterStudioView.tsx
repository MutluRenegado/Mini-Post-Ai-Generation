'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  Sparkles,
  Wand2,
  Send,
  Copy,
  Check,
  RefreshCw,
  Palette,
  CheckCircle2,
  Layers,
  Hash,
  DollarSign,
  ImageIcon,
  MessageCircle,
} from 'lucide-react';
import {
  TwitterStudioService,
  TwitterPostDraft,
} from './twitter.service';
import { RbacAuthGuard } from '@/lib/services/rbacAuthGuard';

interface TwitterStudioViewProps {
  onBack?: () => void;
}

export function TwitterStudioView({ onBack }: TwitterStudioViewProps) {
  const [mounted, setMounted] = useState(false);
  const [topic, setTopic] = useState('Build a 10x Social Media Engine in Next.js');
  const [isThreadMode, setIsThreadMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<TwitterPostDraft | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    handleGeneratePost();
  }, []);

  const handleGeneratePost = async () => {
    setIsGenerating(true);
    setDispatchStatus(null);
    try {
      const generated = await TwitterStudioService.generateTwitterPost(topic, isThreadMode);
      setDraft(generated);
    } catch (err: any) {
      console.error('Twitter generation error:', err);
      setDispatchStatus(`Generation Error: ${err?.message || 'Failed to generate Twitter post.'}`);
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
    if (!draft) return;
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

    const result = await TwitterStudioService.scheduleTwitterPost(draft);

    if (result.success) {
      setDispatchStatus(`Successfully scheduled Twitter (X) post dispatch! Log ID: ${result.dispatchId}`);
      setTimeout(() => setDispatchStatus(null), 5000);
    }
  };

  if (!mounted) {
    return <div className="p-8 max-w-7xl mx-auto text-slate-400 font-mono text-sm animate-pulse">Loading Twitter (X) AI Creator...</div>;
  }

  const brandPalette = TwitterStudioService.getBrandPalette();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500/20 via-blue-500/20 to-indigo-500/20 border border-sky-500/40 text-sky-400 text-xs font-mono font-bold">
            <Share2 className="w-4 h-4 text-sky-400" /> TWITTER (X) AI CREATOR / WIZARD
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Twitter (X) Thread & Viral Post Engine</h1>
          <p className="text-xs text-slate-400">280-character post formatting, multi-tweet thread serializer, & cashtag/hashtag research.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setTopic('AI Workflow Automation for Tech Founders'); handleGeneratePost(); }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <button
            type="button"
            onClick={handleGeneratePost}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span>Generate Tweet / Thread</span>
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

      {/* 2. MODE SWITCHER: SINGLE TWEET VS MULTI-TWEET THREAD */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 block">Twitter Topic / Core Hook</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full sm:w-96 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsThreadMode(false);
                handleGeneratePost();
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                !isThreadMode ? 'bg-sky-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Single Tweet (280 chars)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsThreadMode(true);
                handleGeneratePost();
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                isThreadMode ? 'bg-sky-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Multi-Tweet Thread
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN CREATION CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Tweet / Thread Content Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-sky-400" /> 1. Generated X Copy
              </h3>
              {draft && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  draft.characterCount > 280 ? 'bg-red-950 text-red-400 border-red-800' : 'bg-sky-950 text-sky-400 border-sky-800'
                }`}>
                  {draft.characterCount} / 280 CHARS
                </span>
              )}
            </div>

            {draft && (
              <div>
                {!draft.isThread ? (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <textarea
                      rows={5}
                      value={draft.tweetText}
                      onChange={(e) => setDraft({ ...draft, tweetText: e.target.value, characterCount: e.target.value.length })}
                      className="w-full bg-transparent border-none text-xs text-white focus:outline-none font-sans leading-relaxed"
                    />
                    <div className="flex justify-end pt-2 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => handleCopy(draft.tweetText, 'tweet')}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === 'tweet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Tweet
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {draft.threadPosts?.map((tText, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-sky-400">
                          <span>TWEET {idx + 1} OF {draft.threadPosts?.length}</span>
                          <span>{tText.length} / 280</span>
                        </div>
                        <div className="text-xs text-white font-sans leading-relaxed">{tText}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Visual Asset, Hashtags & Cashtags, & Dispatch */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hashtags & Cashtags Research */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-sky-400" /> 2. Hashtag & Cashtag Research
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">HASHTAGS (#AlgorithmicReach)</span>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  {draft?.hashtags.map((h, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-sky-300 border border-slate-800">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">CASHTAGS ($MarketEngagement)</span>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  {draft?.cashtags.map((c, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-slate-800 font-bold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Brand Kit Palette */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 font-bold text-white">
                  <Palette className="w-3 h-3 text-sky-400" /> Brand 3-Color Palette
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

          {/* Twitter (X) Direct Dispatch Action */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-between gap-4 shadow-xl">
            <div className="w-full text-left">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" /> 3. Direct Twitter (X) Dispatch
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">Dispatches via PublishingDispatchService directly to Twitter (X) feed.</p>
            </div>

            <button
              type="button"
              onClick={handleScheduleDispatch}
              className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Schedule & Dispatch to Twitter (X)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwitterStudioView;
