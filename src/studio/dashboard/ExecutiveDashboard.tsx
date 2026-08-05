import React from 'react';

export const ExecutiveDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <h2 className="text-xl font-bold text-white mb-1">📈 Executive Telemetry & ROI Dashboard</h2>
      <p className="text-xs text-slate-400 mb-6">Real-time business performance, generation metrics, and cost overview</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Total Generations</span>
          <span className="text-2xl font-bold text-cyan-400">1,248</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Avg Quality Score</span>
          <span className="text-2xl font-bold text-emerald-400">96.2 / 100</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Est Token Cost</span>
          <span className="text-2xl font-bold text-cyan-300">$0.18</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">RAG Cache Hit Rate</span>
          <span className="text-2xl font-bold text-emerald-400">94.8%</span>
        </div>
      </div>
    </div>
  );
};
