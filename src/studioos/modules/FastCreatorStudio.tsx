'use client';

import React from 'react';
import { CreatorWizardView } from '@/studio/wizard/CreatorWizardView';
import { InstantPostView } from '@/studio/ai/InstantPostView';

import { useStudioAssistant } from '@/studio/assistant/StudioAssistantContext';

export const FastCreatorStudio: React.FC<{ initialMode?: 'wizard' | 'instant' }> = ({ initialMode = 'instant' }) => {
  const [mode, setMode] = React.useState<'wizard' | 'instant'>(initialMode);
  const assistant = useStudioAssistant();
  const dummyBack = () => {};

  const handleClean = () => {
    setMode('instant');
  };

  const handleOpenWizard = () => {
    setMode('wizard');
    assistant.openAssistant('wizard');
  };

  return (
    <div className="space-y-4 max-w-[1180px] mx-auto">
      <div className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('instant')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'instant' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Fast Post Express / Instant Creator
          </button>
          <button
            onClick={handleOpenWizard}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'wizard' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ Guided AI Wizard
          </button>
        </div>
        <button
          onClick={handleClean}
          className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer mr-1"
        >
          🧹 Clean Studio
        </button>
      </div>

      <InstantPostView onBack={dummyBack} />
    </div>
  );
};
