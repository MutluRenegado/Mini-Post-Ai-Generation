'use client';

import React from 'react';
import { CommandBar } from './CommandBar';
import { WorkspaceHost } from './WorkspaceHost';
import { InspectorPanel } from './InspectorPanel';
import { StatusBar } from './StatusBar';
import { FloatingAssistantControl } from '@/studio/assistant/FloatingAssistantControl';

interface WorkplaceLayoutProps {
  onReturnToLauncher?: () => void;
  brandTitle?: string;
}

export function WorkplaceLayout({ onReturnToLauncher, brandTitle }: WorkplaceLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#07090E] text-slate-100 font-sans select-none">
      {/* Top Command Bar */}
      <CommandBar onReturnToLauncher={onReturnToLauncher} brandTitle={brandTitle} />

      {/* Main Workspace Area (WorkspaceHost + InspectorPanel) */}
      <div className="flex-1 flex overflow-hidden relative">
        <WorkspaceHost />
        <InspectorPanel />
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />

      {/* Floating Bottom-Left Assistant Control */}
      <FloatingAssistantControl />
    </div>
  );
}

