'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCheck, ShieldCheck, CreditCard, Layers } from 'lucide-react';
import { useAuth } from '@/modules/auth/context/AuthContext';

export function AccountDetailsWidget() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-5 bg-[#12151E] border border-[#1E2330] rounded-2xl animate-pulse text-slate-400 font-mono text-xs">Loading Account Details...</div>;
  }

  const userEmail = user?.email || 'authenticated-user@minipost.app';
  const tenantId = `tenant_${user?.uid ? user.uid.slice(0, 8) : 'demo8941'}`;

  return (
    <div className="bg-[#12151E]/90 border border-[#1E2330] rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2330]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Account & License Profile</h3>
            <span className="text-[10px] text-slate-400 font-mono">GENERAL STUDIO TENANT</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase">
          PRO TIER
        </span>
      </div>

      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-slate-400">Account User:</span>
          <span className="text-white font-bold truncate max-w-[180px]">{userEmail}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-slate-400">Tenant ID:</span>
          <span className="text-cyan-400 font-bold">{tenantId}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-slate-400">Billing Cycle:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 inline" /> 28 Days Active
          </span>
        </div>
      </div>

      <div className="pt-1">
        <Link
          href="/subscribe"
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Manage Subscription via Stripe
        </Link>
      </div>
    </div>
  );
}
