import React from 'react';

export const EcosystemAnalyticsDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <h2 className="text-xl font-bold text-white mb-1">📊 Ecosystem ROI & Developer SDK Analytics</h2>
      <p className="text-xs text-slate-400 mb-6">Track SDK API calls, Marketplace downloads, revenue impact, and tenant productivity gains</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">SDK API Volume</span>
          <span className="text-2xl font-bold text-cyan-400">128,000 req/mo</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Marketplace Downloads</span>
          <span className="text-2xl font-bold text-emerald-400">2,090</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Est Time Saved</span>
          <span className="text-2xl font-bold text-cyan-300">4,200 hrs</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Developer Apps Built</span>
          <span className="text-2xl font-bold text-emerald-400">84</span>
        </div>
      </div>
    </div>
  );
};
