'use client';

import React, { useState } from 'react';
import { LayoutGrid, Search, Check, Star } from 'lucide-react';
import { WizardFormData } from '../types/wizard.types';
import { TemplateManagerService } from '../../templates/templates.service';

interface StepTemplateProps {
  formData: WizardFormData;
  updateFormData: (fields: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

export function StepTemplate({ formData, updateFormData, errors }: StepTemplateProps) {
  const templates = TemplateManagerService.getTemplates();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [favorites, setFavorites] = useState<string[]>(['tmpl_quote_dark']);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesFav = categoryFilter === 'Favorites' ? favorites.includes(t.id) : true;
    return matchesSearch && matchesCat && matchesFav;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-cyan-400" /> Step 5: Visual Template Selection
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose a visual layout template preset from Template Manager.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-[#0F131E] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Favorites', 'Quote', 'Carousel', 'Story', 'Promotion', 'Educational'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {errors.templateId && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {errors.templateId}
        </div>
      )}

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const isSelected = formData.templateId === template.id;
          const isFav = favorites.includes(template.id);
          return (
            <div
              key={template.id}
              onClick={() => updateFormData({ templateId: template.id })}
              className={`group p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/60 to-indigo-950/40 border-cyan-500/60 shadow-lg'
                  : 'bg-[#0F131E] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-full aspect-[16/9] rounded-xl bg-gradient-to-br ${template.previewColor} border border-slate-700/50 p-3 flex flex-col justify-between relative shadow-inner`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-black/40 text-white font-bold">{template.category}</span>
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(template.id, e)}
                    className="p-1 rounded bg-black/40 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-3 h-3 ${isFav ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                  </button>
                </div>

                <div className="text-white font-bold text-xs truncate font-mono">{template.name}</div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300">{template.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Ratio {template.aspectRatio}</div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-800 bg-slate-950'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
