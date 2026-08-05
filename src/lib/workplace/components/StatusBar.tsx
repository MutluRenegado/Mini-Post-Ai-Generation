'use client';

import React from 'react';
import { Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export function StatusBar() {
  const { activeModule, activeTool, layoutState } = useWorkspace();

  return (
    <footer className="h-7 bg-[#090C14] border-t border-[#1C2234] px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <Cpu className="w-3 h-3" />
          <span>{activeModule?.name || 'Workplace Ready'}</span>
        </div>

        {activeTool && (
          <div className="flex items-center gap-1 text-slate-400">
            <span>Tool:</span>
            <span className="text-slate-200 font-bold">{activeTool.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="w-3 h-3" />
          <span>Persistence Saved</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-slate-500">
          <ShieldCheck className="w-3 h-3 text-indigo-400" />
          <span>Left: {layoutState.leftPanelOpen ? `${layoutState.leftPanelWidth}px` : 'Closed'}</span>
          <span>|</span>
          <span>Right: {layoutState.rightPanelOpen ? `${layoutState.rightPanelWidth}px` : 'Closed'}</span>
        </div>
      </div>
    </footer>
  );
}
