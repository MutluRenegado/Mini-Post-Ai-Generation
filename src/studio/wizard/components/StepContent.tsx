'use client';

import React from 'react';
import { FileText, Type, MessageSquare, Target } from 'lucide-react';
import { WizardFormData } from '../types/wizard.types';

interface StepContentProps {
  formData: WizardFormData;
  updateFormData: (fields: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

export function StepContent({ formData, updateFormData, errors }: StepContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" /> Step 2: Content Details
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Provide core topics, headline preferences, post outline, and call to action.
        </p>
      </div>

      <div className="space-y-4 bg-[#0F131E] border border-slate-800 p-5 rounded-2xl">
        {/* Topic */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Primary Topic <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => updateFormData({ topic: e.target.value })}
            placeholder="e.g. AI-Powered Multi-Platform Social Media Scheduler"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {errors.topic && <p className="text-[11px] text-rose-400 font-semibold">{errors.topic}</p>}
        </div>

        {/* Optional Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-purple-400" /> Headline / Title <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="e.g. 5 Game-Changing Strategies for Social Media Growth in 2026"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> Post Description / Key Points <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Explain key messages, main takeaways, bullet points, or core story you want to convey..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          />
          {errors.description && <p className="text-[11px] text-rose-400 font-semibold">{errors.description}</p>}
        </div>

        {/* Call to Action */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" /> Call to Action (CTA) <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            {['Learn More', 'Try Free Today', 'Link in Bio', 'Book a Demo', 'Comment Below', 'Sign Up Now'].map((cta) => (
              <button
                key={cta}
                type="button"
                onClick={() => updateFormData({ callToAction: cta })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors border ${
                  formData.callToAction === cta
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cta}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={formData.callToAction}
            onChange={(e) => updateFormData({ callToAction: e.target.value })}
            placeholder="Custom CTA phrase..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {errors.callToAction && <p className="text-[11px] text-rose-400 font-semibold">{errors.callToAction}</p>}
        </div>
      </div>
    </div>
  );
}
