'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Wand2, Palette, CalendarDays, ArrowRight } from 'lucide-react';

export function QuickCreatorLauncherWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-5 bg-[#12151E] border border-[#1E2330] rounded-2xl animate-pulse text-slate-400 font-mono text-xs">Loading Quick Launcher...</div>;
  }

  const launchers = [
    { name: 'Fast Post Express', desc: '1-Click Multi-Modal AI Copy & Media Prompt', href: '/studio', icon: Zap, color: 'from-cyan-500 to-blue-600' },
    { name: 'Guided AI Wizard', desc: 'Step-by-Step Audience & Goal Guided Pipeline', href: '/studio', icon: Wand2, color: 'from-indigo-600 to-purple-600' },
    { name: 'Brand Kit Manager', desc: 'Configure Core Colors, Logo & Voice Rules', href: '/studio', icon: Palette, color: 'from-purple-600 to-pink-600' },
    { name: 'Content Calendar', desc: 'Visual Monthly Timeline & Optimal Posting', href: '/studio', icon: CalendarDays, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="bg-[#12151E]/90 border border-[#1E2330] rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2330]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            ⚡ Quick Studio Creator Launcher
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">1-CLICK ACCESS TO CREATOR TOOLS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {launchers.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 hover:border-cyan-500/50 transition-all group flex flex-col justify-between space-y-3 hover:shadow-lg shadow-black/40"
            >
              <div className="space-y-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white font-bold shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    <span>{item.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono pt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
