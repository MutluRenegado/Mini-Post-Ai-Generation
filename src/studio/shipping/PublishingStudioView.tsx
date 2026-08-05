'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Zap,
  Globe,
  Radio,
  Sliders,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ShippingEngineService, DispatchLogItem, ConnectedChannelStatus } from './shipping.service';

interface PublishingStudioViewProps {
  onBack?: () => void;
}

export function PublishingStudioView({ onBack }: PublishingStudioViewProps) {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<DispatchLogItem[]>([]);
  const [dispatching, setDispatching] = useState(false);
  const [channels, setChannels] = useState<ConnectedChannelStatus[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'channels'>('logs');

  useEffect(() => {
    setMounted(true);
    setLogs(ShippingEngineService.getStoredLogs());
    setChannels(ShippingEngineService.getConnectedChannels());
  }, []);

  const handleRunDispatch = () => {
    setDispatching(true);
    setTimeout(() => {
      const updated = ShippingEngineService.addDispatchLog({
        platform: 'Multi-Network (11 Platforms)',
        title: 'Instant Multi-Modal Broadcast',
        status: 'Dispatched',
      });
      setLogs(updated);
      setDispatching(false);
    }, 1500);
  };

  const handleRetry = (id: string) => {
    const updated = ShippingEngineService.retryDispatch(id);
    setLogs(updated);
  };

  if (!mounted) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-slate-400 font-mono text-sm animate-pulse">
        Loading Multi-Platform Publishing Dispatch...
      </div>
    );
  }

  const activeChannelsCount = channels.filter((c) => c.status === 'Active').length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <Send className="w-3.5 h-3.5" /> PUBLISHING DISPATCH
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight pt-1">🚀 Shipping & Multi-Platform Publishing</h1>
          <p className="text-xs text-slate-400">
            Multi-social network dispatching system with execution logs, connected channel status, and automatic retry handling.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunDispatch}
          disabled={dispatching}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {dispatching ? (
            <>
              <Sliders className="w-4 h-4 animate-spin text-cyan-300" /> Dispatching Broadcast...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" /> ⚡ Trigger Live Dispatch
            </>
          )}
        </button>
      </div>

      {/* Stat Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shadow-md">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Connected Channels</span>
          <h3 className="text-lg font-black text-cyan-400 mt-1">{activeChannelsCount} / {channels.length} Active</h3>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shadow-md">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Queue Status</span>
          <h3 className="text-lg font-black text-emerald-400 mt-1">Fully Operational</h3>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shadow-md">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Dispatched</span>
          <h3 className="text-lg font-black text-white mt-1">{logs.filter((l) => l.status === 'Dispatched').length} Posts</h3>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shadow-md">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Retry Queue</span>
          <h3 className="text-lg font-black text-amber-400 mt-1">{logs.filter((l) => l.status === 'Retrying' || l.status === 'Failed').length} Pending</h3>
        </div>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'logs'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            📋 Real-Time Execution Logs ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('channels')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'channels'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🌐 Connected Channels ({channels.length})
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'logs' ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              📋 Real-Time Execution Logs
            </h3>
            <span className="text-[10px] font-mono text-slate-500">AUTO-RETRY ENABLED</span>
          </div>

          <div className="space-y-3">
            {logs.map((log) => {
              const isDispatched = log.status === 'Dispatched';
              const isRetrying = log.status === 'Retrying';

              return (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-950 border border-slate-800/80 p-4 rounded-2xl gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                      🌐
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{log.title}</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        <span className="text-cyan-400">{log.platform}</span> • {log.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold border ${
                        isDispatched
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isRetrying
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {log.status}
                    </span>

                    {(isRetrying || log.status === 'Failed') && (
                      <button
                        type="button"
                        onClick={() => handleRetry(log.id)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Retry Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Connected Channels Status Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {channels.map((chan) => (
            <div
              key={chan.name}
              className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 backdrop-blur-md shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" /> {chan.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  {chan.status}
                </span>
              </div>
              <div className="space-y-1 text-xs font-mono text-slate-400">
                <div>Account: <span className="text-slate-200">{chan.accountName}</span></div>
                <div>Last Sync: <span className="text-slate-400">{chan.lastSync}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublishingStudioView;

