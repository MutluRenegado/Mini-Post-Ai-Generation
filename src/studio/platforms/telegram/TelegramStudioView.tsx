'use client';

import React, { useState } from 'react';
import { TelegramPlatformService } from './telegram.service';

export const TelegramStudioView: React.FC<{ onBack?: () => void }> = () => {
  const [topic, setTopic] = useState('Crypto & Tech Insights');
  const metrics = TelegramPlatformService.getMetrics();
  const [broadcast, setBroadcast] = useState(TelegramPlatformService.generateChannelBroadcast(topic));

  const handleGenerate = () => {
    setBroadcast(TelegramPlatformService.generateChannelBroadcast(topic));
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen font-sans">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            ✈️ Telegram Broadcast AI Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">Telegram channel posts, formatted markdown broadcasts, and inline button generator</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setTopic('Crypto & Tech Insights'); setBroadcast(TelegramPlatformService.generateChannelBroadcast('Crypto & Tech Insights')); }}
            className="px-3.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold rounded-lg">
            TELEGRAM ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 font-mono text-xs">
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Subscribers</span>
          <span className="text-2xl font-bold text-cyan-400">{metrics.subscribers}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Avg Views / Post</span>
          <span className="text-2xl font-bold text-emerald-400">{metrics.avgViewsPerPost}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Shares</span>
          <span className="text-2xl font-bold text-cyan-300">{metrics.shares}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Channel Growth</span>
          <span className="text-2xl font-bold text-emerald-400">{metrics.growthRate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Create Channel Broadcast</h3>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-950 p-3 rounded-lg border border-slate-800 text-white text-xs"
            />
          </div>
          <button
            onClick={handleGenerate}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow-lg transition-all"
          >
            Generate Broadcast
          </button>
        </div>

        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 border-b border-slate-800 pb-2">Telegram Message Preview</h3>
          <div className="text-slate-200 bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm">{broadcast.title}</h4>
            <p className="whitespace-pre-wrap">{broadcast.body}</p>
            <div className="flex gap-2 pt-2">
              {broadcast.inlineButtons.map((btn, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-800 text-cyan-300 rounded border border-slate-700 font-bold text-[11px]">
                  {btn}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
