import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  Sparkles,
  Target,
  Eye,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Share2,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Company & About Us | Mini Post App',
  description:
    'Mini Post App is an AI-powered personal publishing platform empowering creators, freelancers, and businesses to create, optimize, schedule, and publish content across social platforms.',
};

const targetAudience = [
  {
    title: 'Content Creators & Influencers',
    description: 'Turn one video idea or blog post into platform-tailored scripts, threads, and captions in seconds.',
    icon: Sparkles,
  },
  {
    title: 'Freelancers & Solopreneurs',
    description: 'Maintain an active, professional multi-channel presence without spending hours writing separately for each platform.',
    icon: Users,
  },
  {
    title: 'Coaches & Consultants',
    description: 'Share expertise, build personal authority, and engage prospective clients across LinkedIn, X, and Facebook.',
    icon: Target,
  },
  {
    title: 'Small & Medium Businesses',
    description: 'Streamline team social media publishing, maintain consistent brand voice, and schedule campaigns ahead of time.',
    icon: Building2,
  },
  {
    title: 'Marketing Agencies & Consultants',
    description: 'Manage multi-channel workflows for multiple client brands with brand kit consistency and sub-second AI generation.',
    icon: Share2,
  },
  {
    title: 'Entrepreneurs & Founders',
    description: 'Build in public, announce product updates, and grow your audience effortlessly from a single master concept.',
    icon: Zap,
  },
];

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans p-4 sm:p-8 lg:p-12 space-y-16 max-w-6xl mx-auto">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#ffae00] text-xs font-mono font-bold uppercase tracking-widest">
          <Building2 className="w-4 h-4 text-[#ffae00]" />
          <span>ABOUT MINI POST APP</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Empowering Creators & Businesses to Publish Smarter
        </h1>

        <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
          Mini Post App is an AI-powered personal publishing platform that helps individuals and businesses create, optimize, manage, schedule, and publish high-quality content across multiple social media platforms from one streamlined workflow.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/tour"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#ffae00] hover:bg-[#ffd066] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Take a Product Tour</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/subscribe"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-full transition-all"
          >
            View Pricing Plans
          </Link>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0c101a] border border-[#1b2438] hover:border-amber-500/40 rounded-3xl p-8 space-y-4 shadow-xl transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ffae00]">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Our Mission</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            To eliminate manual social media friction by providing creators, freelancers, coaches, consultants, small businesses, and marketing teams with an intelligent, unified workflow to craft content once and multiply it seamlessly across all social platforms.
          </p>
        </div>

        <div className="bg-[#0c101a] border border-[#1b2438] hover:border-amber-500/40 rounded-3xl p-8 space-y-4 shadow-xl transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ffae00]">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Our Vision</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            A world where every professional and business can maintain an authentic, consistent, high-impact multi-channel brand presence without wasting hours manually rewriting, reformatting, or rescheduling posts.
          </p>
        </div>
      </section>

      {/* TARGET USERS GRID */}
      <section className="space-y-8 pt-4 border-t border-[#1b2438]">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-[#ffae00] uppercase tracking-widest">
            WHO WE BUILD FOR
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Designed for Creators & Growing Brands</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Mini Post App is engineered specifically for individuals and teams managing personal brands or multi-platform business accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targetAudience.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-[#0c101a] border border-[#1b2438] hover:border-amber-500/30 rounded-3xl p-6 space-y-3 shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#ffae00]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE PLATFORM ADVANTAGES */}
      <section className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold text-[#ffae00] uppercase tracking-widest">
            THE MINI POST DIFFERENCE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Why Creators Choose Mini Post App
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We focus strictly on personal publishing efficiency, AI writing assistance, and platform-specific format compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Craft Once, Multiply</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Input one master idea and generate platform-optimized text for Facebook, Instagram, LinkedIn, X, and TikTok.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Consistent Voice</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Save your brand voice rules, target keywords, and visual templates to ensure tone consistency across all channels.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sub-Second AI Engine</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Google Gemini AI Flash for sub-second generation times and 95%+ semantic acceptance scoring.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Engineering Standards</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed with reference to ISO/IEC 27001 security, ISO/IEC 42001 AI governance, and AES-256 token encryption.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="text-center space-y-4 pt-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">Ready to Multiply Your Content Reach?</h2>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/trust-safety"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#ffae00] hover:underline"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Explore Trust, Safety & Engineering Standards</span>
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
