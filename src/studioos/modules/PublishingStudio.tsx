'use client';

import React from 'react';
import { PublishingStudioView } from '@/studio/shipping/PublishingStudioView';
import { PlatformsHubView } from '@/studio/platforms/PlatformsHubView';

export const PublishingStudio: React.FC = () => {
  const [tab, setTab] = React.useState<'dispatch' | 'hub'>('dispatch');
  const dummyBack = () => {};

  const handleClean = () => {
    setTab('dispatch');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('dispatch')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'dispatch' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 Publishing & Dispatch Studio
          </button>
          <button
            onClick={() => setTab('hub')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'hub' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌐 11 Multi-Platform Integration Hub
          </button>
        </div>
        <button
          onClick={handleClean}
          className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer mr-1"
        >
          🧹 Clean Studio
        </button>
      </div>

      {tab === 'dispatch' ? <PublishingStudioView onBack={dummyBack} /> : <PlatformsHubView onBack={dummyBack} />}
    </div>
  );
};
