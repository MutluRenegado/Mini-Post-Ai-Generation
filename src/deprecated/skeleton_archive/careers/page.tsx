import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Briefcase,
  Sparkles,
  Code2,
  Cpu,
  Share2,
  Palette,
  Users,
  CheckCircle2,
  ArrowRight,
  Mail,
  Globe,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers & Open Positions | Mini Post App',
  description:
    'Join Mini Post App and help build the future of AI-powered personal publishing, multi-platform content orchestration, and creator productivity software.',
};

const SUPPORT_MAILTO_LINK =
  'mailto:support@minipostapp.space?subject=Customer%20Support%20Request&body=Hello%20Mini%20Post%20App%20Support%20Team,%0A%0AI%20need%20assistance%20with%20the%20following%20issue:%0A%0AIssue%20Category:%0A%0ADescription:%0A%0ASteps%20to%20reproduce%20(if%20applicable):%0A%0AThank%20you.';

const openPositions = [
  {
    title: 'Senior Full-Stack Engineer (Next.js / TypeScript)',
    department: 'Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
    description:
      'Lead development of high-throughput creator studio workflows, server-side Turbopack rendering, and multi-tenant publishing pipelines using Next.js 16 and TypeScript.',
    icon: Code2,
  },
  {
    title: 'AI Prompt & Workflow Engineer (Gemini AI Flash)',
    department: 'AI & Data Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
    description:
      'Design, benchmark, and optimize platform-specific prompt pipelines for Google Gemini AI Flash to achieve sub-second multi-channel post generation and tone consistency.',
    icon: Cpu,
  },
  {
    title: 'Social Media Integration Specialist (OAuth 2.0 & APIs)',
    department: 'Platform Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
    description:
      'Build and maintain secure OAuth 2.0 connections, AES-256 token vault storage, and publishing API integrations for Meta, LinkedIn, X, TikTok, and YouTube.',
    icon: Share2,
  },
  {
    title: 'Product Designer / UI & UX Specialist',
    department: 'Design & UX',
    location: 'Remote (Global)',
    type: 'Full-time',
    description:
      'Craft modern, high-contrast dark mode interfaces, micro-animations, design tokens, and creator-focused productivity layouts.',
    icon: Palette,
  },
  {
    title: 'Technical Content & Community Manager',
    department: 'Developer & Creator Relations',
    location: 'Remote (Global)',
    type: 'Full-time',
    description:
      'Create high-value product guides, developer documentation, video tutorials, and engage directly with creator communities and solopreneurs.',
    icon: Users,
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans p-4 sm:p-8 lg:p-12 space-y-16 max-w-6xl mx-auto">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#ffae00] text-xs font-mono font-bold uppercase tracking-widest">
          <Briefcase className="w-4 h-4 text-[#ffae00]" />
          <span>JOIN OUR TEAM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Build the Future of Personal Publishing
        </h1>

        <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
          We are an engineering-driven, creator-focused team building AI-powered publishing tools that eliminate repetitive work for creators, freelancers, solopreneurs, and growing businesses worldwide.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="#open-positions"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#ffae00] hover:bg-[#ffd066] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>View Open Positions</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/company"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-full transition-all"
          >
            Learn About Our Company
          </Link>
        </div>
      </section>

      {/* WHY WORK WITH US (4 PILLARS) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-[#ffae00] uppercase tracking-widest">
            OUR CULTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Why Join Mini Post App?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-6 space-y-3 shadow-md">
            <Globe className="w-8 h-8 text-[#ffae00]" />
            <h3 className="text-base font-extrabold text-white">Remote-First Culture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Work from anywhere in the world with flexible hours and asynchronous collaboration.</p>
          </div>

          <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-6 space-y-3 shadow-md">
            <Code2 className="w-8 h-8 text-cyan-400" />
            <h3 className="text-base font-extrabold text-white">Modern Tech Stack</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Build with Next.js 16, TypeScript, Turbopack, Google Gemini AI Flash, and Tailwind CSS.</p>
          </div>

          <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-6 space-y-3 shadow-md">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h3 className="text-base font-extrabold text-white">Creator Impact</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Directly empower thousands of creators, solopreneurs, and agencies to grow their brand reach.</p>
          </div>

          <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-6 space-y-3 shadow-md">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white">Engineering Quality</h3>
            <p className="text-xs text-slate-400 leading-relaxed">We prioritize clean architecture, sub-second performance, strict type safety, and zero technical debt.</p>
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section id="open-positions" className="space-y-8 pt-4 border-t border-[#1b2438]">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-[#ffae00] uppercase tracking-widest">
            CAREER OPPORTUNITIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Current Openings</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Click any position to apply directly via email.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {openPositions.map((job) => {
            const Icon = job.icon;
            return (
              <div
                key={job.title}
                className="bg-[#0c101a] border border-[#1b2438] hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#ffae00] text-[10px] font-mono font-bold uppercase">
                      {job.department}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{job.location} • {job.type}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">{job.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">{job.description}</p>
                </div>

                <a
                  href={`mailto:support@minipostapp.space?subject=Application:%20${encodeURIComponent(job.title)}`}
                  className="px-6 py-3 bg-[#ffae00] hover:bg-[#ffd066] text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-full transition-all shrink-0 text-center cursor-pointer"
                >
                  Apply Now
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* GENERAL INQUIRIES CARD */}
      <section className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-8 text-center space-y-4 shadow-xl max-w-3xl mx-auto">
        <Mail className="w-8 h-8 text-[#ffae00] mx-auto" />
        <h2 className="text-xl font-bold text-white">Don’t See Your Ideal Role?</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          We are always looking for exceptional engineers, AI researchers, designers, and creator growth strategists. Send your resume and portfolio to support@minipostapp.space.
        </p>
        <div>
          <a
            href={SUPPORT_MAILTO_LINK}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#ffae00] hover:underline"
          >
            <span>Send General Application Email</span>
            <span>→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
