'use client';

import React from 'react';
import { TemplateGalleryView } from '@/studio/templates/TemplateGalleryView';
import { PipelineInspector } from '@/studio/inspector/PipelineInspector';

export const CreatorStudio: React.FC<{ initialTab?: 'templates' | 'pipeline' }> = ({ initialTab = 'templates' }) => {
  const [tab, setTab] = React.useState<'templates' | 'pipeline'>(initialTab);
  const dummyBack = () => {};

  const handleClean = () => {
    setTab('templates');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('templates')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'templates' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎨 Template Gallery & Production Canvases
          </button>
          <button
            onClick={() => setTab('pipeline')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'pipeline' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔍 7-Step Pipeline Creator Studio
          </button>
        </div>
        <button
          onClick={handleClean}
          className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer mr-1"
        >
          🧹 Clean Studio
        </button>
      </div>

      {tab === 'templates' ? <TemplateGalleryView onBack={dummyBack} /> : <PipelineInspector />}
    </div>
  );
};
