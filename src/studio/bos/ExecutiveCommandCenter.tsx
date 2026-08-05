import React from 'react';

export const ExecutiveCommandCenter: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            👑 AI Business Operating System (AI-BOS) Executive Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">Autonomous business intelligence, revenue attribution, and strategic AI advisor</p>
        </div>
        <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold rounded-lg">
          v9.0 AI-BOS ACTIVE
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Annual Recurring Revenue (ARR)</span>
          <span className="text-2xl font-bold text-emerald-400">$1,776,000</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Content Attributed Revenue</span>
          <span className="text-2xl font-bold text-cyan-400">$645,000</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">LTV / CAC Ratio</span>
          <span className="text-2xl font-bold text-emerald-400">5.4x</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Pipeline Contribution</span>
          <span className="text-2xl font-bold text-cyan-300">38.5%</span>
        </div>
      </div>
    </div>
  );
};
