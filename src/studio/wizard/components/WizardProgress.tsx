'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const STEP_LABELS = [
  'Goal',
  'Content',
  'Audience',
  'Platforms',
  'Template',
  'Brand',
  'Images',
  'Schedule',
  'Review',
];

export function WizardProgress({ currentStep, totalSteps, onStepClick }: WizardProgressProps) {
  return (
    <div className="w-full bg-[#0C0F17] border-b border-[#1C2234] px-4 py-3 select-none">
      <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none max-w-3xl mx-auto">
        {STEP_LABELS.slice(0, totalSteps).map((label, idx) => {
          const stepNum = idx + 1;
          const isCurrent = currentStep === stepNum;
          const isPassed = currentStep > stepNum;

          return (
            <React.Fragment key={stepNum}>
              <div
                onClick={() => isPassed && onStepClick(stepNum)}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isPassed ? 'cursor-pointer hover:bg-slate-900' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/30'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stepNum}
                </div>

                <span
                  className={`hidden md:inline text-xs font-semibold ${
                    isCurrent
                      ? 'text-cyan-300 font-bold'
                      : isPassed
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </div>

              {stepNum < totalSteps && (
                <div
                  className={`h-0.5 w-4 sm:w-8 shrink-0 rounded-full transition-colors ${
                    currentStep > stepNum ? 'bg-cyan-500/40' : 'bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
