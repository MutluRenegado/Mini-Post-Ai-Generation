'use client';

import React from 'react';

export const BillingStudio: React.FC = () => {
  return (
    <div className="p-6 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            💳 Billing & Enterprise Subscription Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage Stripe billing, enterprise subscription tiers, and usage quotas</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Cleaned Studio State')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold rounded-lg">
            STRIPE ACTIVE
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
          <span className="text-cyan-400 font-bold block">PRO CREATOR</span>
          <span className="text-3xl font-black text-white">$29 <span className="text-xs text-slate-400 font-normal">/ mo</span></span>
          <p className="text-slate-300">Unlimited posts across 5 platforms, standard quality engine</p>
        </div>

        <div className="p-5 bg-slate-900 rounded-xl border border-cyan-500/40 relative space-y-3">
          <span className="absolute -top-3 right-4 px-2 py-0.5 bg-cyan-600 text-white text-[10px] font-bold rounded">POPULAR</span>
          <span className="text-cyan-400 font-bold block">AGENCY SCALE</span>
          <span className="text-3xl font-black text-white">$99 <span className="text-xs text-slate-400 font-normal">/ mo</span></span>
          <p className="text-slate-300">Unlimited multi-asset bundles, 11 platforms, RAG cache & team workspaces</p>
        </div>

        <div className="p-5 bg-slate-900 rounded-xl border border-purple-500/40 space-y-3">
          <span className="text-purple-400 font-bold block">ENTERPRISE TRUST</span>
          <span className="text-3xl font-black text-white">$299 <span className="text-xs text-slate-400 font-normal">/ mo</span></span>
          <p className="text-slate-300">Explainable AI trace, SOC 2 policy engine, dedicated cloud region & 24/7 SLA</p>
        </div>
      </div>
    </div>
  );
};
