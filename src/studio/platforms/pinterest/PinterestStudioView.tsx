'use client';

import React, { useState } from 'react';
import { PinterestPlatformService } from './pinterest.service';

export const PinterestStudioView: React.FC<{ onBack?: () => void }> = () => {
  const [topic, setTopic] = useState('Visual Social Marketing');
  const metrics = PinterestPlatformService.getMetrics();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pin, setPin] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await PinterestPlatformService.generatePinBundle(topic);
      setPin(res);
    } catch (err: any) {
      console.error('Pinterest generation error:', err);
      setErrorMsg(err?.message || 'Failed to generate Pin bundle.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen font-sans">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            📌 Pinterest Visual Pin AI Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">Vertical 2:3 visual pins, outbound click optimization, and Board management</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setTopic('Visual Social Marketing'); setPin(null); setErrorMsg(null); }}
            className="px-3.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold rounded-lg">
            PINTEREST ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 font-mono text-xs">
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Outbound Clicks</span>
          <span className="text-2xl font-bold text-cyan-400">{metrics.monthlyOutboundClicks}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Pin Saves</span>
          <span className="text-2xl font-bold text-emerald-400">{metrics.pinSaveCount}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Total Impressions</span>
          <span className="text-2xl font-bold text-cyan-300">{metrics.totalImpressions}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Top Category</span>
          <span className="text-xs font-bold text-emerald-400 block truncate">{metrics.topPerformingCategory}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Generate 2:3 Vertical Pin</h3>
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-mono text-rose-300">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Pin Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-950 p-3 rounded-lg border border-slate-800 text-white text-xs"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? 'Generating Pin via AI...' : 'Generate Pin Bundle'}
          </button>
        </div>

        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 border-b border-slate-800 pb-2">2:3 Pin Preview & Visual Prompt</h3>
          {pin ? (
            <div className="text-slate-200 bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm">{pin.title}</h4>
              <p className="text-slate-300">{pin.description}</p>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-cyan-300">
                🖼️ <strong>Visual Prompt:</strong> {pin.visualPrompt}
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                <span>Board: <strong className="text-white">{pin.suggestedBoard}</strong></span>
                <span className="text-cyan-400">{pin.destinationUrl}</span>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 italic p-4">Click generate to render real AI pin bundle...</div>
          )}
        </div>
      </div>
    </div>
  );
};
