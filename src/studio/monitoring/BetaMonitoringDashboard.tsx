import React from 'react';

export const BetaMonitoringDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🛡️ Beta Operational Monitoring & Stabilization Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">Live tracking of GA release readiness metrics, defect status, and provider SLAs</p>
        </div>
        <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold rounded-lg">
          GA READY (v5.1)
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Open Critical Bugs</span>
          <span className="text-2xl font-bold text-emerald-400">0</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Verified Bug Fixes</span>
          <span className="text-2xl font-bold text-cyan-400">100%</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Provider SLA Uptime</span>
          <span className="text-2xl font-bold text-emerald-400">99.95%</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Beta User CSAT</span>
          <span className="text-2xl font-bold text-cyan-300">4.9 / 5.0</span>
        </div>
      </div>
    </div>
  );
};
