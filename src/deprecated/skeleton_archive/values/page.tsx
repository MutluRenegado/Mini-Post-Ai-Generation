import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  Zap,
  Users,
  Lock,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Values & Principles | Mini Post App',
  description:
    'Explore the core values, engineering standards, privacy rules, and creator-first principles that guide Mini Post App.',
};

const valuesPillars = [
  {
    title: 'Creator-First Utility',
    subtitle: 'Efficiency Above All',
    description:
      'We believe software should reduce friction, eliminate repetitive reformatting, and give creators their time back. Every feature we build is judged by how much time it saves creators and solopreneurs.',
    icon: Zap,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  {
    title: 'Authentic Brand Voice',
    subtitle: 'AI That Enhances, Not Sanitizes',
    description:
      'Artificial intelligence should amplify your unique perspective, not homogenize it into generic corporate jargon. Our prompt engines respect your custom brand kit rules and voice guidelines on every platform.',
    icon: Heart,
    color: 'text-pink-400',
    borderColor: 'border-pink-500/30',
  },
  {
    title: 'Engineering Excellence & Reliability',
    subtitle: 'Reference-Backed Architecture',
    description:
      'Designed with reference to ISO/IEC 25010 product quality models and ISO 22301 operational continuity standards. We build high-throughput Next.js systems to guarantee reliable, sub-second generation times.',
    icon: Cpu,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
  },
  {
    title: 'Responsible AI & Transparency',
    subtitle: 'Zero Private Data Model Training',
    description:
      'Powered by Google Gemini AI Flash architecture with strict privacy bounds. Your master ideas, brand kits, and draft posts are never used to train third-party public AI models.',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  {
    title: 'Privacy & Token Vault Encryption',
    subtitle: 'AES-256 Vault Protections',
    description:
      'Your social media OAuth tokens, credentials, and published content are encrypted with AES-256 bit encryption at rest and TLS 1.3 in transit, protected by strict multi-tenant isolation.',
    icon: Lock,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
  },
  {
    title: 'Inclusivity & Accessibility',
    subtitle: 'WCAG 2.2 AA Alignment',
    description:
      'We design our web interface with reference to WCAG 2.2 AA standards so creators, freelancers, and marketers of all abilities can navigate our platform effortlessly.',
    icon: Users,
    color: 'text-amber-300',
    borderColor: 'border-amber-500/30',
  },
];

export default function ValuesPage() {
  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans p-4 sm:p-8 lg:p-12 space-y-16 max-w-6xl mx-auto">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#ffae00] text-xs font-mono font-bold uppercase tracking-widest">
          <Heart className="w-4 h-4 text-[#ffae00]" />
          <span>OUR VALUES & PRINCIPLES</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Built on Integrity, Quality & Creator Empowerment
        </h1>

        <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
          Our core values guide every line of code we write, every AI model we integrate, and every publishing workflow feature we deliver to our creators and business users.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/trust-safety"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#ffae00] hover:bg-[#ffd066] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Engineering Standards</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/company"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-full transition-all"
          >
            About Our Company
          </Link>
        </div>
      </section>

      {/* CORE VALUES PILLARS (6-CARD GRID) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {valuesPillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="bg-[#0c101a] border border-[#1b2438] hover:border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl bg-slate-900 border ${pillar.borderColor} flex items-center justify-center ${pillar.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#ffae00] uppercase tracking-wider block mb-1">
                    {pillar.subtitle}
                  </span>
                  <h3 className="text-lg font-extrabold text-white">{pillar.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* ENGINEERING IDENTITY & TRUST BANNER */}
      <section className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl text-center max-w-4xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ffae00] mx-auto">
          <Award className="w-7 h-7" />
        </div>
        <div className="space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-white">Engineering Quality You Can Trust</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Mini Post App is engineered with reference to internationally recognized standards for information security (ISO 27001), AI governance (ISO 42001), software product quality (ISO 25010), and business continuity (ISO 22301).
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/trust-safety#engineering-standards"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#ffae00] hover:underline"
          >
            <span>View Complete International Engineering Standards Index</span>
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
