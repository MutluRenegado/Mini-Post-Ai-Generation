'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Minimize2, Maximize2, Activity, Terminal, ShieldAlert } from 'lucide-react';

export interface DiagnosticsData {
  mode?: string;
  segments?: number;
  index?: number;
  wpm?: number;
  chunk?: number;
  isPlaying?: boolean;
  currentSegment?: string;
  [key: string]: any;
}

export interface FloatingDiagnosticsProps {
  /** Title displayed in the header */
  title?: string;
  /** Initial (x, y) coordinates relative to the viewport. If undefined, centers/positions automatically */
  initialPosition?: { x: number; y: number };
  /** Diagnostic data to display. Fallbacks to default reference data if omitted */
  data?: DiagnosticsData;
  /** Callback fired when minimization state changes */
  onToggleMinimize?: (isMinimized: boolean) => void;
  /** Optional custom CSS classes for top container */
  className?: string;
  /** Controls initial minimized state */
  defaultMinimized?: boolean;
}

export default function FloatingDiagnostics({
  title = 'READER DIAGNOSTICS',
  initialPosition,
  data = {
    mode: 'standard',
    segments: 47,
    index: 0,
    wpm: 120,
    chunk: 4,
    isPlaying: false,
    currentSegment: '# ORIONHQ ORCHESTRATOR - PROJECT CONTINUATION PROM...',
  },
  onToggleMinimize,
  className = '',
  defaultMinimized = false,
}: FloatingDiagnosticsProps) {
  // SSR-safe position state
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 100, y: 140 });
  const [isMinimized, setIsMinimized] = useState<boolean>(defaultMinimized);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Initialize position safely on client side
  useEffect(() => {
    setIsMounted(true);
    if (initialPosition) {
      setPosition(initialPosition);
    } else if (typeof window !== 'undefined') {
      const defaultX = Math.max(20, window.innerWidth - 360);
      const defaultY = 120;
      setPosition({ x: defaultX, y: defaultY });
    }
  }, [initialPosition]);

  // Keep window inside viewport bounds on resize
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      setPosition((prev) => {
        const maxX = Math.max(0, window.innerWidth - (cardRef.current?.offsetWidth || 320));
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

  // Drag handler
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Prevent drag trigger when clicking on interactive buttons or controls
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

      // Calculate new position
      let newX = initialX + deltaX;
      let newY = initialY + deltaY;

      // Viewport edge clamping
      const cardWidth = cardRef.current?.offsetWidth || 320;
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

  const toggleMinimize = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextState = !isMinimized;
    setIsMinimized(nextState);
    if (onToggleMinimize) {
      onToggleMinimize(nextState);
    }
  };

  if (!isMounted) return null;

  return (
    <div
      ref={cardRef}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      aria-label={title}
      role="dialog"
      aria-expanded={!isMinimized}
      className={`fixed z-50 select-none transition-all duration-200 ease-out ${
        isDragging ? 'opacity-90 scale-[1.01] cursor-grabbing' : ''
      } ${
        isMinimized
          ? 'w-14 h-14 rounded-full bg-[#0b0f19]/80 backdrop-blur-md border-2 border-[#00ff66] flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(0,255,102,0.35)] hover:shadow-[0_0_25px_rgba(0,255,102,0.6)] hover:scale-105 active:scale-95'
          : 'w-80 rounded-xl bg-[#0b0f19]/85 backdrop-blur-xl border border-[#00ff66]/40 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_15px_rgba(0,255,102,0.15)] p-4 text-[#00ff66] font-mono'
      } ${className}`}
      onMouseDown={isMinimized ? () => setIsMinimized(false) : undefined}
    >
      {isMinimized ? (
        <div className="relative flex items-center justify-center w-full h-full" title="Click to expand diagnostics">
          <span className="w-3 h-3 rounded-full bg-[#00ff66] animate-ping absolute" />
          <Activity className="w-6 h-6 text-[#00ff66] z-10 drop-shadow-[0_0_8px_#00ff66]" />
        </div>
      ) : (
        <>
          {/* Header Bar */}
          <div
            onMouseDown={handleMouseDown}
            className="cursor-grab active:cursor-grabbing flex items-center justify-between pb-2 mb-3 border-b border-[#00ff66]/20 text-xs tracking-wider font-bold group"
          >
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
              <span className="drop-shadow-[0_0_5px_rgba(0,255,102,0.5)]">{title}</span>
            </div>
            <button
              type="button"
              onClick={toggleMinimize}
              aria-label="Minimize panel"
              className="text-[#00ff66] hover:text-white px-2 py-0.5 rounded bg-[#00ff66]/10 hover:bg-[#00ff66]/25 active:bg-[#00ff66]/40 transition text-[10px] flex items-center gap-1 border border-[#00ff66]/30"
            >
              <span>MIN</span>
              <Minimize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Metrics Body */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center hover:bg-[#00ff66]/5 px-1 rounded transition-colors">
              <span className="text-[#00ff66]/70">Mode:</span>
              <span className="font-semibold">{data.mode ?? 'standard'}</span>
            </div>

            <div className="flex justify-between items-center hover:bg-[#00ff66]/5 px-1 rounded transition-colors">
              <span className="text-[#00ff66]/70">Segments:</span>
              <span className="font-semibold">{data.segments ?? 47}</span>
            </div>

            <div className="flex justify-between items-center hover:bg-[#00ff66]/5 px-1 rounded transition-colors">
              <span className="text-[#00ff66]/70">Index:</span>
              <span className="font-semibold">{data.index ?? 0}</span>
            </div>

            <div className="flex justify-between items-center hover:bg-[#00ff66]/5 px-1 rounded transition-colors">
              <span className="text-[#00ff66]/70">WPM:</span>
              <span className="font-semibold">{data.wpm ?? 120}</span>
            </div>

            <div className="flex justify-between items-center hover:bg-[#00ff66]/5 px-1 rounded transition-colors">
              <span className="text-[#00ff66]/70">Chunk:</span>
              <span className="font-semibold">{data.chunk ?? 4}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-[#00ff66]/20 px-1 hover:bg-[#00ff66]/5 rounded transition-colors">
              <span className="text-[#00ff66]/70">Playing:</span>
              <span className={`font-semibold ${data.isPlaying ? 'text-[#00ff66] drop-shadow-[0_0_4px_#00ff66]' : 'text-[#00ff66]/80'}`}>
                {data.isPlaying ? 'TRUE' : 'FALSE'}
              </span>
            </div>

            {/* Terminal Container Box */}
            <div className="pt-2">
              <div className="text-[#00ff66]/70 mb-1 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-[#00ff66]" />
                  Current Segment:
                </span>
              </div>
              <div className="bg-black/50 border border-[#00ff66]/30 rounded p-2 text-[11px] text-[#00ff66]/90 truncate font-mono shadow-inner tracking-tight hover:border-[#00ff66]/60 transition-colors">
                {data.currentSegment ?? '# ORIONHQ ORCHESTRATOR - PROJECT CONTINUATION PROM...'}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
