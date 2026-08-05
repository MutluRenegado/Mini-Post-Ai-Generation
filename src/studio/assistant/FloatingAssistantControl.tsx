'use client';

import React, { useState } from 'react';
import {
  Wand2,
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Loader2,
  Trash2,
  CheckCheck,
  Sparkles,
  Minimize2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useStudioAssistant, StudioNotification } from './StudioAssistantContext';

export function FloatingAssistantControl() {
  const {
    isOpen,
    notifications,
    unreadCount,
    toggleAssistant,
    closeAssistant,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
  } = useStudioAssistant();

  const [isTransparent, setIsTransparent] = useState(false);

  const renderNotifIcon = (type: StudioNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'progress':
        return <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  const hasUnreadError = notifications.some((n) => !n.isRead && n.type === 'error');
  const hasUnreadWarning = notifications.some((n) => !n.isRead && n.type === 'warning');

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 select-none">
      {/* Compact Side Drawer */}
      {isOpen && (
        <div
          className={`fixed top-0 right-0 h-[100dvh] w-full max-w-[calc(100vw-1rem)] sm:max-w-[380px] md:max-w-[420px] border-l border-slate-800/80 shadow-2xl z-50 flex flex-col transition-all duration-200 animate-in slide-in-from-right ${
            isTransparent
              ? 'bg-[#0C0F17]/40 backdrop-blur-md border-cyan-500/20'
              : 'bg-[#0C0F17]/95 backdrop-blur-xl'
          }`}
        >
          {/* Drawer Header */}
          <div className="bg-[#0A0D15]/90 border-b border-slate-800 px-3.5 py-3 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Wand2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
                  AI Assistant
                  <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                </h3>
              </div>
            </div>

            {/* Action Buttons Near Top */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Return to Symbol Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeAssistant();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-200 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer text-[11px] font-semibold shadow-xs hover:border-cyan-500/40"
                title="Return to symbol icon (minimize panel to read behind)"
                aria-label="Return to symbol"
              >
                <Minimize2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-[11px] whitespace-nowrap">Return to symbol</span>
              </button>

              {/* Read Behind / Transparency Toggle */}
              <button
                type="button"
                onClick={() => setIsTransparent(!isTransparent)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isTransparent
                    ? 'text-cyan-400 bg-cyan-950/70 border-cyan-500/50'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 border-slate-800'
                }`}
                title={isTransparent ? 'Disable transparent view' : 'Make translucent to read behind panel'}
                aria-label="Toggle Transparency"
              >
                {isTransparent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeAssistant}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close Assistant"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
                <span>Assistant Activity ({notifications.length})</span>
              </div>

              {notifications.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark read
                  </button>
                  <button
                    type="button"
                    onClick={clearNotifications}
                    className="text-[10px] font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-400 font-medium">No active assistant alerts</p>
                <p className="text-[11px] text-slate-500">
                  Real-time suggestions and workflow notifications will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3 rounded-xl border transition-all relative group cursor-pointer ${
                      notif.isRead
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                        : 'bg-slate-900/90 border-cyan-500/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className="mt-0.5">{renderNotifIcon(notif.type)}</div>
                        <div className="space-y-1 min-w-0">
                          <h4 className={`text-xs font-bold truncate ${notif.isRead ? 'text-slate-300' : 'text-white'}`}>
                            {notif.title}
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notif.id);
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compact Assistant Trigger Button (Symbol Mode) */}
      <button
        type="button"
        onClick={() => toggleAssistant('wizard')}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border backdrop-blur-xl shadow-lg transition-all hover:scale-105 cursor-pointer ${
          hasUnreadError
            ? 'bg-rose-950/90 border-rose-500/60 text-white'
            : hasUnreadWarning
            ? 'bg-amber-950/90 border-amber-500/60 text-white'
            : 'bg-[#0C0F17]/95 border-slate-800 hover:border-cyan-500/50 text-white'
        }`}
        title="AI Assistant Symbol (Click to expand)"
      >
        <Wand2 className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold">AI Assistant</span>
        {unreadCount > 0 && (
          <span className="px-1.5 py-0.2 bg-cyan-500 text-slate-950 font-mono text-[10px] rounded-full font-black">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

