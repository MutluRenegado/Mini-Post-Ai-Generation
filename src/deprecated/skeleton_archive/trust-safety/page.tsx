import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Cpu,
  AlertTriangle,
  FileText,
  LifeBuoy,
  ArrowRight,
  CheckCircle2,
  Layers,
  Code2,
  CheckSquare,
  Globe2,
  Server,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trust, Safety & Engineering Standards | Mini Post App',
  description:
    'Mini Post App is engineered with reference to internationally recognized security, privacy, responsible AI, accessibility, cloud, and software quality standards.',
};

const standardsIndex = [
  { code: 'ISO/IEC 27001:2022', name: 'Information Security Management' },
  { code: 'ISO/IEC 42001:2023', name: 'Artificial Intelligence Management' },
  { code: 'ISO/IEC 23894:2023', name: 'AI Risk Management' },
  { code: 'ISO/IEC 27701:2025', name: 'Privacy Information Management' },
  { code: 'ISO/IEC 27017', name: 'Cloud Security Controls' },
  { code: 'ISO/IEC 27018:2025', name: 'Protection of Personal Data in Public Cloud' },
  { code: 'ISO/IEC 25010:2023', name: 'Software Product Quality' },
  { code: 'ISO 22301:2019', name: 'Business Continuity Management' },
  { code: 'ISO 31000:2018', name: 'Risk Management' },
  { code: 'ISO/IEC 40500:2012', name: 'Accessibility (WCAG)' },
  { code: 'WCAG 2.2 AA', name: 'Web Accessibility Guidelines' },
  { code: 'NIST AI RMF', name: 'AI Risk Management Framework' },
  { code: 'OWASP ASVS v4.0', name: 'Application Security Verification' },
  { code: 'SOC 2 Alignment', name: 'Trust Services Criteria' },
  { code: 'GDPR & CCPA', name: 'Data Privacy Protocols' },
  { code: 'Google Cloud WAF', name: 'Well-Architected Framework' },
];

export default function TrustAndSafetyPage() {
  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans p-4 sm:p-8 lg:p-12 space-y-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>TRUST, SAFETY & ENGINEERING STANDARDS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Trust, Safety & Engineering Standards
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed">
          At Mini Post App, we prioritize content safety, multi-tenant isolation, data encryption, transparent AI governance, and international engineering framework alignment across every social media integration.
        </p>
      </div>

      {/* FIRST VISIBLE SECTION: COMPREHENSIVE STANDARDS INDEX (ABOVE THE FOLD) */}
      <section className="space-y-6 pt-2">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            International Engineering Standards & Frameworks
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed">
            Mini Post App is designed with reference to internationally recognized engineering, cybersecurity, privacy, accessibility, cloud, software quality, business continuity, and responsible AI standards.
          </p>
        </div>

        {/* Compact Responsive Standards Wall Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {standardsIndex.map((item) => (
            <div
              key={item.code}
              className="bg-[#0b0f19] border border-[#1b2438] hover:border-amber-500/40 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between transition-all shadow-md group"
            >
              <div className="text-[11px] sm:text-xs font-mono font-bold text-amber-400 group-hover:text-amber-300 transition-colors tracking-tight">
                {item.code}
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-white leading-snug mt-1">
                {item.name}
              </div>
            </div>
          ))}
        </div>

        {/* Non-Certification Disclaimer */}
        <p className="text-[11px] text-slate-500 text-center max-w-3xl mx-auto leading-relaxed font-mono pt-2">
          * Mini Post App engineering practices are aligned with these internationally recognized standards and frameworks. Alignment describes design criteria and internal practices and does not constitute third-party certification or official endorsement.
        </p>
      </section>

      {/* DETAILED PILLARS SECTION */}
      <div className="pt-6 border-t border-[#1b2438] grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* 1. Responsible AI Use */}
        <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl hover:border-cyan-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Responsible AI Standards</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Our content engine is powered by Google Gemini AI Flash with strict safety guardrails. All output passes through 95% semantic acceptance scoring, fact-validation checks, and bias mitigation prior to platform export.
          </p>
          <ul className="space-y-2 text-xs text-slate-300 font-mono pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Human-in-the-loop content approval required</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Zero training on private customer data</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>95% minimum semantic quality threshold</span>
            </li>
          </ul>
        </div>

        {/* 2. Privacy & Data Protection */}
        <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl hover:border-purple-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Privacy & Security Standards</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            We employ AES-256 encryption at rest and TLS 1.3 in transit. All user sessions and API credentials (such as Stripe, Firebase, and Social OAuth tokens) are isolated in dedicated multi-tenant vaults.
          </p>
          <ul className="space-y-2 text-xs text-slate-300 font-mono pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>AES-256 encrypted credential storage</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Strict multi-tenant database rules</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>GDPR & CCPA compliant data handling</span>
            </li>
          </ul>
        </div>

        {/* 3. Content Safety & Prohibited Misuse */}
        <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl hover:border-emerald-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Content Safety Standards</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Mini Post App strictly prohibits spam generation, automated harassment, hate speech, explicit content, and deceptive deepfakes. Automated rate limiting prevents unauthorized platform flooding.
          </p>
          <ul className="space-y-2 text-xs text-slate-300 font-mono pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automated spam & hate speech filters</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Copyright & trademark protection rules</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Account suspension for policy violations</span>
            </li>
          </ul>
        </div>

        {/* 4. Platform Compliance */}
        <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl hover:border-amber-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Accessibility & Platform Standards</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Our application strictly adheres to developer API policies for Facebook, Meta, X, LinkedIn, YouTube, TikTok, and Pinterest. We maintain WCAG 2.2 AA accessibility standards for all user interfaces.
          </p>
          <ul className="space-y-2 text-xs text-slate-300 font-mono pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Official Developer API terms compliance</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>WCAG 2.2 AA contrast & keyboard navigation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Real-time API quota & rate limit monitors</span>
            </li>
          </ul>
        </div>
      </div>

      {/* DETAILED ENGINEERING STANDARDS SECTION */}
      <section
        id="engineering-standards"
        className="scroll-mt-36 pt-8 border-t border-[#1b2438] space-y-10"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>FRAMEWORK ALIGNMENT & ENGINEERING QUALITY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Detailed Framework Alignment
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed">
            Mini Post App is designed in alignment with internationally recognized engineering frameworks and official platform guidance to improve software quality, accessibility, responsible AI, security, cloud architecture, reliability, and publishing integrity.
          </p>
        </div>

        {/* 6 Framework Alignment Groups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Software Quality */}
          <div className="bg-[#0b0f19] border border-[#1b2438] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>SOFTWARE QUALITY</span>
            </div>
            <h3 className="text-base font-extrabold text-white">ISO/IEC 25010:2023 & Internal Quality</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Informed by ISO/IEC 25010 characteristics covering functional suitability, performance efficiency, compatibility, usability, and maintainability.
            </p>
          </div>

          {/* Accessibility */}
          <div className="bg-[#0b0f19] border border-[#1b2438] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-mono font-bold text-purple-400 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span>ACCESSIBILITY</span>
            </div>
            <h3 className="text-base font-extrabold text-white">WCAG 2.2 AA Target</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed in alignment with WCAG 2.2 AA guidelines enforcing minimum 4.5:1 text contrast ratios, 24px touch targets, and visible focus rings.
            </p>
          </div>

          {/* Application Security */}
          <div className="bg-[#0b0f19] border border-[#1b2438] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>APPLICATION SECURITY</span>
            </div>
            <h3 className="text-base font-extrabold text-white">OWASP ASVS Controls</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Targets OWASP Application Security Verification Standard controls for session management, input validation, and multi-tenant data protection.
            </p>
          </div>

          {/* Responsible AI */}
          <div className="bg-[#0b0f19] border border-[#1b2438] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>RESPONSIBLE AI</span>
            </div>
            <h3 className="text-base font-extrabold text-white">NIST AI RMF & 95% Semantic Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Informed by NIST AI Risk Management Framework safety guidelines and enforced via mandatory 95% minimum semantic acceptance validation.
            </p>
          </div>

          {/* Cloud Architecture */}
          <div className="bg-[#0b0f19] border border-[#1b2438] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>CLOUD ARCHITECTURE</span>
            </div>
            <h3 className="text-base font-extrabold text-white">Google Cloud Well-Architected</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed around operational excellence, reliability, security, and exponential backoff retry patterns for external API dispatch.
            </p>
          </div>

          {/* Platform & Publishing Alignment */}
          <div className="bg-[#0b0f19] border border-[#1b2438] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-mono font-bold text-pink-400 flex items-center gap-2">
              <Globe2 className="w-4 h-4" />
              <span>PLATFORM ALIGNMENT</span>
            </div>
            <h3 className="text-base font-extrabold text-white">Meta Policies & Search Essentials</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adheres to Meta Platform Policies, Google Search Essentials, and official channel-specific character and media limits.
            </p>
          </div>
        </div>

        {/* Engineering Commitment Subsection */}
        <div className="bg-[#0c101a] border border-[#1b2438] rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Engineering Commitments</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-cyan-400 font-bold">1. AI Quality</div>
              <p className="text-slate-400">Strict 95% semantic score validation before provider execution.</p>
            </div>
            <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-purple-400 font-bold">2. Security</div>
              <p className="text-slate-400">AES-256 encrypted credential vaults & input sanitization.</p>
            </div>
            <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-emerald-400 font-bold">3. Accessibility</div>
              <p className="text-slate-400">WCAG 2.2 AA contrast & keyboard-navigable UI design.</p>
            </div>
            <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-amber-400 font-bold">4. Reliability</div>
              <p className="text-slate-400">99.9% uptime architecture & automatic retry backoffs.</p>
            </div>
            <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-indigo-400 font-bold">5. Privacy</div>
              <p className="text-slate-400">Zero customer data training & multi-tenant isolation.</p>
            </div>
            <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-pink-400 font-bold">6. Compliance</div>
              <p className="text-slate-400">Official developer API terms & rate limit compliance.</p>
            </div>
            <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-cyan-300 font-bold">7. Performance</div>
              <p className="text-slate-400">Sub-second generation latency & optimized asset sizing.</p>
            </div>
            <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-emerald-300 font-bold">8. User Experience</div>
              <p className="text-slate-400">Intuitive responsive layout with real-time feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Action Card */}
      <div className="bg-gradient-to-br from-[#0e1424] to-[#12192e] border border-cyan-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mx-auto">
          <LifeBuoy className="w-7 h-7" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <h3 className="text-2xl font-black text-white">Reporting Misuse & Support</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            If you suspect a violation of our safety policies, or require technical support regarding account security, please reach out to our dedicated operations team immediately.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="mailto:support@minipostapp.space?subject=Customer%20Support%20Request&body=Hello%20Mini%20Post%20App%20Support%20Team,%0A%0AI%20need%20assistance%20with%20the%20following%20issue:%0A%0AIssue%20Category:%0A%0ADescription:%0A%0ASteps%20to%20reproduce%20(if%20applicable):%0A%0AThank%20you."
            className="w-full sm:w-auto px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Contact Customer Support</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-full transition-all"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
