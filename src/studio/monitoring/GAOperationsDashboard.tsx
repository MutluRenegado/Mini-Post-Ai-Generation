import React from 'react';

export const GAOperationsDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🌍 StudioOS Version 6.0 General Availability (GA) Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">Enterprise SLA tracking, continuous quality telemetry, and customer metrics</p>
        </div>
        <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold rounded-lg">
          v6.0.0 GA ACTIVE
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Platform Availability</span>
          <span className="text-2xl font-bold text-emerald-400">99.99%</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Monthly Generations</span>
          <span className="text-2xl font-bold text-cyan-400">45,000+</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Avg Generation Time</span>
          <span className="text-2xl font-bold text-emerald-400">1,210ms</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Net Promoter Score (NPS)</span>
          <span className="text-2xl font-bold text-cyan-300">+78</span>
        </div>
      </div>
    </div>
  );
};
