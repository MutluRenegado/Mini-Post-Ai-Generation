import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, FileText, Lock, Cookie, Trash2, Shield, Scale, Server, ArrowRight, ExternalLink } from "lucide-react";
import LegalLayout from "@/components/legal/LegalLayout";
import { DynamicCard } from "@/components/ui/DynamicCard";

export const metadata: Metadata = {
  title: "Legal Center | Mini Post App",
  description: "Central Legal Directory for Mini Post App. Access Privacy Policy, Terms of Service, Cookie Policy, Data Deletion, GDPR Information, DPA, Security, and Subprocessors.",
  alternates: {
    canonical: "https://minipostapp.space/legal",
  },
  openGraph: {
    title: "Legal Center | Mini Post App",
    description: "Central Legal Directory for Mini Post App.",
    url: "https://minipostapp.space/legal",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Legal Center | Mini Post App",
    description: "Central Legal Directory for Mini Post App.",
  },
};

const LEGAL_DOCUMENTS = [
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    icon: ShieldCheck,
    description: "Detailed breakdown of user data protection, AES-256 vault encryption, processing activities, and privacy rights.",
  },
  {
    title: "Terms of Service",
    href: "/terms-of-service",
    icon: Scale,
    description: "The binding legal agreement governing SaaS usage, subscription plans, acceptable use rules, and platform licensing.",
  },
  {
    title: "Cookie Policy",
    href: "/cookie-policy",
    icon: Cookie,
    description: "Comprehensive information on essential cookies, local storage keys, session states, and preference controls.",
  },
  {
    title: "Data Deletion Request",
    href: "/data-deletion",
    icon: Trash2,
    description: "Public instructions and secure account erasure request workflow for purging account data and OAuth channel tokens.",
  },
  {
    title: "Platform Disclaimer",
    href: "/disclaimer",
    icon: FileText,
    description: "Important notifications concerning AI copy recommendations, third-party social media APIs, and accuracy disclaimers.",
  },
  {
    title: "GDPR Information",
    href: "/gdpr",
    icon: Shield,
    description: "Overview of European & UK data protection rights (DSAR), legal processing bases, and 72-hour breach notifications.",
  },
  {
    title: "Data Processing Agreement",
    href: "/data-processing-agreement",
    icon: FileText,
    description: "Article 28 GDPR addendum detailing technical & organizational security controls (TOMs) and processor obligations.",
  },
  {
    title: "Security & Trust Disclosure",
    href: "/security",
    icon: Lock,
    description: "Technical security controls, TLS 1.3 encryption in transit, AES-256 storage isolation, and vulnerability disclosures.",
  },
  {
    title: "Subprocessors Directory",
    href: "/subprocessors",
    icon: Server,
    description: "Authorized third-party infrastructure and service providers (Google Cloud, Stripe, Google AI) used by Mini Post App.",
  },
];

export default function LegalCenterPage() {
  return (
    <LegalLayout
      title="Legal & Compliance Center"
      subtitle="Central directory of all official legal agreements, privacy policies, data protection addenda, and security disclosures for Mini Post App."
      lastUpdated="August 1, 2026"
    >
      <div className="space-y-8 text-slate-300">
        <section className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            Mini Post App (owned and operated by <strong className="text-white font-bold">Yoga Products Top Limited</strong>) provides complete transparency regarding legal conditions, user data protection, privacy rights, and security standards. Select any document below to view its full legal text.
          </p>
        </section>

        {/* Directory Grid of Independent Legal Pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {LEGAL_DOCUMENTS.map((doc) => {
            const Icon = doc.icon;
            return (
              <DynamicCard
                key={doc.href}
                href={doc.href}
                interactive
                level={3}
                className="p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform duration-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h2 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {doc.title}
                      </h2>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {doc.description}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-amber-400/90">
                  <span className="font-semibold">View Independent Document</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </DynamicCard>
            );
          })}
        </div>

        {/* Official Contact Section Card */}
        <div className="mt-10 rounded-2xl border border-slate-800/90 bg-[#070a12] p-6 sm:p-8 space-y-5 shadow-lg">
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Official Legal Contact Directory</h2>
            <p className="text-xs text-slate-400 mt-1">Direct contextual contact email addresses for inquiries and formal notices.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs text-slate-400">
            <div className="p-3 rounded-lg bg-[#040609] border border-slate-800/60 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Legal Notices & Terms:</span>
              <a href="mailto:legal@minipostapp.space" className="text-amber-400 hover:underline font-bold">
                legal@minipostapp.space
              </a>
            </div>
            <div className="p-3 rounded-lg bg-[#040609] border border-slate-800/60 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Privacy & GDPR:</span>
              <a href="mailto:privacy@minipostapp.space" className="text-amber-400 hover:underline font-bold">
                privacy@minipostapp.space
              </a>
            </div>
            <div className="p-3 rounded-lg bg-[#040609] border border-slate-800/60 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Data Deletion:</span>
              <a href="mailto:deletion@minipostapp.space" className="text-amber-400 hover:underline font-bold">
                deletion@minipostapp.space
              </a>
            </div>
            <div className="p-3 rounded-lg bg-[#040609] border border-slate-800/60 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Security Reports:</span>
              <a href="mailto:security@minipostapp.space" className="text-amber-400 hover:underline font-bold">
                security@minipostapp.space
              </a>
            </div>
            <div className="p-3 rounded-lg bg-[#040609] border border-slate-800/60 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Billing Questions:</span>
              <a href="mailto:billing@minipostapp.space" className="text-amber-400 hover:underline font-bold">
                billing@minipostapp.space
              </a>
            </div>
            <div className="p-3 rounded-lg bg-[#040609] border border-slate-800/60 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">General Inquiries:</span>
              <a href="mailto:info@minipostapp.space" className="text-amber-400 hover:underline font-bold">
                info@minipostapp.space
              </a>
            </div>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}
