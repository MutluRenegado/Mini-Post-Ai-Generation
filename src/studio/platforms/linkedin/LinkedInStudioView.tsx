'use client';

import React, { useState } from 'react';
import { LinkedInPlatformService } from './linkedin.service';

export const LinkedInStudioView: React.FC<{ onBack?: () => void }> = () => {
  const [topic, setTopic] = useState('Enterprise AI Strategy');
  const metrics = LinkedInPlatformService.getMetrics();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generated, setGenerated] = useState<{ hook: string; body: string; hashtags: string[] } | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await LinkedInPlatformService.generateThoughtLeadershipPost(topic);
      setGenerated(res);
    } catch (err: any) {
      console.error('LinkedIn generation error:', err);
      setErrorMsg(err?.message || 'Failed to generate LinkedIn post.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen font-sans">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            💼 LinkedIn AI Thought Leadership Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">Professional B2B content, executive hooks, and thought leadership generator</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setTopic('Enterprise AI Strategy'); setGenerated(null); setErrorMsg(null); }}
            className="px-3.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold rounded-lg">
            LINKEDIN ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 font-mono text-xs">
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Connections & Followers</span>
          <span className="text-2xl font-bold text-cyan-400">{metrics.totalConnections}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Post Impressions</span>
          <span className="text-2xl font-bold text-emerald-400">{metrics.postImpressions}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Profile Views</span>
          <span className="text-2xl font-bold text-cyan-300">{metrics.profileViews}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Avg Engagement Rate</span>
          <span className="text-2xl font-bold text-emerald-400">{metrics.avgEngagementRate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Generate Executive LinkedIn Article</h3>
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-mono text-rose-300">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Topic or Strategic Insight</label>
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
            {isGenerating ? 'Generating via AI...' : 'Generate LinkedIn Post'}
          </button>
        </div>

        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 border-b border-slate-800 pb-2">LinkedIn Post Preview</h3>
          {generated ? (
            <div className="text-slate-200 bg-slate-900 p-4 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
              {generated.hook}
              {'\n\n'}
              {generated.body}
              {'\n\n'}
              <span className="text-cyan-400">{generated.hashtags.join(' ')}</span>
            </div>
          ) : (
            <div className="text-slate-500 italic p-4">Click generate to render real AI post...</div>
          )}
        </div>
      </div>
    </div>
  );
};
