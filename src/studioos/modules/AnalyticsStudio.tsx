'use client';

import React from 'react';
import { StudioAnalyticsView } from '@/studio/analytics/StudioAnalyticsView';
import { ExecutiveDashboard } from '@/studio/dashboard/ExecutiveDashboard';

export const AnalyticsStudio: React.FC = () => {
  const [tab, setTab] = React.useState<'analytics' | 'executive'>('executive');
  const dummyBack = () => {};

  const handleClean = () => {
    setTab('executive');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('executive')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'executive' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Executive ROI & Performance Dashboard
          </button>
          <button
            onClick={() => setTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Studio Generation Analytics
          </button>
        </div>
        <button
          onClick={handleClean}
          className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer mr-1"
        >
          🧹 Clean Studio
        </button>
      </div>

      {tab === 'executive' ? <ExecutiveDashboard /> : <StudioAnalyticsView onBack={dummyBack} />}
    </div>
  );
};
