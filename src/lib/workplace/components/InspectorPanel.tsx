'use client';

import React from 'react';
import { Sliders, Info, ShieldCheck } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export function InspectorPanel() {
  const { activeModule, activeTool, layoutState } = useWorkspace();

  if (!layoutState.rightPanelOpen || !activeModule) {
    return null;
  }

  const InspectorComponent = activeModule.inspectorComponent;

  return (
    <aside
      className="bg-[#0C0F17] border-l border-[#1C2234] flex flex-col justify-between select-none shrink-0 transition-all duration-200"
      style={{ width: `${layoutState.rightPanelWidth}px` }}
    >
      <div className="p-3 space-y-4 overflow-y-auto flex-1">
        {/* Header */}
        <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Inspector
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            {activeTool?.name || 'Properties'}
          </span>
        </div>

        {/* Custom Inspector Content or Generic Tool Metadata */}
        {InspectorComponent ? (
          <InspectorComponent activeToolId={activeTool?.id} />
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" /> Tool Context
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeTool?.description ||
                  `Inspecting options for active tool "${activeTool?.name || 'Default'}".`}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Environment Rules
              </div>
              <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                <div>• Auto-save persistence active</div>
                <div>• Zero breaking changes</div>
                <div>• Multi-platform geometry sync</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-2.5 border-t border-slate-800/80 bg-slate-950/40 text-[10px] text-slate-400 font-mono text-center">
        Docked Inspector Panel
      </div>
    </aside>
  );
}
