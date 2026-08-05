'use client';

import React from 'react';
import { CalendarDays, Send, Clock, Globe } from 'lucide-react';
import { WizardFormData } from '../types/wizard.types';

interface StepScheduleProps {
  formData: WizardFormData;
  updateFormData: (fields: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

export function StepSchedule({ formData, updateFormData, errors }: StepScheduleProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-cyan-400" /> Step 8: Publishing Schedule
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Choose whether to dispatch content immediately or queue for future optimal publishing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Publish Immediately */}
        <div
          onClick={() => updateFormData({ publishMode: 'now' })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
            formData.publishMode === 'now'
              ? 'bg-gradient-to-br from-cyan-950/60 to-indigo-950/40 border-cyan-500/60 text-white shadow-md'
              : 'bg-[#0F131E] border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mb-2">
            <Send className="w-4.5 h-4.5" />
          </div>
          <div className="text-sm font-bold text-white">Publish Immediately</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Dispatch post to target channels as soon as Fast Post Studio completes building.
          </div>
        </div>

        {/* Schedule Publication */}
        <div
          onClick={() => updateFormData({ publishMode: 'scheduled' })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
            formData.publishMode === 'scheduled'
              ? 'bg-gradient-to-br from-cyan-950/60 to-indigo-950/40 border-cyan-500/60 text-white shadow-md'
              : 'bg-[#0F131E] border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mb-2">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div className="text-sm font-bold text-white">Schedule Publication</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Specify precise target date, time, and timezone for automated release.
          </div>
        </div>
      </div>

      {/* Date & Time Picker inputs */}
      {formData.publishMode === 'scheduled' && (
        <div className="p-5 rounded-2xl bg-[#0F131E] border border-cyan-500/30 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Scheduled Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Date <span className="text-rose-400">*</span></label>
              <input
                type="date"
                value={formData.scheduledDate || ''}
                onChange={(e) => updateFormData({ scheduledDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              {errors.scheduledDate && <p className="text-[11px] text-rose-400 font-semibold">{errors.scheduledDate}</p>}
            </div>

            {/* Scheduled Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Time <span className="text-rose-400">*</span></label>
              <input
                type="time"
                value={formData.scheduledTime || '10:00'}
                onChange={(e) => updateFormData({ scheduledTime: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              {errors.scheduledTime && <p className="text-[11px] text-rose-400 font-semibold">{errors.scheduledTime}</p>}
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-400" /> Timezone
              </label>
              <select
                value={formData.timezone || 'UTC'}
                onChange={(e) => updateFormData({ timezone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (US Eastern Standard Time)</option>
                <option value="PST">PST (US Pacific Standard Time)</option>
                <option value="CET">CET (Central European Time)</option>
                <option value="TRT">TRT (Turkey Time GMT+3)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
