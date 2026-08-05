'use client';

import React, { useState } from 'react';
import {
  Share2,
  Globe,
  MessageSquare,
  Pin,
  AtSign,
  Video,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PlatformOption, WizardFormData } from '../types/wizard.types';

interface StepPlatformsProps {
  formData: WizardFormData;
  updateFormData: (fields: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

interface PlatformDef {
  id: PlatformOption;
  name: string;
  icon: React.ElementType;
}

const PRIMARY_PLATFORMS: PlatformDef[] = [
  { id: 'Facebook', name: 'Facebook', icon: Share2 },
  { id: 'Instagram Feed', name: 'Instagram', icon: Sparkles },
  { id: 'LinkedIn', name: 'LinkedIn', icon: Globe },
  { id: 'X', name: 'X (Twitter)', icon: MessageSquare },
];

const MORE_PLATFORMS: PlatformDef[] = [
  { id: 'TikTok', name: 'TikTok', icon: Video },
  { id: 'Pinterest', name: 'Pinterest', icon: Pin },
  { id: 'Threads', name: 'Threads', icon: AtSign },
  { id: 'Instagram Story', name: 'Instagram Story', icon: Sparkles },
];

export function StepPlatforms({ formData, updateFormData, errors }: StepPlatformsProps) {
  const [showMore, setShowMore] = useState<boolean>(false);

  const togglePlatform = (p: PlatformOption) => {
    const exists = formData.platforms.includes(p);
    const updated = exists
      ? formData.platforms.filter((x: PlatformOption) => x !== p)
      : [...formData.platforms, p];
    updateFormData({ platforms: updated });
  };

  const renderPlatformChip = (item: PlatformDef) => {
    const Icon = item.icon;
    const isSelected = formData.platforms.includes(item.id);

    return (
      <button
        type="button"
        key={item.id}
        onClick={() => togglePlatform(item.id)}
        className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
          isSelected
            ? 'bg-cyan-500/20 border-cyan-500/60 text-white shadow-sm'
            : 'bg-[#0C0F17] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center ${
            isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
          }`}
        >
          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
        </div>
        <span>{item.name}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-cyan-400" /> Select target platforms
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Choose where Mini Post App should adapt and publish your content.
        </p>
      </div>

      {errors.platforms && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {errors.platforms}
        </div>
      )}

      {/* Primary Platforms Section */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Primary Platforms
        </div>
        <div className="flex flex-wrap gap-2.5">
          {PRIMARY_PLATFORMS.map(renderPlatformChip)}
        </div>
      </div>

      {/* More Platforms Section */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => setShowMore((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <span>{showMore ? 'Hide additional platforms' : 'More platforms...'}</span>
          {showMore ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showMore && (
          <div className="flex flex-wrap gap-2.5 pt-1 animate-in fade-in duration-200">
            {MORE_PLATFORMS.map(renderPlatformChip)}
          </div>
        )}
      </div>
    </div>
  );
}

export default StepPlatforms;
