'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, X, Sparkles, Loader2 } from 'lucide-react';

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function WizardFooter({
  currentStep,
  totalSteps,
  isSubmitting,
  onPrevious,
  onNext,
  onCancel,
  onSubmit,
}: WizardFooterProps) {
  const isFirstStep = currentStep === 1;
  const isFinalStep = currentStep === totalSteps;

  return (
    <div className="bg-[#0C0F17] border-t border-[#1C2234] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 select-none">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
      >
        <X className="w-4 h-4" /> Cancel
      </button>

      <div className="flex items-center gap-3">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
        )}

        {!isFinalStep ? (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-950/40 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating Content...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" /> Generate Content
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
