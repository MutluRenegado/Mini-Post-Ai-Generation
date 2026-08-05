'use client';

import React from 'react';
import {
  Sidebar,
  PanelRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

interface CommandBarProps {
  onReturnToLauncher?: () => void;
  brandTitle?: string;
}

export function CommandBar({
  onReturnToLauncher,
  brandTitle = 'Studio Workplace Framework',
}: CommandBarProps) {
  const {
    modules,
    activeModule,
    openModule,
    toggleLeftPanel,
    toggleRightPanel,
    layoutState,
    restoreWorkspace,
  } = useWorkspace();

  const registeredModules = Object.values(modules);

  return (
    <div className="h-12 bg-[#0A0D15] border-b border-[#1A1F2C] px-3 flex items-center justify-between gap-4 text-xs select-none">
      {/* Brand & App Launcher */}
      <div className="flex items-center gap-3 shrink-0">
        {onReturnToLauncher && (
          <button
            type="button"
            onClick={onReturnToLauncher}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-semibold"
            title="Return to Menu Launcher"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Launcher Menu</span>
          </button>
        )}

        <div className="font-mono font-bold text-slate-200 tracking-tight hidden sm:block">
          {brandTitle}
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-xl">
        {registeredModules.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModule?.id === mod.id;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => openModule(mod.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{mod.name}</span>
            </button>
          );
        })}
      </div>

      {/* Layout & Workspace Utility Toggles */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={toggleLeftPanel}
          className={`p-1.5 rounded-lg border transition-colors ${
            layoutState.leftPanelOpen
              ? 'bg-slate-800 border-slate-700 text-cyan-400'
              : 'text-slate-500 border-transparent hover:bg-slate-900 hover:text-slate-300'
          }`}
          title="Toggle Tool Shelf (Left Panel)"
        >
          <Sidebar className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleRightPanel}
          className={`p-1.5 rounded-lg border transition-colors ${
            layoutState.rightPanelOpen
              ? 'bg-slate-800 border-slate-700 text-cyan-400'
              : 'text-slate-500 border-transparent hover:bg-slate-900 hover:text-slate-300'
          }`}
          title="Toggle Inspector (Right Panel)"
        >
          <PanelRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={restoreWorkspace}
          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors ml-1"
          title="Reset Workspace Docking Layout"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
