'use client';

import React, { useEffect, useRef } from 'react';
import { useHelping } from '../context/HelpingContext';
import { HelpCircle, X, CheckCircle2, AlertTriangle, Info, ArrowRight } from 'lucide-react';

export function ExplainBox() {
  const { activeItem, closeHelp } = useHelping();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeHelp();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        closeHelp();
      }
    };

    if (activeItem) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeItem, closeHelp]);

  if (!activeItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={boxRef}
        id={`explain-box-${activeItem.id}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`explain-title-${activeItem.id}`}
        className="relative w-full max-w-lg bg-[#0c101d] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6 text-slate-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-black text-xs">
              E
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                CONTEXTUAL EXPLANATION
              </span>
              <h2 id={`explain-title-${activeItem.id}`} className="text-lg font-bold text-white leading-tight">
                {activeItem.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={closeHelp}
            aria-label="Close explanation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content Sections */}
        <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
          {/* What This Is / Short Description */}
          <div className="space-y-1">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>What It Is</span>
            </h3>
            <p className="text-slate-200">{activeItem.shortDescription}</p>
          </div>

          {/* Purpose / What It Does */}
          <div className="space-y-1">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              What It Does
            </h3>
            <p className="text-slate-300">{activeItem.purpose}</p>
          </div>

          {/* Step-by-Step Instructions */}
          {activeItem.instructions && activeItem.instructions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                How To Use It
              </h3>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                {activeItem.instructions.map((step, idx) => (
                  <li key={idx} className="leading-snug">{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Expected Result */}
          <div className="space-y-1 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Expected Result</span>
            </h3>
            <p className="text-xs text-slate-300">{activeItem.expectedResult}</p>
          </div>

          {/* Common Mistakes (Optional) */}
          {activeItem.commonMistakes && activeItem.commonMistakes.length > 0 && (
            <div className="space-y-1 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Common Mistakes</span>
              </h3>
              <ul className="space-y-1 list-disc list-inside text-xs text-slate-300">
                {activeItem.commonMistakes.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Close Action */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={closeHelp}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
