'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Lock,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Send,
  Eye,
  Filter,
} from 'lucide-react';
import { Post } from '@/modules/posts/types/post.types';

interface ContentCalendarStudioProps {
  posts?: Post[];
  onSelectPost?: (post: Post) => void;
  onCreateNewPost?: () => void;
}

export function ContentCalendarStudio({ posts = [], onSelectPost, onCreateNewPost }: ContentCalendarStudioProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // July 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = 31;
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Map posts into day slots
  const postsByDay: Record<number, Post[]> = {};
  posts.forEach((post, idx) => {
    const day = (idx % 28) + 1;
    if (!postsByDay[day]) postsByDay[day] = [];
    postsByDay[day].push(post);
  });

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  return (
    <div className="bg-[#0C0F19] border border-[#1C2132] rounded-3xl p-6 shadow-2xl space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1F2E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>30-Day Content Calendar & Shipping Grid</span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono">
                VISUAL QUEUE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Plan, schedule, and lock monthly social media releases
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#07090F] border border-[#1C2234] rounded-xl p-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-200 font-mono">{monthName}</span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/dashboard/fast-post"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </Link>
        </div>
      </div>

      {/* WEEKDAY HEADERS */}
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono uppercase tracking-widest text-slate-500 font-extrabold">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* 31-DAY CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dayPosts = postsByDay[day] || [];
          const isSelected = selectedDay === day;
          const hasLocked = dayPosts.some((p) => p.status === 'locked');

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`min-h-[100px] p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-[#141A2B] border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                  : 'bg-[#07090F] border-[#181D2B] hover:border-slate-700 hover:bg-[#0B0E17]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold ${
                    isSelected ? 'text-cyan-300 font-black' : 'text-slate-400'
                  }`}
                >
                  {day < 10 ? `0${day}` : day}
                </span>

                {hasLocked && (
                  <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" title="Locked Post Active">
                    <Lock className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* POST BADGES IN DAY SLOT */}
              <div className="space-y-1 my-1">
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectPost) onSelectPost(post);
                    }}
                    className={`p-1.5 rounded-lg border text-[10px] truncate font-semibold flex items-center gap-1 transition-all ${
                      post.status === 'locked'
                        ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                        : post.status === 'completed'
                        ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {post.status === 'locked' ? (
                      <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                    )}
                    <span className="truncate">{post.title || post.content.slice(0, 20)}</span>
                  </div>
                ))}
              </div>

              {/* DAY BOTTOM CAPACITY INDICATOR */}
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-600">
                <span>{dayPosts.length} Queued</span>
                <span className="group-hover:text-cyan-400 transition-colors">+ Add</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SELECTED DAY DETAIL DRAWER */}
      {selectedDay !== null && (
        <div className="p-4 bg-[#07090F] border border-cyan-500/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center">
              {selectedDay}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Selected Day: {currentDate.toLocaleString('default', { month: 'short' })} {selectedDay}, 2026
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                {postsByDay[selectedDay]?.length || 0} scheduled content release(s)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/fast-post"
              className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl transition-all"
            >
              + Create Post for Day {selectedDay}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
