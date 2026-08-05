import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Newspaper,
  Download,
  Share2,
  FileText,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Globe,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Press, Media Kit & Websites | Mini Post App',
  description:
    'Official press releases, media assets, brand guidelines, product facts, and corporate website links for Mini Post App.',
};

const SUPPORT_MAILTO_LINK =
  'mailto:support@minipostapp.space?subject=Customer%20Support%20Request&body=Hello%20Mini%20Post%20App%20Support%20Team,%0A%0AI%20need%20assistance%20with%20the%20following%20issue:%0A%0AIssue%20Category:%0A%0ADescription:%0A%0ASteps%20to%20reproduce%20(if%20applicable):%0A%0AThank%20you.';

const quickFacts = [
  { label: 'Company Name', value: 'Mini Post App' },
  { label: 'Operating Entity', value: 'Yoga Products Top Limited' },
  { label: 'Product Category', value: 'AI-Powered Personal Publishing Platform' },
  { label: 'Target Audience', value: 'Creators, Freelancers, Solopreneurs, SMBs, Marketing Teams' },
  { label: 'Supported Social Networks', value: 'Facebook, Instagram, LinkedIn, X (Twitter), TikTok, YouTube' },
  { label: 'Core AI Engine', value: 'Google Gemini AI Flash Architecture' },
  { label: 'Security & Encryption', value: 'AES-256 Vault Encryption & TLS 1.3' },
  { label: 'Official Support Email', value: 'support@minipostapp.space' },
];

const mediaAssets = [
  {
    title: 'High-Resolution Brand Logo (PNG / SVG)',
    description: 'Official Mini Post App wordmark and emblem optimized for dark mode and print media.',
    format: 'PNG / SVG (300 DPI)',
  },
  {
    title: 'Creator Studio Interface Screenshots',
    description: 'High-definition screenshots of the 7-step pipeline, template editor, and multi-channel preview.',
    format: 'ZIP Archive (4K JPG/PNG)',
  },
  {
    title: 'Executive Leadership Bio & Photos',
    description: 'Official company backgrounder, mission statement, and leadership photos.',
    format: 'PDF / High-Res Imagery',
  },
  {
    title: 'Brand Guidelines & Design Tokens',
    description: 'Color palette (Black #05070c, Gold #ffae00, Dark Slate #0c101a), typography rules, and usage guidelines.',
    format: 'Brand Guidelines PDF',
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans p-4 sm:p-8 lg:p-12 space-y-16 max-w-6xl mx-auto">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#ffae00] text-xs font-mono font-bold uppercase tracking-widest">
          <Newspaper className="w-4 h-4 text-[#ffae00]" />
          <span>PRESS & MEDIA KIT</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Mini Post App Press Assets & Company Information
        </h1>

        <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
          Everything journalists, content creators, media outlets, and partners need to cover Mini Post App’s AI-powered personal publishing platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={SUPPORT_MAILTO_LINK}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#ffae00] hover:bg-[#ffd066] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Contact Press & Media Relations</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/company"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-full transition-all"
          >
            About Company
          </Link>
        </div>
      </section>

      {/* QUICK FACTS GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-[#ffae00] uppercase tracking-widest">
            AT A GLANCE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Company Quick Facts</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickFacts.map((fact) => (
            <div
              key={fact.label}
              className="bg-[#0c101a] border border-[#1b2438] rounded-2xl p-5 space-y-1 shadow-md"
            >
              <div className="text-[11px] font-mono font-bold text-[#ffae00] uppercase">{fact.label}</div>
              <div className="text-xs sm:text-sm font-extrabold text-white leading-snug">{fact.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND ASSETS & MEDIA KIT */}
      <section className="space-y-8 pt-4 border-t border-[#1b2438]">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-[#ffae00] uppercase tracking-widest">
            MEDIA ASSETS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Official Media Kit</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            High-resolution brand assets, screenshots, and company background information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mediaAssets.map((asset) => (
            <div
              key={asset.title}
              className="bg-[#0c101a] border border-[#1b2438] hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FileText className="w-8 h-8 text-[#ffae00]" />
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-300">
                    {asset.format}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">{asset.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{asset.description}</p>
              </div>

              <a
                href={SUPPORT_MAILTO_LINK}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#ffae00] hover:underline pt-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Request Media Kit Package</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* PRESS CONTACT CARD */}
      <section className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl max-w-3xl mx-auto">
        <Mail className="w-10 h-10 text-[#ffae00] mx-auto" />
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Press & Media Inquiries</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            For interview requests, product reviews, press releases, or partnership opportunities, please contact our media relations team at support@minipostapp.space.
          </p>
        </div>
        <div>
          <a
            href={SUPPORT_MAILTO_LINK}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#ffae00] hover:bg-[#ffd066] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>Send Press Inquiry Email</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
