'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Clock,
  LayoutGrid,
  Copy,
  Check,
  Zap,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { PlatformHubService, SocialPlatformConfig } from './platform-hub.service';

interface PlatformsHubViewProps {
  onBack?: () => void;
  initialPlatformId?: string;
}

export function PlatformsHubView({ onBack, initialPlatformId = 'facebook' }: PlatformsHubViewProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>(initialPlatformId);
  const [activeSubTab, setActiveSubTab] = useState<'token' | 'postTypes' | 'templates' | 'analytics'>('token');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const platforms: SocialPlatformConfig[] = PlatformHubService.getAllPlatformConfigs();
  const currentPlatform = platforms.find((p) => p.id === selectedPlatformId) || platforms[0];

  const handleCopyPreset = (tmplName: string) => {
    setCopiedId(tmplName);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!mounted) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-slate-400 font-mono text-sm animate-pulse">
        Loading Multi-Platform Management Studio (11 Channels)...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      {/* 1. TOP HEADER */}
      <div className="bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            <Share2 className="w-3.5 h-3.5" /> 11-CHANNEL CONNECTED MANAGEMENT STUDIO
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Multi-Platform Integration Hub
          </h1>
          <p className="text-xs text-slate-400">
            Real-time API token monitoring, post format metrics, templates, and engagement analytics across all 11 social networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
            11 / 11 CHANNELS ONLINE
          </span>
        </div>
      </div>

      {/* 2. PLATFORM SELECTION TABS (ALL 11 NETWORKS) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {platforms.map((p) => {
          const isSelected = p.id === currentPlatform.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlatformId(p.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border flex items-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-black border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{p.name}</span>
              <span className={`w-2 h-2 rounded-full ${p.tokenStatus === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </button>
          );
        })}
      </div>

      {/* 3. PLATFORM PROFILE CARD */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg">
              {currentPlatform.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{currentPlatform.name}</h2>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-950 text-cyan-300 border border-slate-800">
                  {currentPlatform.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Handle: {currentPlatform.handle} • Audience: {currentPlatform.followersCount}
              </p>
            </div>
          </div>

          {/* Sub-Section Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto">
            {[
              { id: 'token', label: '1. API Token Status' },
              { id: 'postTypes', label: '2. Post Types Used' },
              { id: 'templates', label: '3. Platform Templates' },
              { id: 'analytics', label: '4. Analytics Metrics' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'bg-cyan-500 text-black shadow-md font-mono'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. SUB-SECTION VIEW CONTENT */}

        {/* SUB-SECTION 1: Integration & API Token Status */}
        {activeSubTab === 'token' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">API Protocol Endpoint</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  STATUS: ONLINE
                </span>
              </div>
              <div className="text-sm font-bold text-white font-mono">{currentPlatform.apiName}</div>
              <p className="text-xs text-slate-400 font-mono">
                OAuth 2.0 Token Expires in: <span className="text-cyan-400 font-bold">{currentPlatform.tokenExpiresInDays} Days</span>
              </p>
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs font-mono text-slate-400">
                Optimal Broadcast Window: <span className="text-amber-400 font-bold">{currentPlatform.bestPostingWindow}</span>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer"
              >
                Re-Validate OAuth Token
              </button>
            </div>
          </div>
        )}

        {/* SUB-SECTION 2: Post Types Used */}
        {activeSubTab === 'postTypes' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentPlatform.postTypes.map((pt) => (
              <div key={pt.name} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{pt.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {pt.sharePercent} Share
                  </span>
                </div>
                <div className="text-lg font-black text-emerald-400">{pt.avgEngagement} Avg. Engagement</div>
                <p className="text-[10px] text-slate-500 font-mono">Format optimized for {currentPlatform.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* SUB-SECTION 3: Platform-Specific Templates */}
        {activeSubTab === 'templates' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentPlatform.templates.map((tmpl) => (
              <div key={tmpl.name} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{tmpl.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                    {tmpl.format}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{tmpl.desc}</p>
                <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopyPreset(tmpl.name)}
                    className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedId === tmpl.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === tmpl.name ? 'Loaded Preset' : 'Use Preset'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUB-SECTION 4: Analytics & Performance Metrics */}
        {activeSubTab === 'analytics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Channel Reach</span>
              <div className="text-2xl font-black text-cyan-400">{currentPlatform.metrics.reach}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Impressions</span>
              <div className="text-2xl font-black text-indigo-400">{currentPlatform.metrics.impressions}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Click-Through (CTR)</span>
              <div className="text-2xl font-black text-emerald-400">{currentPlatform.metrics.ctr}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Engagement Rate</span>
              <div className="text-2xl font-black text-purple-400">{currentPlatform.metrics.engagementRate}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlatformsHubView;
