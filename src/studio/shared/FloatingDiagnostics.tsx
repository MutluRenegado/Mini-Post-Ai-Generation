'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Minimize2, Maximize2, Activity, Play, Pause, Terminal } from 'lucide-react';

export interface FloatingDiagnosticsProps {
  title?: string;
  mode?: string;
  segments?: number;
  index?: number;
  wpm?: number;
  chunk?: number;
  isPlaying?: boolean;
  currentSegment?: string;
  initialX?: number;
  initialY?: number;
  onTogglePlay?: () => void;
  onClose?: () => void;
}

export default function FloatingDiagnostics({
  title = 'READER DIAGNOSTICS',
  mode = 'standard',
  segments = 47,
  index = 0,
  wpm = 120,
  chunk = 4,
  isPlaying = false,
  currentSegment = '# MINI POST APP ORCHESTRATOR - PROJECT CONTINUATION PROM...',
  initialX,
  initialY,
  onTogglePlay,
  onClose,
}: FloatingDiagnosticsProps) {
  const [position, setPosition] = useState({ x: 100, y: 140 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isDraggingRef = useRef(false);

  // Initialize client-side position safely after hydration
  useEffect(() => {
    setIsMounted(true);
    const startX = initialX ?? (typeof window !== 'undefined' ? window.innerWidth - 360 : 20);
    const startY = initialY ?? 120;
    setPosition({ x: Math.max(10, startX), y: Math.max(10, startY) });
  }, [initialX, initialY]);

  // Drag handler
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent drag trigger when clicking buttons or interactive elements
    if ((e.target as HTMLElement).closest('button')) return;

    isDraggingRef.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPositionX = position.x;
    const initialPositionY = position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const nextX = initialPositionX + (moveEvent.clientX - startX);
      const nextY = initialPositionY + (moveEvent.clientY - startY);

      // Keep within viewport bounds
      const maxX = typeof window !== 'undefined' ? window.innerWidth - 60 : 1000;
      const maxY = typeof window !== 'undefined' ? window.innerHeight - 60 : 1000;

      setPosition({
        x: Math.min(Math.max(10, nextX), maxX),
        y: Math.min(Math.max(10, nextY), maxY),
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!isMounted) return null;

  return (
    <div
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className={`fixed z-50 transition-all duration-200 select-none ${
        isMinimized
          ? 'w-14 h-14 rounded-full bg-[#0b0f19]/85 backdrop-blur-md border-2 border-[#00ff66] flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:scale-105 transition-transform'
          : 'w-80 rounded-xl bg-[#0b0f19]/85 backdrop-blur-xl border border-[#00ff66]/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-4 text-[#00ff66] font-mono'
      }`}
      onMouseDown={isMinimized ? () => setIsMinimized(false) : undefined}
    >
      {isMinimized ? (
        <div className="relative flex items-center justify-center w-full h-full" title="Click to expand diagnostics">
          <Activity className="w-5 h-5 text-[#00ff66]" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00ff66] animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00ff66]" />
        </div>
      ) : (
        <>
          {/* Draggable Header */}
          <div
            onMouseDown={handleMouseDown}
            className="cursor-grab active:cursor-grabbing flex items-center justify-between pb-2 mb-3 border-b border-[#00ff66]/20 text-xs tracking-wider font-bold"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00ff66]" />
              <span>{title}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="text-[#00ff66] hover:text-white px-2 py-0.5 rounded bg-[#00ff66]/10 hover:bg-[#00ff66]/20 transition text-[10px] flex items-center gap-1 cursor-pointer"
                title="Minimize window"
              >
                <span>MIN</span>
                <Minimize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Diagnostic Metrics Body */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#00ff66]/70">Mode:</span>
              <span className="font-bold">{mode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#00ff66]/70">Segments:</span>
              <span className="font-bold">{segments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#00ff66]/70">Index:</span>
              <span className="font-bold">{index}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#00ff66]/70">WPM:</span>
              <span className="font-bold">{wpm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#00ff66]/70">Chunk:</span>
              <span className="font-bold">{chunk}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#00ff66]/20">
              <span className="text-[#00ff66]/70">Playing:</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${isPlaying ? 'text-[#00ff66]' : 'text-[#00ff66]/60'}`}>
                  {isPlaying ? 'TRUE' : 'FALSE'}
                </span>
                {onTogglePlay && (
                  <button
                    type="button"
                    onClick={onTogglePlay}
                    className="p-1 rounded bg-[#00ff66]/10 hover:bg-[#00ff66]/30 text-[#00ff66] transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>

            {/* Current Segment Box */}
            <div className="pt-2">
              <div className="text-[#00ff66]/70 mb-1 text-[11px]">Current Segment:</div>
              <div className="bg-black/50 border border-[#00ff66]/20 rounded p-2 text-[11px] text-[#00ff66]/90 truncate font-mono select-text">
                {currentSegment}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
