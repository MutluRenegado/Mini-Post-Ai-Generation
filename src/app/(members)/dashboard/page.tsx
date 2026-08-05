'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { MultiPlatformStudio } from '@/modules/posts/components/MultiPlatformStudio';
import { PostHistoryTable } from '@/modules/posts/components/PostHistoryTable';
import { ContentCalendarStudio } from '@/modules/posts/components/ContentCalendarStudio';
import { AccountDetailsWidget } from '@/modules/dashboard/components/AccountDetailsWidget';
import { ActivityDetailsWidget } from '@/modules/dashboard/components/ActivityDetailsWidget';
import { ToDoAlertsWidget } from '@/modules/dashboard/components/ToDoAlertsWidget';
import { IncomingPaymentsWidget } from '@/modules/dashboard/components/IncomingPaymentsWidget';
import { MultiPlatformStatusWidget } from '@/modules/dashboard/components/MultiPlatformStatusWidget';
import { QuickCreatorLauncherWidget } from '@/modules/dashboard/components/QuickCreatorLauncherWidget';
import {
  Layers,
  Sparkles,
  Zap,
  Activity,
  PlusCircle,
  Share2,
  BarChart3,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  Crown,
  Calendar,
  LayoutDashboard,
  CreditCard,
  Bell,
  User,
} from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [mounted, setMounted] = useState(false);
  const [profileGroupId, setProfileGroupId] = useState<string>('pg_loading...');
  const [userTier, setUserTier] = useState<'starter' | 'pro' | 'business'>('pro');
  const [dailyUsageCount, setDailyUsageCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'studio' | 'calendar' | 'history' | 'analytics'>('overview');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const dailyQuotaLimit = userTier === 'business' ? 50 : userTier === 'pro' ? 30 : 20;

  useEffect(() => {
    setMounted(true);
    if (user?.uid) {
      setProfileGroupId(`pg_${user.uid.slice(0, 10)}`);
    }
  }, [user]);

  const handlePostSaved = () => {
    setRefreshKey((prev) => prev + 1);
    setDailyUsageCount((prev) => Math.min(dailyQuotaLimit, prev + 1));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0A0C10] text-slate-400 font-mono text-sm p-8 animate-pulse">
        Loading Creator Studio Dashboard...
      </div>
    );
  }

  // Derive dynamic prominent title matching sidebar menu label
  const pageTitle =
    tabParam === 'account'
      ? 'Dashboard > Account Details'
      : tabParam === 'activity'
      ? 'Dashboard > Activity Details'
      : tabParam === 'todo'
      ? 'Dashboard > To do Alerts'
      : tabParam === 'payments'
      ? 'Dashboard > Incoming Payments'
      : 'Dashboard > Overview';

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. ORIENTATION ZONE - DYNAMIC PROMINENT PAGE TITLE HEADER */}
      <header className="bg-[#0c101d] border border-slate-800/90 border-t-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_8px_28px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-indigo-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 shrink-0 font-extrabold">
            <LayoutDashboard className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {pageTitle}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-extrabold uppercase tracking-widest">
                ACTIVE WORKSPACE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>Account: {user?.email || 'authenticated-user@minipost.app'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400/90">Tenant: {profileGroupId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto shrink-0">
          <Link
            href="/studio"
            className="px-4 py-2 bg-white hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md hover:shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Launch Express Studio</span>
          </Link>

          <Link
            href="/subscribe"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Pricing</span>
          </Link>
        </div>
      </header>

      {/* 2. TAB NAVIGATION BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar border-b border-slate-800/80">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview' && !tabParam
              ? 'bg-amber-500/10 border border-amber-500/40 text-amber-400 font-extrabold shadow-[inset_0_1px_1px_rgba(245,158,11,0.1)]'
              : 'bg-[#0c101d] text-slate-400 hover:text-white border border-slate-800/80'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('studio')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer btn-tactile ${
            activeTab === 'studio'
              ? 'bg-amber-500/10 border border-amber-500/40 text-amber-400 font-extrabold shadow-[inset_0_1px_1px_rgba(245,158,11,0.1)]'
              : 'bg-[#0c101d] text-slate-400 hover:text-white border border-slate-800/80'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>New Multi-Platform Post</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer btn-tactile ${
            activeTab === 'calendar'
              ? 'bg-amber-500/10 border border-amber-500/40 text-amber-400 font-extrabold shadow-[inset_0_1px_1px_rgba(245,158,11,0.1)]'
              : 'bg-[#0c101d] text-slate-400 hover:text-white border border-slate-800/80'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Content Calendar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer btn-tactile ${
            activeTab === 'history'
              ? 'bg-amber-500/10 border border-amber-500/40 text-amber-400 font-extrabold shadow-[inset_0_1px_1px_rgba(245,158,11,0.1)]'
              : 'bg-[#0c101d] text-slate-400 hover:text-white border border-slate-800/80'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Post History</span>
        </button>
      </div>

      {/* 3. MAIN WORKSPACE / TAB PARITY VIEWS */}
      <main>
        {/* Specific Submenu Views when ?tab= is passed */}
        {tabParam === 'account' && <AccountDetailsWidget />}
        {tabParam === 'activity' && <ActivityDetailsWidget />}
        {tabParam === 'todo' && <ToDoAlertsWidget />}
        {tabParam === 'payments' && <IncomingPaymentsWidget />}

        {/* Default Overview Grid */}
        {!tabParam && activeTab === 'overview' && (
          <div className="space-y-6">
            <QuickCreatorLauncherWidget />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AccountDetailsWidget />
              <ActivityDetailsWidget />
              <ToDoAlertsWidget />
              <IncomingPaymentsWidget />
            </div>
            <MultiPlatformStatusWidget />
          </div>
        )}

        {activeTab === 'studio' && (
          <MultiPlatformStudio onPostSaved={handlePostSaved} />
        )}

        {activeTab === 'calendar' && (
          <ContentCalendarStudio />
        )}

        {activeTab === 'history' && (
          <div className="bg-[#12151E] border border-[#1E2330] rounded-3xl p-6 shadow-2xl">
            <PostHistoryTable key={refreshKey} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function MembersDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0C10] p-8 text-slate-400 font-mono text-sm">Loading Dashboard Workspace...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
