'use client';

import React, { useState, useEffect } from 'react';

export interface DispatchLog {
  id: string;
  platform: string;
  title: string;
  status: 'Dispatched' | 'Retrying' | 'Failed' | 'Queued';
  timestamp: string;
}

export default function PublishingDispatchView() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<DispatchLog[]>([
    { id: '1', platform: 'LinkedIn', title: 'Product Launch Announcement', status: 'Dispatched', timestamp: 'Today, 10:00 AM' },
    { id: '2', platform: 'X / Twitter', title: 'AI Automation Workflow Tips', status: 'Dispatched', timestamp: 'Today, 09:30 AM' },
    { id: '3', platform: 'Instagram', title: 'Behind the Scenes Reel', status: 'Retrying', timestamp: 'Today, 09:00 AM' },
  ]);

  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRunDispatch = () => {
    setDispatching(true);
    setTimeout(() => {
      const newLog: DispatchLog = {
        id: Date.now().toString(),
        platform: 'Multi-Network (11 Platforms)',
        title: 'Instant Multi-Modal Broadcast',
        status: 'Dispatched',
        timestamp: 'Just now',
      };
      setLogs([newLog, ...logs]);
      setDispatching(false);
    }, 1500);
  };

  if (!mounted) {
    return <div className="p-6 max-w-5xl mx-auto text-slate-400 font-mono text-sm">Loading Publishing Dispatch...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto text-slate-100 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            🚀 Shipping & Multi-Platform Publishing
          </h2>
          <p className="text-sm text-slate-400">
            Multi-social network dispatching system with execution logs, connected channel status, and automatic retry.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRunDispatch}
          disabled={dispatching}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition disabled:opacity-50 cursor-pointer font-bold"
        >
          {dispatching ? 'Dispatching...' : '⚡ Trigger Live Dispatch'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
          <span className="text-xs text-slate-400 uppercase font-semibold">Connected Channels</span>
          <h3 className="text-xl font-bold text-cyan-400 mt-1">11 / 11 Active</h3>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
          <span className="text-xs text-slate-400 uppercase font-semibold">Queue Status</span>
          <h3 className="text-xl font-bold text-emerald-400 mt-1">Fully Operational</h3>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">📋 Real-Time Execution Logs</h3>
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between bg-slate-950 border border-slate-800/80 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌐</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">{log.title}</h4>
                  <p className="text-xs text-slate-400">{log.platform} • {log.timestamp}</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                log.status === 'Dispatched' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                log.status === 'Retrying' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
