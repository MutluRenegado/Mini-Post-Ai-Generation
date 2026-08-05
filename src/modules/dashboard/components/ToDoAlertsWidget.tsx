'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ToDoAlertsWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-5 bg-[#12151E] border border-[#1E2330] rounded-2xl animate-pulse text-slate-400 font-mono text-xs">Loading To-Do Alerts...</div>;
  }

  const alerts = [
    { id: '1', title: 'Schedule Tuesday Reel for Instagram', priority: 'High', due: 'In 2 hours' },
    { id: '2', title: 'Review Brand Kit Logo asset update', priority: 'Medium', due: 'Today' },
    { id: '3', title: 'Optimal posting window opens for LinkedIn', priority: 'Optimal', due: '10:00 AM EST' },
  ];

  return (
    <div className="bg-[#12151E]/90 border border-[#1E2330] rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2330]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">To-Do & Action Alerts</h3>
            <span className="text-[10px] text-slate-400 font-mono">RECOMMENDED ACTIONS</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 font-bold">
          3 PENDING
        </span>
      </div>

      <div className="space-y-2">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-slate-200 font-semibold truncate block">{item.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">{item.due}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
              {item.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
