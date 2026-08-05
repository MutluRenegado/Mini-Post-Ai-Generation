'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Check, ArrowLeft, ShieldCheck, RefreshCw, Image as ImageIcon, Globe, Tag } from 'lucide-react';
import { BrandManagerService } from './brand.service';

interface BrandKitViewProps {
  onBack?: () => void;
}

export function BrandKitView({ onBack }: BrandKitViewProps) {
  const [mounted, setMounted] = useState(false);
  const [brandName, setBrandName] = useState('Mini Post App');
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#06b6d4');
  const [secondaryColor, setSecondaryColor] = useState('#3b82f6');
  const [accentColor, setAccentColor] = useState('#f59e0b');
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [defaultTone, setDefaultTone] = useState('Professional & Engaging');
  const [tagline, setTagline] = useState('AI Powered Social Media Engine');
  const [website, setWebsite] = useState('https://minipost.app');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const active = BrandManagerService.getActiveBrandProfile();
    setBrandName(active.brandName || active.name || 'Mini Post App');
    setLogoUrl(active.logoUrl || 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400');
    setPrimaryColor(active.primaryColor || '#06b6d4');
    setSecondaryColor(active.secondaryColor || '#3b82f6');
    setAccentColor(active.accentColor || '#f59e0b');
    setFontFamily(active.fontFamily || 'Inter, sans-serif');
    setDefaultTone(active.defaultTone || active.voiceTone || 'Professional & Engaging');
    setTagline(active.companyInfo?.tagline || 'AI Powered Social Media Engine');
    setWebsite(active.companyInfo?.website || 'https://minipost.app');
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    BrandManagerService.saveBrandProfile({
      brandName,
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
      defaultTone,
      companyInfo: {
        tagline,
        website,
        industry: 'Software & Technology',
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    const defaults = BrandManagerService.getDefaultBrandProfile();
    setBrandName(defaults.brandName);
    setLogoUrl('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400');
    setPrimaryColor(defaults.primaryColor);
    setSecondaryColor(defaults.secondaryColor);
    setAccentColor(defaults.accentColor);
    setFontFamily(defaults.fontFamily);
    setDefaultTone(defaults.defaultTone);
    setTagline(defaults.companyInfo.tagline || '');
    setWebsite(defaults.companyInfo.website || '');
    BrandManagerService.saveBrandProfile(defaults);
  };

  if (!mounted) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-slate-400 font-mono text-sm animate-pulse">
        Loading Brand Kit Engine...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto text-slate-100 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <Palette className="w-3.5 h-3.5" /> BRAND KIT ENGINE
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight pt-1">🎨 Brand Kit Manager</h1>
          <p className="text-xs text-slate-400">
            Configure core brand rules to automatically inherit across all generated posts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl">
        {/* Brand Identity & Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Brand / Company Name
            </label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Mini Post App"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Brand Logo URL
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://domain.com/logo.png"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono transition-colors"
              />
              {logoUrl && (
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tone & Tagline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Default Tone of Voice
            </label>
            <select
              value={defaultTone}
              onChange={(e) => setDefaultTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="Professional & Engaging">Professional & Engaging</option>
              <option value="Casual & Friendly">Casual & Friendly</option>
              <option value="Bold & Disruptive">Bold & Disruptive</option>
              <option value="Authoritative & Technical">Authoritative & Technical</option>
              <option value="Luxury & Exclusive">Luxury & Exclusive</option>
              <option value="Educational & Informative">Educational & Informative</option>
              <option value="Witty & Humorous">Witty & Humorous</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Brand Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. AI Powered Social Media Engine"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Color Palette (Primary, Secondary, Accent) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Primary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-9 bg-transparent rounded-xl cursor-pointer border border-slate-800"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Secondary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-10 h-9 bg-transparent rounded-xl cursor-pointer border border-slate-800"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-10 h-9 bg-transparent rounded-xl cursor-pointer border border-slate-800"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Typography & Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Typography / Font Family
            </label>
            <input
              type="text"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              placeholder="e.g. Inter, sans-serif"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Company Website
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://minipost.app"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Live Brand Kit Inheritance Preview Card */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" /> LIVE INHERITANCE PREVIEW
            </span>
            <span>INHERITED BY FAST POST CREATOR ENGINE</span>
          </div>

          <div
            className="p-4 rounded-xl border border-slate-800/80 space-y-2 shadow-inner bg-slate-900/40"
            style={{ fontFamily }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {logoUrl && (
                  <img src={logoUrl} alt="Logo" className="w-5 h-5 rounded-md object-cover" />
                )}
                <span className="text-xs font-extrabold" style={{ color: primaryColor }}>
                  {brandName}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                Tone: {defaultTone}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Sample post text generated with active brand tone styling and color accents. {tagline && `"${tagline}"`}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} title="Primary" />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: secondaryColor }} title="Secondary" />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} title="Accent" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Font: {fontFamily}</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Changes apply instantly to the Fast Post Creator engine.
          </span>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 font-bold"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-white" /> ✓ Brand Kit Saved!
              </>
            ) : (
              'Save Brand Settings'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BrandKitView;

