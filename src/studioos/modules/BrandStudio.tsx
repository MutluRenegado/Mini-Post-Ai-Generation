'use client';

import React from 'react';
import { BrandKitView } from '@/studio/brand/BrandKitView';
import { AssetLibraryView } from '@/studio/assets/AssetLibraryView';
import { StudioCalendarView } from '@/studio/calendar/StudioCalendarView';

export const BrandStudio: React.FC = () => {
  const [tab, setTab] = React.useState<'brand' | 'assets' | 'calendar'>('brand');
  const dummyBack = () => {};

  const handleClean = () => {
    setTab('brand');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('brand')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'brand' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎨 Brand Kit & Rules
          </button>
          <button
            onClick={() => setTab('assets')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'assets' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📁 Asset Library
          </button>
          <button
            onClick={() => setTab('calendar')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'calendar' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📅 Content Calendar
          </button>
        </div>
        <button
          onClick={handleClean}
          className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer mr-1"
        >
          🧹 Clean Studio
        </button>
      </div>

      {tab === 'brand' && <BrandKitView onBack={dummyBack} />}
      {tab === 'assets' && <AssetLibraryView onBack={dummyBack} />}
      {tab === 'calendar' && <StudioCalendarView onBack={dummyBack} />}
    </div>
  );
};
