'use client';

import React, { useState, useEffect } from 'react';

export default function StudioAnalyticsView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const metrics = [
    { label: 'Total Reach', value: '45,200', change: '+12.4%', color: 'text-cyan-400' },
    { label: 'Impressions', value: '128,450', change: '+18.1%', color: 'text-blue-400' },
    { label: 'Click-Through Rate (CTR)', value: '4.8%', change: '+0.6%', color: 'text-emerald-400' },
    { label: 'Engagement Rate', value: '8.2%', change: '+2.3%', color: 'text-amber-400' },
  ];

  if (!mounted) {
    return <div className="p-6 max-w-5xl mx-auto text-slate-400 font-mono text-sm">Loading Analytics...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto text-slate-100 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            📊 Studio Analytics & Performance
          </h2>
          <p className="text-sm text-slate-400">
            Deep analytics reporting reach, impressions, CTR, engagement breakdown, and optimal posting times.
          </p>
        </div>
        <span className="text-xs px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full font-medium">
          LIVE DATA ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{metric.label}</p>
            <h3 className={`text-2xl font-bold mt-2 ${metric.color}`}>{metric.value}</h3>
            <span className="text-xs text-emerald-400 mt-1 block">↗ {metric.change} vs last month</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">🔥 Top Performing Hashtags</h3>
          <div className="flex flex-wrap gap-2">
            {['#SaaS', '#NextJS', '#AIContent', '#WebDevelopment', '#TechTrends', '#MiniPostApp'].map((tag, i) => (
              <span key={i} className="text-xs px-3 py-1.5 bg-slate-950 text-cyan-400 border border-slate-800 rounded-xl font-medium cursor-pointer hover:border-cyan-500/40 transition">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">⏰ Best Posting Hours</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-300">LinkedIn & Professional</span>
              <span className="text-cyan-400 font-semibold">10:00 AM - 12:00 PM</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-300">X (Twitter) & Threads</span>
              <span className="text-cyan-400 font-semibold">02:00 PM - 04:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
