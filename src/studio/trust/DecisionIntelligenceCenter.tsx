import React from 'react';

export const DecisionIntelligenceCenter: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🛡️ StudioOS Decision Intelligence & Trust Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">Explainable AI reasoning, human-in-the-loop approvals, and policy governance</p>
        </div>
        <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold rounded-lg">
          v10.0 TRUSTED GA
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Decision Traceability</span>
          <span className="text-2xl font-bold text-emerald-400">100% Explainable</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Human Approval Rate</span>
          <span className="text-2xl font-bold text-cyan-400">98.4%</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Active Policy Rules</span>
          <span className="text-2xl font-bold text-emerald-400">2 Active</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Responsible AI Score</span>
          <span className="text-2xl font-bold text-cyan-300">99 / 100</span>
        </div>
      </div>
    </div>
  );
};
