'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Share2, Layers, CheckCircle2, ArrowRight, Play } from 'lucide-react';

export default function ProductTourPage() {
  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans p-6 sm:p-12 space-y-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest">
          INTERACTIVE PRODUCT TOUR
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Welcome to the Mini Post App Creator Suite
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Craft 1 master post and autonomously multiply it into 11 platform-tailored formats powered by Gemini AI Flash.
        </p>
      </div>

      {/* Tour Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-6 space-y-4 shadow-xl hover:border-cyan-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg">
            1
          </div>
          <h2 className="text-xl font-extrabold text-white">Master Idea Input</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter a single sentence topic, article draft, or campaign directive into the guided AI wizard.
          </p>
          <div className="pt-2 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Research & Knowledge Engine</span>
          </div>
        </div>

        <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-6 space-y-4 shadow-xl hover:border-purple-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-lg">
            2
          </div>
          <h2 className="text-xl font-extrabold text-white">Final Text & Image Pipeline</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Content is generated, validated for grammar/brand standards, and passed to the 95% semantic visual analyzer.
          </p>
          <div className="pt-2 text-[11px] font-mono text-purple-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            <span>95% Semantic Acceptance Threshold</span>
          </div>
        </div>

        <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-6 space-y-4 shadow-xl hover:border-emerald-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
            3
          </div>
          <h2 className="text-xl font-extrabold text-white">11-Platform Dispatch</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Publish or schedule directly to Facebook, X, LinkedIn, Instagram, TikTok, YouTube, Threads, and Pinterest.
          </p>
          <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Multi-Channel Dispatch</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <Link
          href="/dashboard/fast-post"
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-sm rounded-full shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Launch 7-Step Studio Studio Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-8 py-4 bg-[#121724] hover:bg-[#1A2133] border border-[#1F2B45] text-slate-200 hover:text-white font-extrabold text-sm rounded-full transition-all flex items-center justify-center gap-2"
        >
          <span>Open Main Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
