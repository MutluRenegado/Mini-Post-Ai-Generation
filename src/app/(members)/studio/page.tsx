'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, Sparkles, LayoutGrid, Eye, UserCheck } from 'lucide-react';
import { StudioTab } from '@/studio/types/studio.types';
import { StudioDashboard } from '@/studio/dashboard/StudioDashboard';
import { WorkplaceShell, WorkplaceModuleConfig } from '@/lib/workplace';
import { miniPostStudioModuleConfig } from '@/studio/config/minipost-workplace-config';
import { CreatorWizardView } from '@/studio/wizard/CreatorWizardView';
import { InstantPostView } from '@/studio/ai/InstantPostView';

function StudioContent() {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get('tool');

  // Mode: 'customer' (default AI Wizard view) or 'admin' (Hidden Creator Studio execution layer view)
  const [appMode, setAppMode] = useState<'customer' | 'admin'>('customer');

  // Customer sub-view: 'express' (default Fast Post Creator workspace) or 'wizard'
  const [customerTab, setCustomerTab] = useState<'express' | 'wizard'>('express');

  // Admin sub-view: 'launcher' (Dashboard menu) or 'workplace' (Workplace IDE Shell)
  const [adminViewMode, setAdminViewMode] = useState<'launcher' | 'workplace'>('launcher');

  // Active module config for the Workplace Framework
  const [moduleConfig, setModuleConfig] = useState<WorkplaceModuleConfig>(
    miniPostStudioModuleConfig
  );

  useEffect(() => {
    if (toolParam) {
      setModuleConfig({
        ...miniPostStudioModuleConfig,
        defaultToolId: toolParam,
      });
    }
  }, [toolParam]);

  const handleLaunchAdminTool = (tab: StudioTab) => {
    setModuleConfig({
      ...miniPostStudioModuleConfig,
      defaultToolId: tab === 'dashboard' ? 'wizard' : tab,
    });
    setAdminViewMode('workplace');
  };

  const activeToolId = toolParam || 'instant';

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      <WorkplaceShell
        initialModules={[{ ...miniPostStudioModuleConfig, defaultToolId: activeToolId }]}
        defaultModuleId={miniPostStudioModuleConfig.id}
        brandTitle="Mini Post Studio Workspace"
      />
    </div>
  );

  // ==========================================
  // CUSTOMER MODE (Clean AI Creator Wizard)
  // ==========================================
  if (appMode === 'customer') {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
        {/* Customer Top Bar */}
        <header className="bg-[#0C0F17] border-b border-[#1C2234] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-cyan-500/20">
              M
            </div>
            <div>
              <div className="font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
                Fast Post Studio
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  AI WIZARD
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Customer Post Creator</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Express Generator vs Wizard Toggle */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setCustomerTab('wizard')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  customerTab === 'wizard'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Guided Wizard
              </button>
              <button
                type="button"
                onClick={() => setCustomerTab('express')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  customerTab === 'express'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Express Generator
              </button>
            </div>

            {/* Hidden Admin Mode Switcher */}
            <button
              type="button"
              onClick={() => setAppMode('admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 text-xs font-mono transition-colors"
              title="Switch to Internal Creator Studio Admin Mode"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Mode</span>
            </button>
          </div>
        </header>

        {/* Customer Main View */}
        <main className="flex-1">
          {customerTab === 'wizard' ? (
            <CreatorWizardView onBack={() => {}} />
          ) : (
            <InstantPostView onBack={() => setCustomerTab('wizard')} />
          )}
        </main>
      </div>
    );
  }

  // ==========================================
  // ADMINISTRATOR MODE (Hidden Creator Studio Engine)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      {/* Admin Mode Status Banner */}
      <div className="bg-purple-950/60 border-b border-purple-800/40 px-4 py-2 flex items-center justify-between text-xs text-purple-200 font-mono">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-purple-400" />
          <span className="font-bold">ADMINISTRATOR MODE:</span>
          <span>Accessing Hidden Creator Studio Production Engine & Internal Workflow Monitored Services</span>
        </div>

        <button
          type="button"
          onClick={() => setAppMode('customer')}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-900/60 border border-purple-700/50 text-purple-200 hover:text-white text-xs font-semibold transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Return to Customer Wizard View
        </button>
      </div>

      {adminViewMode === 'workplace' ? (
        <WorkplaceShell
          initialModules={[moduleConfig]}
          defaultModuleId={moduleConfig.id}
          onReturnToLauncher={() => setAdminViewMode('launcher')}
          brandTitle="Creator Studio Admin Execution Workspace"
        />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Admin Launcher Header */}
          <header className="bg-[#0C0F17] border-b border-[#1C2234] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-purple-500/20">
                CS
              </div>
              <div>
                <h1 className="font-black text-sm text-white tracking-tight">Creator Studio Engine Dashboard</h1>
                <p className="text-[10px] text-purple-400 font-mono">Internal Orchestration & Diagnostics</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleLaunchAdminTool('wizard')}
              className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold hover:bg-purple-500/30 transition-colors"
            >
              Open Studio Workplace IDE
            </button>
          </header>

          {/* Launcher Dashboard Grid */}
          <main className="flex-1">
            <StudioDashboard onSelectTab={handleLaunchAdminTool} />
          </main>
        </div>
      )}
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090E] text-slate-400 p-8 font-mono text-sm">Loading Studio...</div>}>
      <StudioContent />
    </Suspense>
  );
}

