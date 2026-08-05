'use client';

import React from 'react';
import {
  CheckCircle2,
  Edit3,
  Share2,
  LayoutGrid,
  CalendarDays,
  Target,
  Users,
} from 'lucide-react';
import { WizardFormData } from '../types/wizard.types';

interface StepReviewProps {
  formData: WizardFormData;
  onJumpToStep: (step: number) => void;
}

export function StepReview({ formData, onJumpToStep }: StepReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Step 9: Review & Confirm Request
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Review all selections before generating your CreatePostRequest object for the Orchestrator pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Goal & Content Summary */}
        <div className="p-5 rounded-2xl bg-[#0F131E] border border-slate-800 space-y-3 relative group">
          <button
            type="button"
            onClick={() => onJumpToStep(1)}
            className="absolute top-4 right-4 text-xs font-semibold text-cyan-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>

          <div className="text-xs font-bold text-slate-400 font-mono flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-400" /> Goal & Content
          </div>

          <div className="space-y-1.5 text-xs">
            <div>
              <span className="text-slate-500 font-mono">Goal: </span>
              <span className="text-white font-bold">{formData.postGoal}</span>
            </div>
            <div>
              <span className="text-slate-500 font-mono">Topic: </span>
              <span className="text-white font-bold">{formData.topic || 'Not specified'}</span>
            </div>
            {formData.title && (
              <div>
                <span className="text-slate-500 font-mono">Headline: </span>
                <span className="text-white font-bold">{formData.title}</span>
              </div>
            )}
            <div>
              <span className="text-slate-500 font-mono">CTA: </span>
              <span className="text-cyan-300 font-bold">{formData.callToAction}</span>
            </div>
          </div>
        </div>

        {/* Audience & Tone Summary */}
        <div className="p-5 rounded-2xl bg-[#0F131E] border border-slate-800 space-y-3 relative group">
          <button
            type="button"
            onClick={() => onJumpToStep(3)}
            className="absolute top-4 right-4 text-xs font-semibold text-cyan-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>

          <div className="text-xs font-bold text-slate-400 font-mono flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-400" /> Audience & Voice
          </div>

          <div className="space-y-1.5 text-xs">
            <div>
              <span className="text-slate-500 font-mono">Audience: </span>
              <span className="text-white font-bold">{formData.targetAudience}</span>
            </div>
            <div>
              <span className="text-slate-500 font-mono">Industry: </span>
              <span className="text-white font-bold">{formData.industry}</span>
            </div>
            <div>
              <span className="text-slate-500 font-mono">Tone: </span>
              <span className="text-purple-300 font-bold">{formData.tone}</span>
            </div>
            <div>
              <span className="text-slate-500 font-mono">Language: </span>
              <span className="text-white font-bold">{formData.language}</span>
            </div>
          </div>
        </div>

        {/* Platforms Summary */}
        <div className="p-5 rounded-2xl bg-[#0F131E] border border-slate-800 space-y-3 relative group">
          <button
            type="button"
            onClick={() => onJumpToStep(4)}
            className="absolute top-4 right-4 text-xs font-semibold text-cyan-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>

          <div className="text-xs font-bold text-slate-400 font-mono flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-emerald-400" /> Publishing Platforms
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {formData.platforms.map((p) => (
              <span key={p} className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Template & Brand Summary */}
        <div className="p-5 rounded-2xl bg-[#0F131E] border border-slate-800 space-y-3 relative group">
          <button
            type="button"
            onClick={() => onJumpToStep(5)}
            className="absolute top-4 right-4 text-xs font-semibold text-cyan-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>

          <div className="text-xs font-bold text-slate-400 font-mono flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4 text-amber-400" /> Template & Brand
          </div>

          <div className="space-y-1.5 text-xs">
            <div>
              <span className="text-slate-500 font-mono">Template ID: </span>
              <span className="text-white font-bold">{formData.templateId}</span>
            </div>
            <div>
              <span className="text-slate-500 font-mono">Brand Kit: </span>
              <span className="text-white font-bold">{formData.brandId}</span>
            </div>
            <div>
              <span className="text-slate-500 font-mono">Image Source: </span>
              <span className="text-amber-300 font-bold uppercase">{formData.imageSource}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Summary */}
      <div className="p-5 rounded-2xl bg-[#0F131E] border border-cyan-500/30 space-y-2">
        <div className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-cyan-400" /> Publishing Execution Mode
        </div>
        <div className="text-sm font-bold text-white">
          {formData.publishMode === 'now' ? (
            '⚡ Immediate Dispatch (Publish As Soon As Rendered)'
          ) : (
            `📅 Scheduled for ${formData.scheduledDate} at ${formData.scheduledTime} (${formData.timezone})`
          )}
        </div>
      </div>
    </div>
  );
}
