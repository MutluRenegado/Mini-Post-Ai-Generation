'use client';

import React, { useState } from 'react';
import { GoogleBusinessService } from './googlebusiness.service';

export const GoogleBusinessStudioView: React.FC<{ onBack?: () => void }> = () => {
  const [topic, setTopic] = useState('New Service Launch');
  const metrics = GoogleBusinessService.getMetrics();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [update, setUpdate] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await GoogleBusinessService.generateLocalBusinessUpdate(topic);
      setUpdate(res);
    } catch (err: any) {
      console.error('Google Business generation error:', err);
      setErrorMsg(err?.message || 'Failed to generate Google Business post.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen font-sans">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            📍 Google Business Profile AI Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">Local SEO updates, Google Maps posts, and business announcement manager</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setTopic('New Service Launch'); setUpdate(null); setErrorMsg(null); }}
            className="px-3.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold rounded-lg">
            GOOGLE BUSINESS ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 font-mono text-xs">
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Search Views</span>
          <span className="text-2xl font-bold text-cyan-400">{metrics.searchViews}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Maps Views</span>
          <span className="text-2xl font-bold text-emerald-400">{metrics.mapsViews}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Action Clicks</span>
          <span className="text-2xl font-bold text-cyan-300">{metrics.actionClicks}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Average Rating</span>
          <span className="text-2xl font-bold text-emerald-400">{metrics.avgRating}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Create Google Maps Business Post</h3>
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-mono text-rose-300">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Announcement or Promotion Topic</label>
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
            {isGenerating ? 'Generating Google Post via AI...' : 'Generate Google Post'}
          </button>
        </div>

        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 border-b border-slate-800 pb-2">Google Maps Card Preview</h3>
          {update ? (
            <div className="text-slate-200 bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm">{update.title}</h4>
              <p className="text-slate-300">{update.body}</p>
              <div className="pt-2">
                <span className="px-3 py-1.5 bg-cyan-600 text-white font-bold rounded text-[11px]">
                  {update.callToAction}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 italic p-4">Click generate to render real AI Google Maps post...</div>
          )}
        </div>
      </div>
    </div>
  );
};
