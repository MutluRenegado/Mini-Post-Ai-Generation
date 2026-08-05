'use client';

import React, { Suspense } from 'react';
import { SidebarNav } from '@/modules/navigation/components/SidebarNav';
import { DeveloperHubView } from '@/studio/workspace/DeveloperHubView';

export default function DevWorkspacePage() {
  return (
    <SidebarNav>
      <Suspense fallback={<div className="min-h-screen bg-[#07090E] p-8 text-slate-400 font-mono text-sm">Loading Developer Workspace...</div>}>
        <DeveloperHubView />
      </Suspense>
    </SidebarNav>
  );
}
