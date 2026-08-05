'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ArrowLeft,
  Calendar,
  Hash,
  Clock,
  PieChart,
  Copy,
  Check,
  Zap,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { StudioAnalyticsService, AnalyticsMetric, HashtagPerformance, PostingHourBreakdown } from './analytics.service';

interface StudioAnalyticsViewProps {
  onBack?: () => void;
}

export function StudioAnalyticsView({ onBack }: StudioAnalyticsViewProps) {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const metrics = StudioAnalyticsService.getAnalyticsMetrics(timeRange);
  const hashtags = StudioAnalyticsService.getTopHashtags();
  const postingHours = StudioAnalyticsService.getBestPostingHours();
  const platformShares = StudioAnalyticsService.getPlatformPerformance();

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  if (!mounted) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-slate-400 font-mono text-sm animate-pulse">
        Loading Studio Analytics Engine...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <BarChart3 className="w-3.5 h-3.5" /> REAL-TIME ANALYTICS
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight pt-1">📊 Studio Analytics & Performance</h1>
          <p className="text-xs text-slate-400">
            Deep analytics reporting reach, impressions, CTR, engagement breakdown, top hashtags, and optimal posting hours.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {(['7D', '30D', '90D'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  timeRange === range
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <span className="text-[10px] font-mono px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold uppercase tracking-wider hidden sm:inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> LIVE DATA ACTIVE
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-md space-y-1 shadow-lg hover:border-slate-700 transition-all"
          >
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{metric.label}</p>
            <h3 className={`text-2xl font-black tracking-tight ${metric.color}`}>{metric.value}</h3>
            <span className="text-xs text-emerald-400 mt-1 block font-mono flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {metric.change} vs prior period
            </span>
          </div>
        ))}
      </div>

      {/* Main Analytics Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performing Hashtags */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" /> 🔥 Top Performing Hashtags
            </h3>
            <span className="text-[10px] font-mono text-slate-400">HIGHEST ENGAGEMENT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hashtags.map((item, i) => (
              <div
                key={i}
                onClick={() => handleCopyTag(item.tag)}
                className="flex items-center justify-between bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800/80 hover:border-cyan-500/40 transition-colors cursor-pointer group"
              >
                <div>
                  <span className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                    {item.tag}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Reach: {item.reach} • Eng: {item.engagement}
                  </div>
                </div>
                {copiedTag === item.tag ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Best Posting Hours */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> ⏰ Best Posting Hours
            </h3>
            <span className="text-[10px] font-mono text-slate-400">OPTIMAL SCHEDULE</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {postingHours.map((item, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800/80 gap-1"
              >
                <div>
                  <span className="text-slate-200 font-semibold">{item.category}</span>
                  <span className="text-[10px] font-mono text-slate-400 block sm:inline sm:ml-2">
                    Peak: {item.peakDay}
                  </span>
                </div>
                <span className="text-cyan-400 font-bold font-mono">{item.bestHours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Distribution Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" /> Platform Reach Share Distribution
          </h3>
          <span className="text-[10px] font-mono text-slate-400">11 PLATFORMS INTEGRATED</span>
        </div>

        <div className="space-y-3">
          {/* Progress Bar Stack */}
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            {platformShares.map((p) => (
              <div
                key={p.platform}
                style={{ width: `${p.sharePercent}%` }}
                className={`h-full ${p.color}`}
                title={`${p.platform}: ${p.sharePercent}%`}
              />
            ))}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {platformShares.map((p) => (
              <div key={p.platform} className="flex items-center gap-2 text-xs">
                <div className={`w-2.5 h-2.5 rounded-full ${p.color} shrink-0`} />
                <div className="truncate">
                  <span className="text-slate-300 font-medium block truncate">{p.platform}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{p.sharePercent}% ({p.reach})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudioAnalyticsView;

