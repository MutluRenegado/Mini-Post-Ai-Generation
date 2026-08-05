'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Target,
  FileText,
  Users,
  Share2,
  LayoutGrid,
  CalendarDays,
  Sparkles,
  Minimize2,
  Activity,
} from 'lucide-react';
import { WizardFormData } from '../types/wizard.types';

interface WizardSidebarProps {
  formData: WizardFormData;
}

export function WizardSidebar({ formData }: WizardSidebarProps) {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 100, y: 140 });
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Initialize position safely on client side
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const defaultX = Math.max(20, window.innerWidth - 340);
      const defaultY = 140;
      setPosition({ x: defaultX, y: defaultY });
    }
  }, []);

  // Viewport resize clamping
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      setPosition((prev) => {
        const maxX = Math.max(0, window.innerWidth - (cardRef.current?.offsetWidth || 300));
        const maxY = Math.max(0, window.innerHeight - (cardRef.current?.offsetHeight || 200));
        return {
          x: Math.min(Math.max(10, prev.x), maxX),
          y: Math.min(Math.max(10, prev.y), maxY),
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMounted]);

  // Smooth Drag Mouse Events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, a')) return;

    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = position.x;
    const initialY = position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newX = initialX + deltaX;
      let newY = initialY + deltaY;

      const cardWidth = cardRef.current?.offsetWidth || 300;
      const cardHeight = cardRef.current?.offsetHeight || 300;
      const maxX = Math.max(0, window.innerWidth - cardWidth);
      const maxY = Math.max(0, window.innerHeight - cardHeight);

      newX = Math.min(Math.max(0, newX), maxX);
      newY = Math.min(Math.max(0, newY), maxY);

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [position.x, position.y]);

  if (!isMounted) return null;

  return (
    <div
      ref={cardRef}
      id="liveSummaryPanel"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      aria-label="LIVE SUMMARY DIAGNOSTICS"
      role="dialog"
      aria-expanded={!isMinimized}
      className={`fixed z-50 select-none transition-all duration-200 ease-out ${
        isDragging ? 'opacity-90 scale-[1.01] cursor-grabbing' : ''
      } ${
        isMinimized
          ? 'w-14 h-14 rounded-full bg-[#0b0f19]/80 backdrop-blur-md border-2 border-[#00ff66] flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(0,255,102,0.35)] hover:shadow-[0_0_25px_rgba(0,255,102,0.6)] hover:scale-105 active:scale-95'
          : 'w-72 rounded-xl bg-[#0b0f19]/85 backdrop-blur-xl border border-[#00ff66]/40 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_15px_rgba(0,255,102,0.15)] p-3.5 text-[#00ff66] font-mono'
      }`}
      onMouseDown={isMinimized ? () => setIsMinimized(false) : undefined}
    >
      {isMinimized ? (
        <div className="relative flex items-center justify-center w-full h-full" title="Click to expand summary">
          <span className="w-3 h-3 rounded-full bg-[#00ff66] animate-ping absolute" />
          <Activity className="w-6 h-6 text-[#00ff66] z-10 drop-shadow-[0_0_8px_#00ff66]" />
        </div>
      ) : (
        <>
          {/* Header Bar */}
          <div
            onMouseDown={handleMouseDown}
            className="cursor-grab active:cursor-grabbing flex items-center justify-between pb-2 mb-2.5 border-b border-[#00ff66]/20 text-xs tracking-wider font-bold"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
              <span className="text-[11px] font-black text-[#00ff66] uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,255,102,0.5)]">
                LIVE SUMMARY
              </span>
            </div>

            <button
              id="togglePanelBtn"
              type="button"
              aria-label="Minimize Panel"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="text-[#00ff66] hover:text-white px-2 py-0.5 rounded bg-[#00ff66]/10 hover:bg-[#00ff66]/25 active:bg-[#00ff66]/40 transition text-[10px] flex items-center gap-1 border border-[#00ff66]/30 cursor-pointer"
            >
              <span>MIN</span>
              <Minimize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-2 text-[11px] font-mono max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
            {/* Status Block */}
            <div className="p-2 rounded-lg bg-black/50 border border-[#00ff66]/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#00ff66]/70 text-[9px] font-bold">STATUS:</span>
                <span className="text-[#00ff66] font-extrabold text-[10px] drop-shadow-[0_0_4px_#00ff66]">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#00ff66]/70 text-[9px] font-bold">ITEMS PROCESSED:</span>
                <span className="text-[#00ff66] font-extrabold text-[10px]">{formData.platforms.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#00ff66]/70 text-[9px] font-bold">LAST UPDATED:</span>
                <span className="text-[#00ff66]/80 text-[9px]">Just now</span>
              </div>
            </div>

            {/* Goal */}
            <div className="p-2 rounded-lg bg-black/40 border border-[#00ff66]/20 space-y-0.5 hover:border-[#00ff66]/40 transition-colors">
              <div className="text-[9px] text-[#00ff66]/70 flex items-center gap-1 font-bold">
                <Target className="w-3 h-3 text-[#00ff66]" /> GOAL
              </div>
              <div className="text-[#00ff66] font-bold tracking-tight truncate">{formData.postGoal}</div>
            </div>

            {/* Topic & CTA */}
            <div className="p-2 rounded-lg bg-black/40 border border-[#00ff66]/20 space-y-0.5 hover:border-[#00ff66]/40 transition-colors">
              <div className="text-[9px] text-[#00ff66]/70 flex items-center gap-1 font-bold">
                <FileText className="w-3 h-3 text-[#00ff66]" /> TOPIC & CTA
              </div>
              <div className="text-[#00ff66]/90 font-bold truncate">{formData.topic || 'NOT SET'}</div>
              <div className="text-[10px] text-[#00ff66]">CTA: {formData.callToAction}</div>
            </div>

            {/* Audience & Tone */}
            <div className="p-2 rounded-lg bg-black/40 border border-[#00ff66]/20 space-y-0.5 hover:border-[#00ff66]/40 transition-colors">
              <div className="text-[9px] text-[#00ff66]/70 flex items-center gap-1 font-bold">
                <Users className="w-3 h-3 text-[#00ff66]" /> AUDIENCE & TONE
              </div>
              <div className="text-[#00ff66]/90 truncate">{formData.targetAudience}</div>
              <div className="text-[10px] text-[#00ff66]">TONE: {formData.tone}</div>
            </div>

            {/* Platforms */}
            <div className="p-2 rounded-lg bg-black/40 border border-[#00ff66]/20 space-y-1 hover:border-[#00ff66]/40 transition-colors">
              <div className="text-[9px] text-[#00ff66]/70 flex items-center justify-between font-bold">
                <span className="flex items-center gap-1">
                  <Share2 className="w-3 h-3 text-[#00ff66]" /> PLATFORMS
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black border border-[#00ff66]/40 text-[#00ff66]">
                  {formData.platforms.length} ACTIVE
                </span>
              </div>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {formData.platforms.length > 0 ? (
                  formData.platforms.map((p) => (
                    <span
                      key={p}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-[#00ff66]/40 text-[#00ff66] font-bold"
                    >
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-[9px] text-[#00ff66]/50 italic">None selected</span>
                )}
              </div>
            </div>

            {/* Template & Brand */}
            <div className="p-2 rounded-lg bg-black/40 border border-[#00ff66]/20 space-y-0.5 hover:border-[#00ff66]/40 transition-colors">
              <div className="text-[9px] text-[#00ff66]/70 flex items-center gap-1 font-bold">
                <LayoutGrid className="w-3 h-3 text-[#00ff66]" /> TEMPLATE & BRAND
              </div>
              <div className="text-[#00ff66]/90 truncate">TMPL: {formData.templateId}</div>
              <div className="text-[10px] text-[#00ff66]">BRAND: {formData.brandId}</div>
            </div>

            {/* Schedule */}
            <div className="p-2 rounded-lg bg-black/40 border border-[#00ff66]/20 space-y-0.5 hover:border-[#00ff66]/40 transition-colors">
              <div className="text-[9px] text-[#00ff66]/70 flex items-center gap-1 font-bold">
                <CalendarDays className="w-3 h-3 text-[#00ff66]" /> SCHEDULE
              </div>
              <div className="text-[#00ff66] font-bold uppercase text-[11px]">
                {formData.publishMode}
              </div>
            </div>

            <div className="pt-1 text-[9px] text-[#00ff66]/60 text-center tracking-widest uppercase border-t border-[#00ff66]/20">
              [ DIGITAL GREEN HUD ]
            </div>
          </div>
        </>
      )}
    </div>
  );
}



