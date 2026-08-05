'use client';

import React from 'react';
import {
  Wand2,
  LayoutGrid,
  Palette,
  FolderKanban,
  CalendarDays,
  BarChart3,
  Send,
  CheckCircle2,
  ShieldCheck,
  Terminal,
  Cpu,
  Settings,
  ArrowUpRight,
  Sparkles,
  Zap,
  Layers,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { StudioTab } from '../types/studio.types';
import { StudioDashboardService } from './dashboard.service';

interface StudioDashboardProps {
  onSelectTab: (tab: StudioTab) => void;
}

export function StudioDashboard({ onSelectTab }: StudioDashboardProps) {
  const summary = StudioDashboardService.getDashboardSummary();

  const cards: {
    id: StudioTab;
    title: string;
    description: string;
    icon: React.ElementType;
    badge: string;
    color: string;
    borderAccent: string;
    stat?: string;
  }[] = [
    {
      id: 'wizard',
      title: 'AI Creator Wizard',
      description: 'Multi-step post generator tailored to goal, tone, platform & brand voice.',
      icon: Wand2,
      badge: 'CREATE NOW',
      color: 'from-cyan-500/20 via-blue-600/10 to-transparent text-cyan-400',
      borderAccent: 'border-cyan-500/30 hover:border-cyan-400/60',
      stat: 'Step-by-Step AI',
    },
    {
      id: 'templates',
      title: 'Template Manager',
      description: '12 visual layout categories: Quotes, Carousels, Stories, Events & Memes.',
      icon: LayoutGrid,
      badge: '12 PRESETS',
      color: 'from-purple-500/20 via-indigo-600/10 to-transparent text-purple-400',
      borderAccent: 'border-purple-500/30 hover:border-purple-400/60',
      stat: 'Auto-Layouts',
    },
    {
      id: 'brand',
      title: 'Brand Kit Manager',
      description: 'Logos, colors, fonts, tone rules, watermark & company profile inheritance.',
      icon: Palette,
      badge: 'BRANDING',
      color: 'from-pink-500/20 via-rose-600/10 to-transparent text-pink-400',
      borderAccent: 'border-pink-500/30 hover:border-pink-400/60',
      stat: 'Auto-Applied',
    },
    {
      id: 'assets',
      title: 'Asset Library',
      description: 'Centralized media hub for high-res images, logos, icons & video clips.',
      icon: FolderKanban,
      badge: 'MEDIA HUB',
      color: 'from-emerald-500/20 via-teal-600/10 to-transparent text-emerald-400',
      borderAccent: 'border-emerald-500/30 hover:border-emerald-400/60',
      stat: 'Cloud Storage',
    },
    {
      id: 'calendar',
      title: 'Content Calendar',
      description: 'Monthly, weekly & campaign scheduling with drag & drop timezone support.',
      icon: CalendarDays,
      badge: `${summary.scheduledCount} QUEUED`,
      color: 'from-amber-500/20 via-orange-600/10 to-transparent text-amber-400',
      borderAccent: 'border-amber-500/30 hover:border-amber-400/60',
      stat: 'Auto Schedule',
    },
    {
      id: 'analytics',
      title: 'Studio Analytics',
      description: 'Track reach, impressions, CTR, engagement & best performing post times.',
      icon: BarChart3,
      badge: summary.engagementRate,
      color: 'from-blue-500/20 via-cyan-600/10 to-transparent text-blue-400',
      borderAccent: 'border-blue-500/30 hover:border-blue-400/60',
      stat: `${summary.totalReach.toLocaleString()} Reach`,
    },
    {
      id: 'publishing',
      title: 'Shipping & Publishing',
      description: 'Multi-channel post dispatcher with social history & instant retry jobs.',
      icon: Send,
      badge: 'MULTI-POST',
      color: 'from-indigo-500/20 via-violet-600/10 to-transparent text-indigo-400',
      borderAccent: 'border-indigo-500/30 hover:border-indigo-400/60',
      stat: `${summary.publishedCount} Published`,
    },
    {
      id: 'approval',
      title: 'Approval Workflow',
      description: '7-state post lifecycle: Draft → Review → Approved → Locked → Published.',
      icon: CheckCircle2,
      badge: 'WORKFLOW',
      color: 'from-teal-500/20 via-emerald-600/10 to-transparent text-teal-400',
      borderAccent: 'border-teal-500/30 hover:border-teal-400/60',
      stat: 'Protected State',
    },
    {
      id: 'quality',
      title: 'Quality & Standards',
      description: 'Grammar, readability, hook strength, CTA audit & character limits validation.',
      icon: ShieldCheck,
      badge: `${summary.qualityScoreAverage}% AVG SCORE`,
      color: 'from-cyan-400/20 via-sky-600/10 to-transparent text-cyan-300',
      borderAccent: 'border-cyan-400/30 hover:border-cyan-300/60',
      stat: 'Zero AI Raw Output',
    },
    {
      id: 'prompts',
      title: 'AI Prompt Manager',
      description: 'Repository for testing, versioning, scoring & editing AI system prompts.',
      icon: Terminal,
      badge: 'PROMPT REPO',
      color: 'from-violet-500/20 via-purple-600/10 to-transparent text-violet-400',
      borderAccent: 'border-violet-500/30 hover:border-violet-400/60',
      stat: 'V2 Engine',
    },
    {
      id: 'automation',
      title: 'Automation Manager',
      description: 'Campaign sequences, weekly generation triggers & bulk schedule rules.',
      icon: Cpu,
      badge: 'AUTOPILOT',
      color: 'from-rose-500/20 via-pink-600/10 to-transparent text-rose-400',
      borderAccent: 'border-rose-500/30 hover:border-rose-400/60',
      stat: 'Cron Active',
    },
    {
      id: 'settings',
      title: 'Studio Settings',
      description: 'API keys, default profiles, notification rules & timezone preferences.',
      icon: Settings,
      badge: 'CONFIG',
      color: 'from-slate-500/20 via-slate-600/10 to-transparent text-slate-300',
      borderAccent: 'border-slate-700 hover:border-slate-500',
      stat: 'System Ready',
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] border border-cyan-500/20 p-6 md:p-8 shadow-2xl shadow-cyan-950/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> MINIPOST STUDIO v1.0
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Content Studio Command Hub
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl">
              Canva + Notion + Buffer + ChatGPT combined into one unified, multi-platform publishing engine.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('wizard')}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Launch Creator Wizard</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Quick Ticker Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-800/80">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> TOTAL POSTS
            </div>
            <div className="text-xl font-black text-white mt-1">{summary.totalPosts}</div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-800/80">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> SCHEDULED QUEUE
            </div>
            <div className="text-xl font-black text-white mt-1">{summary.scheduledCount}</div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-800/80">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> PUBLISHED
            </div>
            <div className="text-xl font-black text-white mt-1">{summary.publishedCount}</div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-800/80">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> AVG QUALITY
            </div>
            <div className="text-xl font-black text-emerald-400 mt-1">{summary.qualityScoreAverage}%</div>
          </div>
        </div>
      </div>

      {/* Grid of Studio Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-200 tracking-tight flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-cyan-400" /> Studio Modules & Tools
          </h2>
          <span className="text-xs text-slate-400 font-mono">Select a card to navigate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onSelectTab(card.id)}
                className={`group relative rounded-2xl bg-[#0F131E] border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20 cursor-pointer flex flex-col justify-between overflow-hidden ${card.borderAccent}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">{card.stat}</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
