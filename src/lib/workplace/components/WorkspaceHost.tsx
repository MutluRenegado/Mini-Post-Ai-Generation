'use client';

import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';

export function WorkspaceHost() {
  const { activeModule, activeTool } = useWorkspace();

  if (!activeModule) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#07090E] text-slate-500 font-mono text-sm">
        No workplace module active. Select a module from the command bar.
      </div>
    );
  }

  const WorkspaceComponent = activeModule.workspaceComponent;

  return (
    <main className="flex-1 bg-[#07090E] overflow-auto relative flex flex-col">
      <WorkspaceComponent activeToolId={activeTool?.id} />
    </main>
  );
}
