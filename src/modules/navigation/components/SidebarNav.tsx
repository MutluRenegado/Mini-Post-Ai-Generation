'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/context/AuthContext';
import {
  Zap,
  Sparkles,
  CalendarDays,
  Home,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Share2,
  Wand2,
  LayoutGrid,
  Palette,
  FolderKanban,
  BarChart3,
  Users,
  ShieldAlert,
  Settings,
  HelpCircle,
  Bell,
  ChevronDown,
  Globe,
  Layers,
  Send,
  Video,
  Tv,
  MessageSquare,
  Film,
  Compass,
  CheckCircle2,
  Terminal,
  Cpu,
  Code,
} from 'lucide-react';

interface SidebarNavProps {
  children?: React.ReactNode;
}

function SidebarNavContent({ children }: SidebarNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTool = searchParams.get('tool');
  const currentPlatform = searchParams.get('platform');
  const currentTab = searchParams.get('tab');
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState<string>('dashboard-overview');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    dashboard: true,
    platforms: true,
    facebookSub: false,
    wizards: true,
    canvases: true,
    platformStudios: true,
    studioWorkflows: true,
    brandContent: true,
    pricing: true,
    admin: false,
    settings: false,
    support: false,
  });

  useEffect(() => {
    if (pathname === '/dashboard') {
      if (currentTab === 'account') setActiveView('dashboard-account');
      else if (currentTab === 'activity') setActiveView('dashboard-activity');
      else if (currentTab === 'todo') setActiveView('dashboard-todo');
      else if (currentTab === 'payments') setActiveView('dashboard-payments');
      else setActiveView('dashboard-overview');
    } else if (pathname === '/dashboard/fast-post') {
      setActiveView('7-pipeline-studio');
      setIsCollapsed(true);
    } else if (pathname === '/subscribe') {
      setActiveView('pricing-view');
    } else if (pathname === '/studio') {
      if (currentTool === 'wizard') setActiveView('ai-creator-wizard');
      else if (currentTool === 'instant') setActiveView('instant-post-creator');
      else if (currentTool === 'templates') setActiveView('template-manager-studio');
      else if (currentTool === 'brand') setActiveView('brand-kit');
      else if (currentTool === 'assets') setActiveView('asset-library');
      else if (currentTool === 'calendar') setActiveView('content-calendar');
      else if (currentTool === 'analytics') setActiveView('studio-analytics');
      else if (currentTool === 'publishing') setActiveView('publishing-dispatch-studio');
      else if (currentTool === 'facebook') setActiveView('facebook-studio');
      else if (currentTool === 'instagram') setActiveView('instagram-studio');
      else if (currentTool === 'tiktok') setActiveView('tiktok-studio');
      else if (currentTool === 'twitter') setActiveView('twitter-studio');
      else if (currentTool === 'youtube-shorts') setActiveView('youtube-shorts-studio');
      else if (currentTool === 'youtube-classic') setActiveView('youtube-classic-studio');
      else if (currentTool === 'threads') setActiveView('threads-studio');
      else if (currentTool === 'linkedin') setActiveView('linkedin-studio');
      else if (currentTool === 'googlebusiness') setActiveView('googlebusiness-studio');
      else if (currentTool === 'bluesky') setActiveView('bluesky-studio');
      else if (currentTool === 'telegram') setActiveView('telegram-studio');
      else if (currentTool === 'pinterest') setActiveView('pinterest-studio');
      else if (currentTool === 'platforms') setActiveView('11-hub-studio');
      else if (currentTool === 'approval') setActiveView('approval-workflow');
      else if (currentTool === 'quality') setActiveView('quality-engine');
      else if (currentTool === 'prompts') setActiveView('prompt-manager');
      else if (currentTool === 'automation') setActiveView('automation-manager');
      else if (currentTool === 'team') {
        if (currentTab === 'roles') setActiveView('admin-roles');
        else if (currentTab === 'workspaces') setActiveView('admin-workspaces');
        else if (currentTab === 'permissions') setActiveView('admin-permissions');
        else setActiveView('admin-teams');
      }
      else if (currentTool === 'compliance') setActiveView('admin-compliance');
      else if (currentTool === 'settings') setActiveView('settings');
      else if (currentTool === 'support') setActiveView('support');
      else if (currentTool === 'notifications') setActiveView('notifications');
    }
  }, [pathname, currentTool, currentPlatform, currentTab]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleItemClick = (id: string, href: string) => {
    setActiveView(id);
    setIsMobileOpen(false);
    if (id === '7-pipeline-studio' || href === '/dashboard/fast-post') {
      setIsCollapsed(true);
    }
    router.push(href);
  };

  return (
    <div className="flex min-h-screen bg-[#0A0C10] text-slate-100 selection:bg-cyan-500 selection:text-black font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0F121C]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 h-14 flex items-center justify-between">
        <Link href="/" aria-label="Go to Mini Post App homepage" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs">
            MP
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">Mini Post App</span>
        </Link>
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Sidebar Wrapper */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0A0D16] border-r border-[#1A1F2C] transition-all duration-300 ease-in-out flex flex-col ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header Brand */}
        <div className="p-4 border-b border-[#1A1F2C] flex items-center justify-between">
          <Link href="/" aria-label="Go to Mini Post App homepage" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-cyan-500/20 shrink-0">
              MP
            </div>
            {!isCollapsed && (
              <div>
                <div className="font-black text-sm text-white tracking-tight leading-none">Mini Post App</div>
                <div className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase mt-0.5 font-bold">
                  GENERAL STUDIO SUITE
                </div>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl bg-[#121622] border border-[#1E2538] text-slate-400 hover:text-white transition"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation Menu (10 Categories) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
          {/* 1. DASHBOARD & SUB-ITEMS */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('dashboard')}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                {!isCollapsed && <span>Dashboard</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${openSections.dashboard ? 'rotate-180' : ''}`} />}
            </button>

            {(openSections.dashboard || isCollapsed) && (
              <div className="space-y-0.5">
                {[
                  { id: 'dashboard-overview', label: 'Overview', href: '/dashboard' },
                  { id: 'dashboard-account', label: 'Account Details', href: '/dashboard?tab=account' },
                  { id: 'dashboard-activity', label: 'Activity Details', href: '/dashboard?tab=activity' },
                  { id: 'dashboard-todo', label: 'To do Alerts', href: '/dashboard?tab=todo' },
                  { id: 'dashboard-payments', label: 'Incoming Payments', href: '/dashboard?tab=payments' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.id, item.href)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                      activeView === item.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    {!isCollapsed ? item.label : item.label.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. PLATFORMS & DETAILED SUB-ITEMS */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('platforms')}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                {!isCollapsed && <span>Platforms & Sub-items</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${openSections.platforms ? 'rotate-180' : ''}`} />}
            </button>

            {(openSections.platforms || isCollapsed) && (
              <div className="space-y-0.5">
                {[
                  { id: 'facebook-studio', name: 'Facebook Studio', href: '/studio?tool=facebook' },
                  { id: 'twitter-studio', name: 'Twitter (X) AI Creator', href: '/studio?tool=twitter' },
                  { id: 'linkedin-studio', name: 'LinkedIn AI Studio', href: '/studio?tool=linkedin' },
                  { id: 'instagram-studio', name: 'Instagram AI Studio', href: '/studio?tool=instagram' },
                  { id: 'tiktok-studio', name: 'TikTok AI Studio', href: '/studio?tool=tiktok' },
                  { id: 'threads-studio', name: 'Threads AI Studio', href: '/studio?tool=threads' },
                  { id: 'youtube-shorts-studio', name: 'YouTube Shorts Studio', href: '/studio?tool=youtube-shorts' },
                  { id: 'youtube-classic-studio', name: 'YouTube Classic Studio', href: '/studio?tool=youtube-classic' },
                  { id: 'googlebusiness-studio', name: 'Google Business Studio', href: '/studio?tool=googlebusiness' },
                  { id: 'bluesky-studio', name: 'Bluesky AI Studio', href: '/studio?tool=bluesky' },
                  { id: 'telegram-studio', name: 'Telegram Broadcast Studio', href: '/studio?tool=telegram' },
                  { id: 'pinterest-studio', name: 'Pinterest AI Pin Studio', href: '/studio?tool=pinterest' },
                ].map((plat) => (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => handleItemClick(plat.id, plat.href)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition border cursor-pointer ${
                      activeView === plat.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border-cyan-500/40 shadow-sm'
                        : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    {!isCollapsed ? plat.name : plat.name.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. POST CREATION WIZARDS & EXPRESS GENERATORS */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('wizards')}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                {!isCollapsed && <span>Post Creation Wizards</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${openSections.wizards ? 'rotate-180' : ''}`} />}
            </button>

            {(openSections.wizards || isCollapsed) && (
              <div className="space-y-0.5">
                {[
                  { id: 'ai-creator-wizard', label: 'Guided AI Wizard', href: '/studio?tool=wizard' },
                  { id: 'instant-post-creator', label: 'Fast Post Express / Instant Creator', href: '/studio?tool=instant' },
                ].map((wiz) => (
                  <button
                    key={wiz.id}
                    type="button"
                    onClick={() => handleItemClick(wiz.id, wiz.href)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition ${
                      activeView === wiz.id ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {!isCollapsed ? wiz.label : wiz.label.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. PRODUCTION CREATION STUDIOS & CANVASES */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('canvases')}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                {!isCollapsed && <span>Production Canvases</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${openSections.canvases ? 'rotate-180' : ''}`} />}
            </button>

            {(openSections.canvases || isCollapsed) && (
              <div className="space-y-0.5">
                {[
                  { id: '7-pipeline-studio', label: '7-Step Pipeline Creator Studio', href: '/dashboard/fast-post' },
                  { id: 'multi-platform-canvas', label: 'Multi-Platform Studio Canvas', href: '/dashboard' },
                  { id: 'template-manager-studio', label: 'Template Manager Studio', href: '/studio?tool=templates' },
                ].map((canv) => (
                  <button
                    key={canv.id}
                    type="button"
                    onClick={() => handleItemClick(canv.id, canv.href)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition ${
                      activeView === canv.id ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {!isCollapsed ? canv.label : canv.label.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. PLATFORM-SPECIFIC & DISPATCH STUDIOS */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('platformStudios')}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                {!isCollapsed && <span>Platform & Dispatch Studios</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${openSections.platformStudios ? 'rotate-180' : ''}`} />}
            </button>

            {(openSections.platformStudios || isCollapsed) && (
              <div className="space-y-0.5">
                {[
                  { id: '11-hub-studio', label: '11 Multi-Platform Integration Hub', href: '/studio?tool=platforms' },
                  { id: 'publishing-dispatch-studio', label: 'Publishing & Dispatch Studio', href: '/studio?tool=publishing' },
                ].map((ps) => (
                  <button
                    key={ps.id}
                    type="button"
                    onClick={() => handleItemClick(ps.id, ps.href)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition ${
                      activeView === ps.id ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {!isCollapsed ? ps.label : ps.label.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5B. STUDIO ENGINE & WORKFLOWS */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('studioWorkflows')}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {!isCollapsed && <span>Studio Engine & Workflows</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${openSections.studioWorkflows ? 'rotate-180' : ''}`} />}
            </button>

            {(openSections.studioWorkflows || isCollapsed) && (
              <div className="space-y-0.5">
                {[
                  { id: 'approval-workflow', label: 'Approval Workflow (7-State Lifecycle)', href: '/studio?tool=approval' },
                  { id: 'quality-engine', label: 'Quality & Standards Engine', href: '/studio?tool=quality' },
                  { id: 'prompt-manager', label: 'AI Prompt Manager', href: '/studio?tool=prompts' },
                  { id: 'automation-manager', label: 'Automation & Autopilot Manager', href: '/studio?tool=automation' },
                ].map((wf) => (
                  <button
                    key={wf.id}
                    type="button"
                    onClick={() => handleItemClick(wf.id, wf.href)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition ${
                      activeView === wf.id ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {!isCollapsed ? wf.label : wf.label.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 6. BRAND & CONTENT MANAGEMENT */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('brandContent')}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-pink-400" />
                {!isCollapsed && <span>Brand & Content</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${openSections.brandContent ? 'rotate-180' : ''}`} />}
            </button>

            {(openSections.brandContent || isCollapsed) && (
              <div className="space-y-0.5">
                {[
                  { id: 'brand-kit', label: 'Brand Kit', href: '/studio?tool=brand' },
                  { id: 'asset-library', label: 'Asset Library', href: '/studio?tool=assets' },
                  { id: 'content-calendar', label: 'Content Calendar', href: '/studio?tool=calendar' },
                  { id: 'studio-analytics', label: 'Studio Analytics', href: '/studio?tool=analytics' },
                ].map((bm) => (
                  <button
                    key={bm.id}
                    type="button"
                    onClick={() => handleItemClick(bm.id, bm.href)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition ${
                      activeView === bm.id ? 'bg-pink-500/20 text-pink-300 font-bold border border-pink-500/40' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {!isCollapsed ? bm.label : bm.label.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 7. PRICING & SUBSCRIPTION */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('pricing')}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                {!isCollapsed && <span>Pricing & Subscription</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${openSections.pricing ? 'rotate-180' : ''}`} />}
            </button>

            {(openSections.pricing || isCollapsed) && (
              <div className="space-y-0.5">
                {[
                  { id: 'pricing-view', label: 'Pricing (Stripe)', href: '/subscribe' },
                  { id: 'subscription-view', label: 'Subscription Tiers', href: '/subscribe' },
                ].map((pr) => (
                  <button
                    key={pr.id}
                    type="button"
                    onClick={() => handleItemClick(pr.id, pr.href)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition ${
                      activeView === pr.id ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {!isCollapsed ? pr.label : pr.label.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 8. ADMINISTRATION */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('admin')}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-red-400" />
                {!isCollapsed && <span>Administration</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${openSections.admin ? 'rotate-180' : ''}`} />}
            </button>

            {(openSections.admin || isCollapsed) && (
              <div className="space-y-0.5">
                {[
                  { id: 'admin-teams', label: 'Teams', href: '/studio?tool=team&tab=teams' },
                  { id: 'admin-compliance', label: 'Compliance Center', href: '/studio?tool=compliance' },
                  { id: 'admin-team-setup', label: 'Team Setup', href: '/studio?tool=team&tab=teams' },
                  { id: 'admin-roles', label: 'Role Builder', href: '/studio?tool=team&tab=roles' },
                  { id: 'admin-workspaces', label: 'Workspaces', href: '/studio?tool=team&tab=workspaces' },
                  { id: 'admin-permissions', label: 'Permissions', href: '/studio?tool=team&tab=permissions' },
                ].map((ad) => (
                  <button
                    key={ad.id}
                    type="button"
                    onClick={() => handleItemClick(ad.id, ad.href)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition ${
                      activeView === ad.id ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {!isCollapsed ? ad.label : ad.label.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 9. SETTINGS */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('settings')}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                {!isCollapsed && <span>Settings</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${openSections.settings ? 'rotate-180' : ''}`} />}
            </button>

            {(openSections.settings || isCollapsed) && (
              <div className="space-y-0.5">
                {[
                  { label: 'Account', href: '/studio?tool=settings', id: 'settings-account' },
                  { label: 'Billing', href: '/studio?tool=settings', id: 'settings-billing' },
                  { label: 'Integration Setup', href: '/studio?tool=settings', id: 'settings-integrations' },
                  { label: 'Widget Config', href: '/studio?tool=settings', id: 'settings-widgets' },
                  { label: 'Security', href: '/studio?tool=settings', id: 'settings-security' },
                  { label: '🛠️ Developer Workspace 2.0', href: '/dev-workspace', id: 'dev-workspace' },
                ].map((set, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleItemClick(set.id, set.href)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition cursor-pointer font-semibold ${
                      activeView === set.id || (set.id === 'dev-workspace' && pathname === '/dev-workspace')
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    {!isCollapsed ? set.label : set.label.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 10. SUPPORT & NOTIFICATIONS */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection('support')}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                {!isCollapsed && <span>Support & Alerts</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${openSections.support ? 'rotate-180' : ''}`} />}
            </button>

            {(openSections.support || isCollapsed) && (
              <div className="space-y-0.5">
                {[
                  { id: 'support', label: 'Support Tickets', href: '/studio?tool=support' },
                  { id: 'notifications', label: 'Notifications Feed', href: '/studio?tool=notifications' },
                ].map((sup) => (
                  <button
                    key={sup.id}
                    type="button"
                    onClick={() => handleItemClick(sup.id, sup.href)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition ${
                      activeView === sup.id ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {!isCollapsed ? sup.label : sup.label.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer User Badge */}
        <div className="p-3 border-t border-[#1A1F2C] bg-[#0A0D16]">
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-[#0F131E] border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                {user?.email?.slice(0, 2).toUpperCase() || 'EX'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{user?.email || 'Executive User'}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Pro Active Seat</div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                onClick={() => logout()}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Page Body Content Container */}
      <main
        className={`flex-1 transition-all duration-300 pt-14 lg:pt-0 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export function SidebarNav({ children }: SidebarNavProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0C10] p-6 text-slate-400 font-mono text-sm">Loading Navigation Engine...</div>}>
      <SidebarNavContent>{children}</SidebarNavContent>
    </Suspense>
  );
}

export default SidebarNav;
