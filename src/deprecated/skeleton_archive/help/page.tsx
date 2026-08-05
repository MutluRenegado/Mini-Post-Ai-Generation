'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Rocket,
  Wand2,
  CreditCard,
  Share2,
  ShieldCheck,
  LifeBuoy,
  AlertTriangle,
  LogIn,
  Send,
  Image as ImageIcon,
  LayoutTemplate,
  Activity,
  FileText,
  ArrowRight,
  Mail,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const CUSTOMER_SUPPORT_MAILTO =
  'mailto:support@minipostapp.space?subject=Customer%20Support%20Request&body=Hello%20Mini%20Post%20App%20Support%20Team,%0A%0AI%20need%20assistance%20with%20the%20following%20issue:%0A%0AIssue%20Category:%0A%0ADescription:%0A%0ASteps%20to%20reproduce%20(if%20applicable):%0A%0AThank%20you.';

const quickHelpCards = [
  {
    icon: Rocket,
    title: 'Getting Started',
    description: 'Learn how to create your first post and publish across multiple platforms.',
    href: '/tour',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  {
    icon: Wand2,
    title: 'Creator Studio',
    description: 'Understand templates, AI generation, standards, workflows, and publishing.',
    href: '/dashboard',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
  },
  {
    icon: CreditCard,
    title: 'Account & Billing',
    description: 'Subscriptions, usage limits, payments, invoices, and account management.',
    href: '/subscribe',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: Share2,
    title: 'Publishing',
    description: 'Connecting social platforms, scheduling posts, and troubleshooting publishing issues.',
    href: '/dashboard/fast-post',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  {
    icon: ShieldCheck,
    title: 'Trust, Safety & Engineering Standards',
    description: 'Learn about our engineering standards, security practices, privacy, accessibility, and responsible AI.',
    href: '/trust-safety',
    color: 'text-amber-300',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  {
    icon: LifeBuoy,
    title: 'Customer Support',
    description: 'Need additional help? Reach out directly to our support team.',
    href: CUSTOMER_SUPPORT_MAILTO,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
  },
];

const faqData = [
  {
    question: 'How do I create my first post?',
    answer:
      'Open the Creator Studio from your dashboard or click "Go To Dashboard". Select your desired template or enter your core master idea, choose your target platforms (Facebook, Instagram, LinkedIn, X, TikTok), and click "Generate". Our Gemini Flash AI will instantly produce platform-native adaptations.',
  },
  {
    question: 'Which social platforms are supported?',
    answer:
      'Mini Post App natively supports Facebook Pages & Groups, Instagram Feed & Stories, LinkedIn Posts & Professional Articles, X (Twitter) Threads, and TikTok / YouTube Shorts scripts.',
  },
  {
    question: 'How does AI content generation work?',
    answer:
      'Our engine integrates directly with Google Gemini AI Flash architecture. It reformats your core message, adjusts character limits, formats hashtags, and adapts tone for each platform in sub-second response times with 95% minimum semantic acceptance validation.',
  },
  {
    question: 'How do I connect my social accounts?',
    answer:
      'Navigate to Dashboard Settings or Creator Studio Channel Connections. Click "Connect Channel" for your desired platform and authenticate via official OAuth 2.0. All tokens are encrypted using AES-256 vault storage.',
  },
  {
    question: 'Why can’t I publish a post?',
    answer:
      'Publishing failures usually happen if an OAuth connection token has expired or if platform rate limits are reached. Try re-connecting your social channel under Settings, or contact our support team for assistance.',
  },
  {
    question: 'How do subscriptions work?',
    answer:
      'We offer flexible monthly and annual plans managed securely via Stripe. Subscriptions grant access to higher generation quotas, 7-step pipeline studio features, and visual content calendar scheduling.',
  },
  {
    question: 'How can I contact support?',
    answer:
      'You can email support@minipostapp.space directly or click Customer Support to launch your email client with a prefilled support template. Our team responds within one business day (Monday–Friday).',
  },
  {
    question: 'Where can I read the engineering standards?',
    answer:
      'Visit our Trust, Safety & Engineering Standards Center (/trust-safety) to explore our engineering framework alignment including ISO/IEC 27001, ISO/IEC 42001, ISO/IEC 25010, ISO 22301, WCAG 2.2 AA, and NIST AI RMF.',
  },
];

const troubleshootingLinks = [
  { title: 'AI Generation Issues', icon: Wand2, href: CUSTOMER_SUPPORT_MAILTO },
  { title: 'Login Problems', icon: LogIn, href: '/login' },
  { title: 'Publishing Errors', icon: Send, href: CUSTOMER_SUPPORT_MAILTO },
  { title: 'Image Generation Issues', icon: ImageIcon, href: CUSTOMER_SUPPORT_MAILTO },
  { title: 'Template Problems', icon: LayoutTemplate, href: '/dashboard/fast-post' },
  { title: 'Performance Issues', icon: Activity, href: CUSTOMER_SUPPORT_MAILTO },
];

const documentationLinks = [
  { label: 'Creator Studio Guide', href: '/dashboard' },
  { label: 'AI Content Guide', href: '/dev-workspace' },
  { label: 'Platform Standards', href: '/trust-safety' },
  { label: 'Engineering Standards', href: '/trust-safety#engineering-standards' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Disclaimer', href: '/disclaimer' },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans p-4 sm:p-8 lg:p-12 space-y-16 max-w-6xl mx-auto">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#ffae00] text-xs font-mono font-bold uppercase tracking-widest">
          <HelpCircle className="w-4 h-4 text-[#ffae00]" />
          <span>HELP & SUPPORT CENTER</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Help Center
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
          Find answers, explore documentation, troubleshoot common issues, and get support from the Mini Post App team.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={CUSTOMER_SUPPORT_MAILTO}
            className="w-full sm:w-auto px-6 py-3 bg-[#ffae00] hover:bg-[#ffd066] text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Contact Customer Support</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/dev-workspace"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-full transition-all"
          >
            Browse Documentation
          </Link>
        </div>
      </section>

      {/* QUICK HELP CARDS (6-CARD GRID) */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Quick Help & Resources</h2>
          <p className="text-xs sm:text-sm text-slate-400">Select a category to find guidance and feature walkthroughs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickHelpCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="bg-[#0c101a] border border-[#1b2438] hover:border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-xl transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl ${card.bgColor} border ${card.borderColor} flex items-center justify-center ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-[#ffae00] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-[#ffae00] flex items-center gap-1 pt-2">
                  <span>Explore</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (SEARCHABLE ACCORDION) */}
      <section className="space-y-6 pt-4 border-t border-[#1b2438]">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Search our knowledge base for answers to common questions.
          </p>

          {/* Search Input Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g. publishing, AI, billing)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0c101a] border border-[#1b2438] focus:border-[#ffae00] text-slate-100 placeholder-slate-500 rounded-2xl text-xs sm:text-sm outline-none transition-colors"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3 pt-2">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.question}
                  className="bg-[#0c101a] border border-[#1b2438] hover:border-amber-500/30 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
                  >
                    <span className="text-sm font-extrabold text-white">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#ffae00] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-900">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs font-mono">
              No matching questions found for &quot;{searchTerm}&quot;. Please contact support for help.
            </div>
          )}
        </div>
      </section>

      {/* TROUBLESHOOTING QUICK LINKS */}
      <section className="space-y-6 pt-4 border-t border-[#1b2438]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Troubleshooting Quick Links</h2>
          <p className="text-xs sm:text-sm text-slate-400">Direct shortcuts to resolve specific technical topics.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {troubleshootingLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="bg-[#0c101a] border border-[#1b2438] hover:border-[#ffae00]/40 rounded-2xl p-4 flex items-center gap-3 transition-all group"
              >
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[#ffae00] shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* DOCUMENTATION LINKS */}
      <section className="space-y-6 pt-4 border-t border-[#1b2438]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Documentation & Legal Center</h2>
          <p className="text-xs sm:text-sm text-slate-400">Explore our guides, engineering alignment, and legal compliance pages.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {documentationLinks.map((doc) => (
            <Link
              key={doc.label}
              href={doc.href}
              className="px-4 py-2.5 bg-[#0c101a] border border-[#1b2438] hover:border-amber-500/40 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-[#ffae00]" />
              <span>{doc.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CONTACT SUPPORT CARD */}
      <section className="pt-4 border-t border-[#1b2438]">
        <div className="bg-gradient-to-br from-[#0c101a] to-[#121827] border border-amber-500/30 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl max-w-4xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ffae00] mx-auto">
            <LifeBuoy className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-black text-white">Need Personal Assistance?</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Our dedicated engineering and support operations team is standing by to help with account, publishing, or API integration inquiries.
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-2 max-w-3xl mx-auto">
            <a
              href={CUSTOMER_SUPPORT_MAILTO}
              className="bg-[#05070c] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 space-y-1 transition-colors block cursor-pointer"
            >
              <div className="text-[#ffae00] font-bold flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Support Email</span>
              </div>
              <p className="text-slate-300 font-semibold underline">support@minipostapp.space</p>
            </a>

            <div className="bg-[#05070c] border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-cyan-400 font-bold flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Support Hours</span>
              </div>
              <p className="text-slate-300 font-semibold">Monday – Friday</p>
            </div>

            <div className="bg-[#05070c] border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Response Time</span>
              </div>
              <p className="text-slate-300 font-semibold">Within 1 Business Day</p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={CUSTOMER_SUPPORT_MAILTO}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#ffae00] hover:bg-[#ffd066] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Send Customer Support Email</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
