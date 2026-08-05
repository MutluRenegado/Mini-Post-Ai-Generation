'use client';

import React from 'react';
import {
  Sparkles,
  Wand2,
  Zap,
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
  Image as ImageIcon,
} from 'lucide-react';
import { ImageLibraryPage } from '@/modules/image-library';
import { WorkplaceModuleConfig } from '@/lib/workplace';
import { CreatorWizardView } from '../wizard/CreatorWizardView';
import { InstantPostView } from '../ai/InstantPostView';
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

import { useSearchParams } from 'next/navigation';
import { FacebookPlatformView } from '../platforms/facebook/FacebookPlatformView';
import { InstagramStudioView } from '../platforms/instagram/InstagramStudioView';
import { TikTokStudioView } from '../platforms/tiktok/TikTokStudioView';
import { TwitterStudioView } from '../platforms/twitter/TwitterStudioView';
import { YouTubeShortsStudioView } from '../platforms/youtube/YouTubeShortsStudioView';
import { YouTubeClassicStudioView } from '../platforms/youtube/YouTubeClassicStudioView';
import { ThreadsStudioView } from '../platforms/threads/ThreadsStudioView';
import { LinkedInStudioView } from '../platforms/linkedin/LinkedInStudioView';
import { GoogleBusinessStudioView } from '../platforms/googlebusiness/GoogleBusinessStudioView';
import { BlueskyStudioView } from '../platforms/bluesky/BlueskyStudioView';
import { TelegramStudioView } from '../platforms/telegram/TelegramStudioView';
import { PinterestStudioView } from '../platforms/pinterest/PinterestStudioView';
import { PlatformsHubView } from '../platforms/PlatformsHubView';
import { TeamManagementView } from '../admin/TeamManagementView';
import { ComplianceCenterView } from '../admin/ComplianceCenterView';
import { SupportNotificationsView } from '../support/SupportNotificationsView';
import { Share2 } from 'lucide-react';

import { useStudioAssistant } from '../assistant/StudioAssistantContext';

function MiniPostWorkspaceHost({ activeToolId }: { activeToolId?: string }) {
  const searchParams = useSearchParams();
  const platformParam = searchParams.get('platform') || 'facebook';
  const tabParam = searchParams.get('tab') as any;
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
    case 'facebook':
      return <FacebookPlatformView onBack={dummyBack} />;
    case 'instagram':
      return <InstagramStudioView onBack={dummyBack} />;
    case 'tiktok':
      return <TikTokStudioView onBack={dummyBack} />;
    case 'twitter':
      return <TwitterStudioView onBack={dummyBack} />;
    case 'youtube-shorts':
      return <YouTubeShortsStudioView onBack={dummyBack} />;
    case 'youtube-classic':
      return <YouTubeClassicStudioView onBack={dummyBack} />;
    case 'threads':
      return <ThreadsStudioView onBack={dummyBack} />;
    case 'linkedin':
      return <LinkedInStudioView onBack={dummyBack} />;
    case 'googlebusiness':
      return <GoogleBusinessStudioView onBack={dummyBack} />;
    case 'bluesky':
      return <BlueskyStudioView onBack={dummyBack} />;
    case 'telegram':
      return <TelegramStudioView onBack={dummyBack} />;
    case 'pinterest':
      return <PinterestStudioView onBack={dummyBack} />;
    case 'platforms':
      return <PlatformsHubView onBack={dummyBack} initialPlatformId={platformParam} />;
    case 'admin':
    case 'team':
      return <TeamManagementView onBack={dummyBack} initialTab={tabParam || 'teams'} />;
    case 'compliance':
      return <ComplianceCenterView />;
    case 'support':
      return <SupportNotificationsView initialTab="support" />;
    case 'notifications':
      return <SupportNotificationsView initialTab="notifications" />;
    case 'approval':
      return <ApprovalWorkflowView onBack={dummyBack} />;
    case 'quality':
      return <QualityStudioView onBack={dummyBack} />;
    case 'prompts':
      return <PromptManagerView onBack={dummyBack} />;
    case 'automation':
      return <AutomationStudioView onBack={dummyBack} />;
    case 'image-library':
      return <ImageLibraryPage />;
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
    { id: 'instant', name: 'Instant Post Creator', icon: Zap, shortcut: 'I', description: 'Bypass wizard, generate instantly' },
    { id: 'templates', name: 'Template Manager', icon: LayoutGrid, shortcut: 'T', description: '12 layout categories' },
    { id: 'brand', name: 'Brand Kit', icon: Palette, shortcut: 'B', description: 'Logos, colors & fonts' },
    { id: 'assets', name: 'Asset Library', icon: FolderKanban, shortcut: 'A', description: 'Cloud media storage' },
    { id: 'calendar', name: 'Content Calendar', icon: CalendarDays, shortcut: 'C', description: 'Scheduling & optimal posting' },
    { id: 'analytics', name: 'Studio Analytics', icon: BarChart3, shortcut: 'N', description: 'Reach & engagement metrics' },
    { id: 'publishing', name: 'Publishing Dispatch', icon: Send, shortcut: 'P', description: 'Multi-platform publisher' },
    { id: 'platforms', name: '11 Platforms Hub', icon: Share2, shortcut: 'H', description: 'Token status, format metrics & templates' },
    { id: 'facebook', name: 'Facebook Platform Studio', icon: Share2, shortcut: 'F', description: 'Meta Graph API token & format metrics' },
    { id: 'approval', name: 'Approval Workflow', icon: CheckCircle2, shortcut: 'V', description: '7-state post lifecycle' },
    { id: 'quality', name: 'Quality Engine', icon: ShieldCheck, shortcut: 'Q', description: 'Standards & readability audit' },
    { id: 'prompts', name: 'Prompt Manager', icon: Terminal, shortcut: 'M', description: 'System prompt repository' },
    { id: 'automation', name: 'Automation Manager', icon: Cpu, shortcut: 'U', description: 'Campaign & cron triggers' },
    { id: 'image-library', name: 'Image Visual Library', icon: ImageIcon, shortcut: 'L', description: 'Visual Intelligence Reference Photo Repository' },
    { id: 'settings', name: 'Studio Settings', icon: Settings, shortcut: 'S', description: 'System & API preferences' },
  ],
  workspaceComponent: MiniPostWorkspaceHost,
  inspectorComponent: MiniPostInspectorHost,
};


