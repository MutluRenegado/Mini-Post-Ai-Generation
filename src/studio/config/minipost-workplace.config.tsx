'use client';

import React from 'react';
import {
  Sparkles,
  Wand2,
  LayoutGrid,
  Palette,
  FolderKanban,
  CalendarDays,
  BarChart3,
  Send,
  CheckCircle2,
  ShieldCheck,
  Terminal,
  Cpu,
  Settings,
} from 'lucide-react';
import { WorkplaceModuleConfig } from '@/lib/workplace';
import { CreatorWizardView } from '../wizard/CreatorWizardView';
import { TemplateGalleryView } from '../templates/TemplateGalleryView';
import { BrandKitView } from '../brand/BrandKitView';
import { AssetLibraryView } from '../assets/AssetLibraryView';
import { StudioCalendarView } from '../calendar/StudioCalendarView';
import { StudioAnalyticsView } from '../analytics/StudioAnalyticsView';
import { PublishingStudioView } from '../shipping/PublishingStudioView';
import { ApprovalWorkflowView } from '../approval/ApprovalWorkflowView';
import { QualityStudioView } from '../quality/QualityStudioView';
import { PromptManagerView } from '../prompts/PromptManagerView';
import { AutomationStudioView } from '../automation/AutomationStudioView';
import { SettingsStudioView } from '../shared/SettingsStudioView';

import { InstantPostView } from '../ai/InstantPostView';
import { useStudioAssistant } from '../assistant/StudioAssistantContext';

function MiniPostWorkspaceHost({ activeToolId }: { activeToolId?: string }) {
  const dummyBack = () => {};
  const assistant = useStudioAssistant();
  const prevToolRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (activeToolId === 'wizard' && prevToolRef.current !== 'wizard') {
      assistant.openAssistant('wizard');
    }
    prevToolRef.current = activeToolId;
  }, [activeToolId]);

  switch (activeToolId) {
    case 'wizard':
    case 'instant':
      return <InstantPostView onBack={dummyBack} />;
    case 'templates':
      return <TemplateGalleryView onBack={dummyBack} />;
    case 'brand':
      return <BrandKitView onBack={dummyBack} />;
    case 'assets':
      return <AssetLibraryView onBack={dummyBack} />;
    case 'calendar':
      return <StudioCalendarView onBack={dummyBack} />;
    case 'analytics':
      return <StudioAnalyticsView onBack={dummyBack} />;
    case 'publishing':
      return <PublishingStudioView onBack={dummyBack} />;
    case 'approval':
      return <ApprovalWorkflowView onBack={dummyBack} />;
    case 'quality':
      return <QualityStudioView onBack={dummyBack} />;
    case 'prompts':
      return <PromptManagerView onBack={dummyBack} />;
    case 'automation':
      return <AutomationStudioView onBack={dummyBack} />;
    case 'settings':
      return <SettingsStudioView onBack={dummyBack} />;
    default:
      return <InstantPostView onBack={dummyBack} />;
  }
}

function MiniPostInspectorHost({ activeToolId }: { activeToolId?: string }) {
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Active Tool: {activeToolId || 'Instant'}
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Configured for MiniPostStudio AI Content Creation Studio.
        </p>
      </div>

      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-[11px] font-mono text-slate-400">
        <div className="text-slate-300 font-bold mb-1">Module Info:</div>
        <div>• Platform: Next.js App Router</div>
        <div>• Engine: Standards Auditor v1.0</div>
        <div>• Security: FireStore & PostProxy Auth</div>
      </div>
    </div>
  );
}

export const miniPostStudioModuleConfig: WorkplaceModuleConfig = {
  id: 'minipost-studio',
  name: 'MiniPostStudio',
  subtitle: 'AI Content Creation Studio',
  version: '1.0.0',
  icon: Sparkles,
  defaultToolId: 'instant',
  tools: [
    { id: 'wizard', name: 'AI Creator Wizard', icon: Wand2, shortcut: 'W', description: 'Step-by-step AI content generation' },
    { id: 'templates', name: 'Template Manager', icon: LayoutGrid, shortcut: 'T', description: '12 layout categories' },
    { id: 'brand', name: 'Brand Kit', icon: Palette, shortcut: 'B', description: 'Logos, colors & fonts' },
    { id: 'assets', name: 'Asset Library', icon: FolderKanban, shortcut: 'A', description: 'Cloud media storage' },
    { id: 'calendar', name: 'Content Calendar', icon: CalendarDays, shortcut: 'C', description: 'Scheduling & optimal posting' },
    { id: 'analytics', name: 'Studio Analytics', icon: BarChart3, shortcut: 'N', description: 'Reach & engagement metrics' },
    { id: 'publishing', name: 'Publishing Dispatch', icon: Send, shortcut: 'P', description: 'Multi-platform publisher' },
    { id: 'approval', name: 'Approval Workflow', icon: CheckCircle2, shortcut: 'V', description: '7-state post lifecycle' },
    { id: 'quality', name: 'Quality Engine', icon: ShieldCheck, shortcut: 'Q', description: 'Standards & readability audit' },
    { id: 'prompts', name: 'Prompt Manager', icon: Terminal, shortcut: 'M', description: 'System prompt repository' },
    { id: 'automation', name: 'Automation Manager', icon: Cpu, shortcut: 'U', description: 'Campaign & cron triggers' },
    { id: 'settings', name: 'Studio Settings', icon: Settings, shortcut: 'S', description: 'System & API preferences' },
  ],
  workspaceComponent: MiniPostWorkspaceHost,
  inspectorComponent: MiniPostInspectorHost,
};
