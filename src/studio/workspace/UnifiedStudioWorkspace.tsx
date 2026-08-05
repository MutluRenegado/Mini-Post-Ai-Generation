import React, { useState } from 'react';
import { CommandPalette } from '../shared/CommandPalette';
import { StudioButton, StudioCard } from '../theme/DesignSystem';
import { ProjectManagerView } from '../projects/ProjectManagerView';
import { PipelineInspector } from '../inspector/PipelineInspector';
import { KnowledgeStudioView } from '../knowledge/KnowledgeStudioView';
import { PromptStudioView } from '../prompts/PromptStudioView';
import { PublishingCenterView } from '../publishing/PublishingCenterView';
import { ExecutiveDashboard } from '../dashboard/ExecutiveDashboard';
import { StudioSettingsView } from '../settings/StudioSettingsView';
import { ExecutiveCommandCenter } from '../bos/ExecutiveCommandCenter';

export type WorkspaceSection =
  | 'home'
  | 'projects'
  | 'creator'
  | 'pipeline'
  | 'knowledge'
  | 'prompts'
  | 'publishing'
  | 'analytics'
  | 'settings';

export const UnifiedStudioWorkspace: React.FC = () => {
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('home');
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <ExecutiveCommandCenter />;
      case 'projects':
        return <ProjectManagerView />;
      case 'pipeline':
        return <PipelineInspector />;
      case 'knowledge':
        return <KnowledgeStudioView />;
      case 'prompts':
        return <PromptStudioView />;
      case 'publishing':
        return <PublishingCenterView />;
      case 'analytics':
        return <ExecutiveDashboard />;
      case 'settings':
        return <StudioSettingsView />;
      default:
        return <ExecutiveCommandCenter />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4">
        <div>
          {/* Logo & Workspace Title */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md">
              S
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-tight">StudioOS Unified</h1>
              <span className="text-[10px] text-cyan-400 font-mono">Enterprise AI Ecosystem</span>
            </div>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="w-full mt-4 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-lg text-xs flex justify-between items-center transition-all cursor-pointer"
          >
            <span>Search commands...</span>
            <kbd className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Ctrl+K</kbd>
          </button>

          {/* Nav Items */}
          <nav className="space-y-1 mt-6">
            {[
              { id: 'home', label: '🏠 Home Command Center' },
              { id: 'projects', label: '📁 Projects' },
              { id: 'pipeline', label: '🔍 Pipeline Inspector' },
              { id: 'knowledge', label: '🧠 Knowledge Studio' },
              { id: 'prompts', label: '📝 Prompt Studio' },
              { id: 'publishing', label: '🚀 Publishing Center' },
              { id: 'analytics', label: '📊 Analytics' },
              { id: 'settings', label: '⚙️ Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as WorkspaceSection)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* System Status Footer */}
        <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            OPERATIONAL
          </span>
          <span className="text-slate-500">v10.0</span>
        </div>
      </aside>

      {/* Main Workspace Content */}
      <main className="flex-1 bg-slate-950 overflow-y-auto p-8">
        <StudioCard className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">StudioOS Unified Workspace</h2>
              <p className="text-xs text-slate-400 mt-1">Autonomous Enterprise AI Creator Operating System</p>
            </div>
            <StudioButton variant="primary" onClick={() => setActiveSection('pipeline')}>
              + Open Pipeline Inspector
            </StudioButton>
          </div>
        </StudioCard>

        {/* Dynamic Studio View Renderer */}
        <div className="space-y-6">
          {renderSection()}
        </div>
      </main>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectAction={(action) => console.log('Action selected:', action)}
      />
    </div>
  );
};

