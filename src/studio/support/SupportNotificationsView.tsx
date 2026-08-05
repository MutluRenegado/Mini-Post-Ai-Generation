'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, Bell, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface SupportNotificationsViewProps {
  initialTab?: 'support' | 'notifications';
}

export function SupportNotificationsView({ initialTab = 'support' }: SupportNotificationsViewProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'support' | 'notifications'>(initialTab);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 3000);
  };

  if (!mounted) {
    return <div className="p-8 max-w-7xl mx-auto text-slate-400 font-mono text-sm animate-pulse">Loading Support & Notifications...</div>;
  }

  const notifications = [
    { id: '1', title: 'LinkedIn API Token Validated', time: '10 mins ago', type: 'system' },
    { id: '2', title: 'Scheduled Reel Dispatched to Instagram', time: '1 hour ago', type: 'dispatch' },
    { id: '3', title: 'Stripe Subscription Renewal Confirmed ($29)', time: 'Yesterday', type: 'billing' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      <div className="bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            <HelpCircle className="w-3.5 h-3.5" /> HELP DESK & NOTIFICATIONS
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight pt-1">Support & Notifications</h1>
          <p className="text-xs text-slate-400">Get technical support, view system health updates, and inspect dispatch notifications.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'support' ? 'bg-cyan-500 text-black shadow-md font-mono' : 'text-slate-400 hover:text-white'
            }`}
          >
            Support Ticket
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'notifications' ? 'bg-cyan-500 text-black shadow-md font-mono' : 'text-slate-400 hover:text-white'
            }`}
          >
            Notifications
          </button>
        </div>
      </div>

      {activeTab === 'support' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl max-w-2xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" /> Submit Priority Technical Ticket
          </h3>

          {submitted ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Support ticket submitted! A response will be sent to your account email within 2 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Ticket Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Meta Graph API token re-authentication question..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Issue Details</label>
                <textarea
                  rows={4}
                  placeholder="Describe your request..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Ticket
              </button>
            </form>
          )}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl max-w-2xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" /> Recent Live System Notifications
          </h3>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-white font-bold">{n.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SupportNotificationsView;
