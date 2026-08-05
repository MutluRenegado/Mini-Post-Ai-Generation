'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  Plus,
  ArrowLeft,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  Sparkles,
  Zap,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { StudioCalendarService, ScheduledPostItem } from './calendar.service';

const ALL_PLATFORMS = [
  'Facebook',
  'Twitter (X)',
  'LinkedIn',
  'Instagram Feed',
  'Instagram Story',
  'YouTube',
  'TikTok',
  'Google Business',
  'Bluesky',
  'Threads',
  'Telegram',
];

interface StudioCalendarViewProps {
  onBack?: () => void;
}

export function StudioCalendarView({ onBack }: StudioCalendarViewProps) {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<ScheduledPostItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('LinkedIn');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newStatus, setNewStatus] = useState<'Queued' | 'Draft'>('Queued');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'timeline' | 'optimal'>('timeline');

  useEffect(() => {
    setMounted(true);
    setPosts(StudioCalendarService.getStoredPosts());
    // Default newDate to tomorrow in YYYY-MM-DD format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setNewDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    const updated = StudioCalendarService.schedulePost({
      title: newTitle.trim(),
      platform: newPlatform,
      date: newDate,
      time: newTime || '12:00 PM',
      status: newStatus,
      mediaPrompt: `AI generated visual promo card for ${newTitle.slice(0, 30)}`,
      hashtags: ['#MiniPostStudio', `#${newPlatform.replace(/[^a-zA-Z0-9]/g, '')}`],
    });

    setPosts(updated);
    setNewTitle('');
  };

  const handleStatusToggle = (id: string, currentStatus: ScheduledPostItem['status']) => {
    const nextStatus: ScheduledPostItem['status'] =
      currentStatus === 'Queued' ? 'Published' : currentStatus === 'Draft' ? 'Queued' : 'Draft';
    const updated = StudioCalendarService.updatePostStatus(id, nextStatus);
    setPosts(updated);
  };

  const handleDelete = (id: string) => {
    const updated = StudioCalendarService.deletePost(id);
    setPosts(updated);
  };

  const filteredPosts = posts.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const optimalTimes = StudioCalendarService.getOptimalPostTimes();

  if (!mounted) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-slate-400 font-mono text-sm animate-pulse">
        Loading Studio Content Calendar...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <CalendarDays className="w-3.5 h-3.5" /> SCHEDULING ENGINE
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight pt-1">📅 Studio Content Calendar</h1>
          <p className="text-xs text-slate-400">
            Interactive monthly, weekly, and campaign timeline view with multi-platform scheduling and optimal posting support.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'timeline'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scheduled Timeline ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('optimal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'optimal'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Optimal Times
          </button>
        </div>
      </div>

      {/* Quick Post Schedule Form */}
      <form
        onSubmit={handleSchedule}
        className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 backdrop-blur-md shadow-lg space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Quick Post Scheduler
          </span>
          <span className="text-[10px] font-mono text-slate-400 uppercase">11 PLATFORMS SUPPORTED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Post title or content concept..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 md:col-span-2"
          />

          <select
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            {ALL_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <input
            type="date"
            required
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="09:00 AM">09:00 AM (Optimal)</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="12:00 PM">12:00 PM (Lunch Break)</option>
              <option value="02:30 PM">02:30 PM</option>
              <option value="06:00 PM">06:00 PM (Evening Peak)</option>
              <option value="08:00 PM">08:00 PM</option>
            </select>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as 'Queued' | 'Draft')}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Queued">Status: Queued</option>
              <option value="Draft">Status: Draft</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Schedule Post
          </button>
        </div>
      </form>

      {/* Main View Area */}
      {activeTab === 'timeline' ? (
        <div className="space-y-4">
          {/* Status Filter Bar */}
          <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter:
            </div>
            <div className="flex items-center gap-1.5">
              {['all', 'queued', 'published', 'draft'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all border ${
                    statusFilter === st
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Timeline List */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-3">
              <CalendarDays className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">No scheduled posts found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => {
                const isQueued = post.status === 'Queued';
                const isPublished = post.status === 'Published';

                return (
                  <div
                    key={post.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition-all shadow-md gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold shrink-0 mt-0.5 sm:mt-0">
                        📅
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white leading-snug">{post.title}</h4>
                        </div>
                        <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                          <span className="text-cyan-400 font-bold">{post.platform}</span> • {post.date} at {post.time}
                        </p>
                        {post.mediaPrompt && (
                          <p className="text-[10px] text-slate-500 italic line-clamp-1">
                            Media Prompt: &quot;{post.mediaPrompt}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(post.id, post.status)}
                        className={`text-xs px-3 py-1 rounded-full font-bold transition-all border cursor-pointer ${
                          isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isQueued
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                        title="Click to toggle status"
                      >
                        {post.status}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-900/40 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Optimal Posting Times Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {optimalTimes.map((opt) => (
            <div
              key={opt.platform}
              className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 backdrop-blur-md shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 font-mono">{opt.platform}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {opt.engagement}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-black text-white">{opt.bestTime}</div>
                <div className="text-xs text-slate-400 font-mono">Best Day: {opt.day}</div>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed pt-1 border-t border-slate-800/80">
                AI engagement analysis based on global platform traffic and audience response data.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudioCalendarView;

