'use client';

import React from 'react';
import { Palette, Check } from 'lucide-react';
import { WizardFormData } from '../types/wizard.types';
import { BrandManagerService } from '../../brand/brand.service';

interface StepBrandProps {
  formData: WizardFormData;
  updateFormData: (fields: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

export function StepBrand({ formData, updateFormData, errors }: StepBrandProps) {
  const brand = BrandManagerService.getDefaultBrandProfile();

  const isSelected = formData.brandId === brand.id;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-cyan-400" /> Step 6: Select Brand Kit Profile
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Apply brand voice rules, color palettes, fonts, and watermarks to all platform variants.
        </p>
      </div>

      {errors.brandId && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {errors.brandId}
        </div>
      )}

      {/* Brand Kit Card Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => updateFormData({ brandId: brand.id })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
            isSelected
              ? 'bg-gradient-to-br from-cyan-950/60 to-indigo-950/40 border-cyan-500/60 shadow-lg'
              : 'bg-[#0F131E] border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                MP
              </div>
              <div>
                <div className="text-sm font-bold text-white">{brand.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono">DEFAULT BRAND PROFILE</div>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-800 bg-slate-950'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 font-mono">Primary Color</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: brand.primaryColor }} />
                <span className="font-mono text-slate-200 text-[11px]">{brand.primaryColor}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-mono">Heading Font</div>
              <div className="font-bold text-slate-200 mt-1">{brand.fonts.heading}</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-mono">Secondary Color</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: brand.secondaryColor }} />
                <span className="font-mono text-slate-200 text-[11px]">{brand.secondaryColor}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-mono">Brand Voice</div>
              <div className="font-bold text-slate-200 mt-1 truncate">{brand.voiceTone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
