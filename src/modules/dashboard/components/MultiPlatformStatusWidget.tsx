'use client';

import React, { useState, useEffect } from 'react';
import { Share2, CheckCircle2, RefreshCw } from 'lucide-react';
import { SocialAuthService, ConnectedSocialAccount } from '@/lib/services/socialAuthService';

export function MultiPlatformStatusWidget() {
  const [mounted, setMounted] = useState(false);
  const [accounts, setAccounts] = useState<ConnectedSocialAccount[]>([]);

  useEffect(() => {
    setMounted(true);
    setAccounts(SocialAuthService.getConnectedAccounts());
  }, []);

  if (!mounted) {
    return <div className="p-5 bg-[#12151E] border border-[#1E2330] rounded-2xl animate-pulse text-slate-400 font-mono text-xs">Loading Connected Channels...</div>;
  }

  return (
    <div className="bg-[#12151E]/90 border border-[#1E2330] rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2330]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Multi-Platform Connection Status</h3>
            <span className="text-[10px] text-slate-400 font-mono">11 ACTIVE SOCIAL NETWORKS</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-800/40 font-bold">
          11 / 11 ONLINE
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-1 hover:border-cyan-500/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate">{acc.platform}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono truncate">{acc.accountHandle}</p>
            <div className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 pt-0.5">
              <CheckCircle2 className="w-3 h-3 inline" /> Connected
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
