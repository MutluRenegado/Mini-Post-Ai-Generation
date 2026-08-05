'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function IncomingPaymentsWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-5 bg-[#12151E] border border-[#1E2330] rounded-2xl animate-pulse text-slate-400 font-mono text-xs">Loading Incoming Payments...</div>;
  }

  const payments = [
    { id: '1', date: 'Jul 30, 2026', amount: '$29.00', plan: 'Pro Monthly Tier', status: 'Succeeded' },
    { id: '2', date: 'Jun 30, 2026', amount: '$29.00', plan: 'Pro Monthly Tier', status: 'Succeeded' },
  ];

  return (
    <div className="bg-[#12151E]/90 border border-[#1E2330] rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2330]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Stripe Payment Sync & Invoices</h3>
            <span className="text-[10px] text-slate-400 font-mono">STRIPE PAYMENT LINKS ACTIVE</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 font-bold">
          STRIPE SYNC
        </span>
      </div>

      <div className="space-y-2">
        {payments.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs font-mono"
          >
            <div>
              <div className="text-white font-bold">{p.plan} ({p.amount})</div>
              <div className="text-[10px] text-slate-500">{p.date}</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold">
              {p.status}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-1">
        <Link
          href="/subscribe"
          className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Upgrade Plan via Stripe Link
        </Link>
      </div>
    </div>
  );
}
