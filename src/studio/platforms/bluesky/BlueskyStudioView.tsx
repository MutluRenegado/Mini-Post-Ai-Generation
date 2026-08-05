'use client';

import React, { useState } from 'react';
import { BlueskyPlatformService } from './bluesky.service';

export const BlueskyStudioView: React.FC<{ onBack?: () => void }> = () => {
  const [topic, setTopic] = useState('Open Protocol Content');
  const metrics = BlueskyPlatformService.getMetrics();
  const [skeet, setSkeet] = useState(BlueskyPlatformService.generateSkeet(topic));

  const handleGenerate = () => {
    setSkeet(BlueskyPlatformService.generateSkeet(topic));
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen font-sans">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            🦋 Bluesky AI Creator Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">Decentralized AT Protocol posts, skeets, and community engagement studio</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setTopic('Open Protocol Content'); setSkeet(BlueskyPlatformService.generateSkeet('Open Protocol Content')); }}
            className="px-3.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold rounded-lg">
            BLUESKY ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 font-mono text-xs">
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Followers</span>
          <span className="text-2xl font-bold text-cyan-400">{metrics.followers}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Reposts</span>
          <span className="text-2xl font-bold text-emerald-400">{metrics.reposts}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Likes</span>
          <span className="text-2xl font-bold text-cyan-300">{metrics.likes}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Engagement Rate</span>
          <span className="text-2xl font-bold text-emerald-400">{metrics.engagementRate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Generate Bluesky Skeet</h3>
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
            Generate Skeet
          </button>
        </div>

        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 border-b border-slate-800 pb-2">Bluesky Post Preview</h3>
          <div className="text-slate-200 bg-slate-900 p-4 rounded-lg border border-slate-800">
            <p>{skeet.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
