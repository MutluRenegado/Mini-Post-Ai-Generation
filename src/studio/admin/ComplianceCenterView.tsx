'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Lock, FileText } from 'lucide-react';
import { AuditLogService, AuditLogEntry } from '@/lib/services/auditLogService';

export function ComplianceCenterView() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setMounted(true);
    setLogs(AuditLogService.getAuditLogs());
  }, []);

  if (!mounted) {
    return <div className="p-8 max-w-7xl mx-auto text-slate-400 font-mono text-sm animate-pulse">Loading Compliance & Audit Center...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      <div className="bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
          <ShieldAlert className="w-3.5 h-3.5" /> COMPLIANCE & SECURITY AUDIT CENTER
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight pt-1">Compliance & Audit Center</h1>
        <p className="text-xs text-slate-400">Security audit trail, OAuth token access logs, and enterprise governance controls.</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Audit Execution Trail</h3>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            {logs.length} AUDIT LOGS
          </span>
        </div>

        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
              <div>
                <div className="font-mono text-cyan-300 font-bold">{log.action}</div>
                <div className="text-slate-400">{log.details}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 block">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{log.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ComplianceCenterView;
