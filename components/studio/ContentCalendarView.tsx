'use client';

import React, { useState, useEffect } from 'react';

export interface ScheduledPost {
  id: string;
  title: string;
  platform: string;
  date: string;
  time: string;
  status: 'Queued' | 'Published' | 'Draft';
}

export default function ContentCalendarView() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<ScheduledPost[]>([
    { id: '1', title: 'Product Launch Announcement', platform: 'LinkedIn', date: '2026-08-01', time: '10:00 AM', status: 'Queued' },
    { id: '2', title: 'AI Automation Workflow Tips', platform: 'X / Twitter', date: '2026-08-02', time: '02:30 PM', status: 'Queued' },
    { id: '3', title: 'Behind the Scenes Reel', platform: 'Instagram', date: '2026-08-04', time: '09:00 AM', status: 'Draft' },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('LinkedIn');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    setMounted(true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setNewDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    const post: ScheduledPost = {
      id: Date.now().toString(),
      title: newTitle,
      platform: newPlatform,
      date: newDate,
      time: '12:00 PM',
      status: 'Queued',
    };

    setPosts([...posts, post]);
    setNewTitle('');
  };

  if (!mounted) {
    return <div className="p-6 max-w-5xl mx-auto text-slate-400 font-mono text-sm">Loading Content Calendar...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto text-slate-100 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            📅 Studio Content Calendar
          </h2>
          <p className="text-sm text-slate-400">
            Interactive monthly, weekly, and campaign timeline view with scheduling and optimal posting support.
          </p>
        </div>
        <span className="text-xs px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full font-medium">
          {posts.filter((p) => p.status === 'Queued').length} QUEUED POSTS
        </span>
      </div>

      <form onSubmit={handleSchedule} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <input
          type="text"
          placeholder="Post title or concept..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 sm:col-span-2"
        />
        <select
          value={newPlatform}
          onChange={(e) => setNewPlatform(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="LinkedIn">LinkedIn</option>
          <option value="X / Twitter">X / Twitter</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="TikTok">TikTok</option>
          <option value="YouTube">YouTube</option>
          <option value="Google Business">Google Business</option>
          <option value="Bluesky">Bluesky</option>
          <option value="Threads">Threads</option>
          <option value="Telegram">Telegram</option>
        </select>
        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl text-sm py-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition cursor-pointer"
        >
          + Schedule Post
        </button>
      </form>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl hover:border-slate-700 transition">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/20">
                📅
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{post.title}</h4>
                <p className="text-xs text-slate-400">{post.platform} • Scheduled for {post.date} at {post.time}</p>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${post.status === 'Queued' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-300'}`}>
              {post.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
