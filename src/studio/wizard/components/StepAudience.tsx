'use client';

import React from 'react';
import { Users, Globe, Smile, Building2 } from 'lucide-react';
import { ToneOption, WizardFormData } from '../types/wizard.types';

interface StepAudienceProps {
  formData: WizardFormData;
  updateFormData: (fields: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

const TONES: { id: ToneOption; label: string; desc: string }[] = [
  { id: 'Professional', label: 'Professional', desc: 'Authoritative, polished, executive' },
  { id: 'Friendly', label: 'Friendly', desc: 'Warm, approachable, helpful' },
  { id: 'Corporate', label: 'Corporate', desc: 'Formal, strategic, enterprise-focused' },
  { id: 'Luxury', label: 'Luxury', desc: 'Exclusive, elegant, premium' },
  { id: 'Casual', label: 'Casual', desc: 'Conversational, relaxed, relatable' },
  { id: 'Educational', label: 'Educational', desc: 'Informative, clear, instructional' },
  { id: 'Funny', label: 'Funny', desc: 'Humorous, witty, engaging' },
];

export function StepAudience({ formData, updateFormData, errors }: StepAudienceProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" /> Step 3: Target Audience & Tone
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Specify recipient demographics, language, industry context, and brand tone.
        </p>
      </div>

      <div className="space-y-4 bg-[#0F131E] border border-slate-800 p-5 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Target Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Target Audience <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => updateFormData({ targetAudience: e.target.value })}
              placeholder="e.g. Founders, Marketers, Tech Enthusiasts"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {errors.targetAudience && <p className="text-[11px] text-rose-400 font-semibold">{errors.targetAudience}</p>}
          </div>

          {/* Industry */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-400" /> Industry <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => updateFormData({ industry: e.target.value })}
              placeholder="e.g. Software & Technology"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {errors.industry && <p className="text-[11px] text-rose-400 font-semibold">{errors.industry}</p>}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" /> Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => updateFormData({ language: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="English">English (US/Global)</option>
            <option value="Spanish">Spanish (Español)</option>
            <option value="French">French (Français)</option>
            <option value="German">German (Deutsch)</option>
            <option value="Portuguese">Portuguese (Português)</option>
            <option value="Turkish">Turkish (Türkçe)</option>
            <option value="Italian">Italian (Italiano)</option>
          </select>
        </div>

        {/* Tone Options Grid */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-amber-400" /> Brand Tone <span className="text-rose-400">*</span>
          </label>
          {errors.tone && <p className="text-[11px] text-rose-400 font-semibold">{errors.tone}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {TONES.map((t) => {
              const isSelected = formData.tone === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => updateFormData({ tone: t.id })}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{t.label}</span>
                    {isSelected && <span className="text-[9px] font-mono text-cyan-400 font-bold">ACTIVE</span>}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{t.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
