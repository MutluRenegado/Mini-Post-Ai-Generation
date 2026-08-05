'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Send, CheckCircle2, RotateCcw } from 'lucide-react';
import { PublishingDispatchService, DispatchExecutionLog } from '@/lib/services/publishingDispatchService';

export function ActivityDetailsWidget() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<DispatchExecutionLog[]>([]);

  useEffect(() => {
    setMounted(true);
    setLogs(PublishingDispatchService.getStoredDispatchLogs());
  }, []);

  if (!mounted) {
    return <div className="p-5 bg-[#12151E] border border-[#1E2330] rounded-2xl animate-pulse text-slate-400 font-mono text-xs">Loading Recent Activity...</div>;
  }

  return (
    <div className="bg-[#12151E]/90 border border-[#1E2330] rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2330]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Recent Activity & Dispatch Logs</h3>
            <span className="text-[10px] text-slate-400 font-mono">AUTOMATED EXECUTION PIPELINE</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40 font-bold">
          {logs.length} LOGS
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
        {logs.slice(0, 4).map((log) => {
          const isDispatched = log.status === 'Dispatched';
          return (
            <div
              key={log.id}
              className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <Send className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <div className="truncate">
                  <div className="text-white font-bold truncate">{log.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{log.platform}</div>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border shrink-0 ${
                  isDispatched
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {log.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
