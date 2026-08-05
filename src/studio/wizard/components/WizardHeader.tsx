'use client';

import React from 'react';
import { Wand2, RotateCcw, Save } from 'lucide-react';

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  isDraftSaved: boolean;
  onReset: () => void;
}

export function WizardHeader({ currentStep, totalSteps, isDraftSaved, onReset }: WizardHeaderProps) {
  return (
    <div className="bg-[#0C0F17] border-b border-[#1C2234] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-cyan-500/20">
          <Wand2 className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-xs text-white tracking-tight flex items-center gap-2">
            AI Creator Wizard
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              STEP {currentStep} OF {totalSteps}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Fast Post Creating Studio Pipeline</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isDraftSaved && (
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
            <Save className="w-3 h-3" /> Auto-Saved
          </div>
        )}

        <button
          type="button"
          onClick={onReset}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
          title="Reset Wizard Form"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}
