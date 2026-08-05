'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  LayoutGrid,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { TemplateItem } from '../types/studio.types';
import { TemplateManagerService } from './templates.service';

interface TemplateGalleryViewProps {
  onBack?: () => void;
  onSelectTemplate?: (template: TemplateItem) => void;
}

const COLOR_PRESETS = [
  { label: 'Dark Executive', value: 'from-slate-900 via-indigo-950 to-slate-900' },
  { label: 'Cyberpunk Cyan', value: 'from-cyan-950 via-slate-900 to-indigo-950' },
  { label: 'Vibrant Story', value: 'from-purple-900 via-pink-950 to-slate-950' },
  { label: 'Emerald Minimal', value: 'from-emerald-950 via-slate-900 to-teal-950' },
  { label: 'Sunset Rose', value: 'from-amber-950 via-rose-950 to-slate-950' },
  { label: 'Deep Indigo', value: 'from-[#0B0F19] via-indigo-950 to-[#07090E]' },
];

const CATEGORIES: TemplateItem['category'][] = [
  'Quote',
  'Carousel',
  'Promotion',
  'Product',
  'Event',
  'Story',
  'Testimonial',
  'Educational',
  'Tips',
  'Before/After',
  'News',
  'Meme',
];

export function TemplateGalleryView({ onSelectTemplate }: TemplateGalleryViewProps) {
  const [templates, setTemplates] = useState<TemplateItem[]>(() => TemplateManagerService.getTemplates());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Template Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TemplateItem['category']>('Quote');
  const [aspectRatio, setAspectRatio] = useState<TemplateItem['aspectRatio']>('1:1');
  const [previewColor, setPreviewColor] = useState(COLOR_PRESETS[0].value);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [headingSize, setHeadingSize] = useState(28);
  const [bodySize, setBodySize] = useState(16);
  const [padding, setPadding] = useState(32);

  const reloadTemplates = () => {
    setTemplates(TemplateManagerService.getTemplates());
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    TemplateManagerService.saveCustomTemplate({
      name,
      category,
      aspectRatio,
      previewColor,
      layout: {
        fontFamily,
        headingSize,
        bodySize,
        padding,
        safeZoneMargins: { top: 16, bottom: 16, left: 16, right: 16 },
      },
    });

    // Reset form and reload
    setName('');
    setIsCreateModalOpen(false);
    reloadTemplates();
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this custom template?')) {
      TemplateManagerService.deleteCustomTemplate(id);
      reloadTemplates();
    }
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
            <LayoutGrid className="w-3.5 h-3.5" /> VISUAL LAYOUT ENGINE
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Template Manager</h1>
          <p className="text-xs text-slate-400">
            Create, customize, and apply visual layout presets with automatic safe zone boundaries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Custom Template
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-[#0F131E] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate && onSelectTemplate(template)}
            className="group relative rounded-2xl bg-[#0F131E] border border-slate-800/80 hover:border-purple-500/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            {/* Live Visual Card Preview */}
            <div
              className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${template.previewColor} border border-slate-700/50 p-4 relative overflow-hidden flex flex-col justify-between shadow-inner`}
            >
              {/* Safe Zone Indicator Overlay */}
              <div
                className="absolute inset-0 border border-dashed border-cyan-500/20 pointer-events-none rounded-lg"
                style={{
                  top: `${template.layout.safeZoneMargins.top}px`,
                  bottom: `${template.layout.safeZoneMargins.bottom}px`,
                  left: `${template.layout.safeZoneMargins.left}px`,
                  right: `${template.layout.safeZoneMargins.right}px`,
                }}
              />

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10 font-bold">
                  {template.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10 text-cyan-300">
                  {template.aspectRatio}
                </span>
              </div>

              <div className="space-y-1 my-auto">
                <div
                  className="font-extrabold text-white leading-tight truncate"
                  style={{
                    fontFamily: template.layout.fontFamily,
                    fontSize: `${Math.min(20, template.layout.headingSize * 0.6)}px`,
                  }}
                >
                  {template.name}
                </div>
                <div
                  className="text-slate-300 text-[11px] line-clamp-2"
                  style={{ fontFamily: template.layout.fontFamily }}
                >
                  Sample layout preview demonstrating font hierarchy and safe margins.
                </div>
              </div>

              <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between pt-2 border-t border-white/10">
                <span>Font: {template.layout.fontFamily}</span>
                <span>Padding: {template.layout.padding}px</span>
              </div>
            </div>

            {/* Template Info & Actions */}
            <div className="mt-4 flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  {template.name}
                  {template.isCustom && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      CUSTOM
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {template.category} • {template.aspectRatio}
                </div>
              </div>

              {template.isCustom && (
                <button
                  type="button"
                  onClick={(e) => handleDeleteTemplate(template.id, e)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                  title="Delete Custom Template"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog: Create Custom Template */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F131E] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">Create New Visual Template</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Template Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Template Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Modern Gradient Quote"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TemplateItem['category'])}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aspect Ratio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as TemplateItem['aspectRatio'])}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="1:1">1:1 Square (Instagram/Threads)</option>
                    <option value="4:5">4:5 Portrait (Instagram Feed)</option>
                    <option value="9:16">9:16 Story / Reel (IG/TikTok)</option>
                    <option value="16:9">16:9 Landscape (X/Facebook)</option>
                    <option value="2:3">2:3 Pin (Pinterest)</option>
                    <option value="4:3">4:3 Update (Google Business)</option>
                  </select>
                </div>

                {/* Background Theme */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Background Theme</label>
                  <select
                    value={previewColor}
                    onChange={(e) => setPreviewColor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {COLOR_PRESETS.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Layout Typography & Padding */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-mono">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Outfit">Outfit</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-mono">Heading ({headingSize}px)</label>
                  <input
                    type="range"
                    min={18}
                    max={48}
                    value={headingSize}
                    onChange={(e) => setHeadingSize(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-mono">Body ({bodySize}px)</label>
                  <input
                    type="range"
                    min={12}
                    max={24}
                    value={bodySize}
                    onChange={(e) => setBodySize(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-mono">Padding ({padding}px)</label>
                  <input
                    type="range"
                    min={16}
                    max={64}
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>

              {/* Live Preview Card inside Modal */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Live Template Preview</span>
                  <span>{aspectRatio}</span>
                </div>
                <div
                  className={`w-full h-32 rounded-xl bg-gradient-to-br ${previewColor} border border-slate-700/50 p-4 flex flex-col justify-center text-center shadow-md relative`}
                >
                  <div
                    className="font-bold text-white"
                    style={{ fontFamily, fontSize: `${Math.min(22, headingSize * 0.6)}px` }}
                  >
                    {name || 'Sample Template Title'}
                  </div>
                  <div className="text-xs text-slate-300 mt-1" style={{ fontFamily, fontSize: `${Math.min(14, bodySize)}px` }}>
                    Subheading and body placeholder text
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
