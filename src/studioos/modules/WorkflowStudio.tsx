'use client';

import React from 'react';
import { ApprovalWorkflowView } from '@/studio/approval/ApprovalWorkflowView';
import { AutomationStudioView } from '@/studio/automation/AutomationStudioView';

export const WorkflowStudio: React.FC = () => {
  const [tab, setTab] = React.useState<'approval' | 'automation'>('approval');
  const dummyBack = () => {};

  const handleClean = () => {
    setTab('approval');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('approval')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'approval' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ✅ Approval Workflow (7-State Lifecycle)
          </button>
          <button
            onClick={() => setTab('automation')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'automation' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Automation & Autopilot Manager
          </button>
        </div>
        <button
          onClick={handleClean}
          className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer mr-1"
        >
          🧹 Clean Studio
        </button>
      </div>

      {tab === 'approval' ? <ApprovalWorkflowView onBack={dummyBack} /> : <AutomationStudioView onBack={dummyBack} />}
    </div>
  );
};
