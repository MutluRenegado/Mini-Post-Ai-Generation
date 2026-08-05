'use client';

import React from 'react';
import {
  Tag,
  ShoppingBag,
  Briefcase,
  FileText,
  Calendar,
  Megaphone,
  Percent,
  Eye,
  BookOpen,
  Star,
  Quote as QuoteIcon,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PostGoalOption, WizardFormData } from '../types/wizard.types';

interface StepPostGoalProps {
  formData: WizardFormData;
  updateFormData: (fields: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

const GOALS: { id: PostGoalOption; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'Promote Product', label: 'Promote Product', icon: ShoppingBag, desc: 'Feature a product release or physical item' },
  { id: 'Promote Service', label: 'Promote Service', icon: Briefcase, desc: 'Highlight agency, SaaS, or professional offerings' },
  { id: 'Blog Article', label: 'Blog Article', icon: FileText, desc: 'Drive readers to a new blog post or publication' },
  { id: 'Event', label: 'Event', icon: Calendar, desc: 'Invite audience to webinars, launches, or meetups' },
  { id: 'Announcement', label: 'Announcement', icon: Megaphone, desc: 'Share important company news or feature updates' },
  { id: 'Discount', label: 'Discount', icon: Percent, desc: 'Promote special offers, coupons, or limited sales' },
  { id: 'Brand Awareness', label: 'Brand Awareness', icon: Eye, desc: 'Expand reach and introduce your brand values' },
  { id: 'Educational', label: 'Educational', icon: BookOpen, desc: 'Provide tips, tutorials, or industry insights' },
  { id: 'Testimonial', label: 'Testimonial', icon: Star, desc: 'Share customer reviews and social proof' },
  { id: 'Quote', label: 'Quote', icon: QuoteIcon, desc: 'Post inspirational or executive thought leadership' },
  { id: 'Custom', label: 'Custom Goal', icon: Tag, desc: 'Specify a custom objective tailored to your needs' },
];

export function StepPostGoal({ formData, updateFormData, errors }: StepPostGoalProps) {
  const selectedGoalObj = GOALS.find((g) => g.id === formData.postGoal);

  const handleSelectGoal = (goalId: PostGoalOption) => {
    updateFormData({ postGoal: goalId });
  };

  const handleClearGoal = () => {
    updateFormData({ postGoal: '' as PostGoalOption });
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" /> Choose your post goal
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Select the main objective for your social media content.
        </p>
      </div>

      {errors.postGoal && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {errors.postGoal}
        </div>
      )}

      {/* Selected Goal Summary Card */}
      {selectedGoalObj ? (
        <div className="bg-[#0C0F17] border border-cyan-500/40 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
              {React.createElement(selectedGoalObj.icon, { className: 'w-5 h-5' })}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight truncate">{selectedGoalObj.label}</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold border border-cyan-500/30">
                  Selected
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">{selectedGoalObj.desc}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearGoal}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            Change goal
          </button>
        </div>
      ) : (
        /* Goal Selection Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GOALS.map((item) => {
            const Icon = item.icon;
            const isSelected = formData.postGoal === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => handleSelectGoal(item.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 text-white shadow-md'
                    : 'bg-[#0C0F17] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold text-white">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Custom Goal Objective Input if Custom Goal selected */}
      {formData.postGoal === 'Custom' && (
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-cyan-400">Specify Custom Goal Objective</label>
          <input
            type="text"
            value={formData.customGoal || ''}
            onChange={(e) => updateFormData({ customGoal: e.target.value })}
            placeholder="e.g. Announce Q3 product roadmap release & webinars"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
          {errors.customGoal && <p className="text-[11px] text-rose-400 font-semibold">{errors.customGoal}</p>}
        </div>
      )}
    </div>
  );
}

export default StepPostGoal;
