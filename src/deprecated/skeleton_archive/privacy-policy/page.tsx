import React from "react";
import { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Mini Post App",
  description: "Learn how Mini Post App collects, protects, processes, and respects user data in compliance with GDPR, CCPA, and global data protection standards.",
  alternates: {
    canonical: "https://minipostapp.space/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Mini Post App",
    description: "Learn how Mini Post App collects, protects, and uses your personal data.",
    url: "https://minipostapp.space/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Mini Post App",
    description: "Learn how Mini Post App collects, protects, and uses your personal data.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How we collect, use, process, and protect your privacy and personal data at Mini Post App."
      lastUpdated="August 1, 2026"
    >
      <div className="space-y-6 text-slate-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Introduction & Scope</h2>
          <p>
            Welcome to Mini Post App (owned and operated by Yoga Products Top Limited). We are committed to protecting your personal data and respecting your privacy rights.
            This Privacy Policy explains how we collect, process, share, and safeguard your information when you use our AI-assisted social media content creation, adaptation, scheduling, and publishing platform (collectively, the "Service").
          </p>
          <p>
            Mini Post App is designed to support applicable data-protection requirements including the EU General Data Protection Regulation (GDPR), the UK Data Protection Act, and the California Consumer Privacy Act (CCPA).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Data Controller Information</h2>
          <p>
            The Data Controller responsible for your personal information is:
          </p>
          <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1">
            <p className="font-bold text-white">Yoga Products Top Limited</p>
            <p>Data Protection & Privacy Compliance Department</p>
            <p>
              Email:{" "}
              <a href="mailto:privacy@minipostapp.space" className="text-amber-400 underline font-semibold">
                privacy@minipostapp.space
              </a>
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Account & Profile Information:</strong> Email address, user name, profile configuration, and account preferences when registering.
            </li>
            <li>
              <strong className="text-white">Social Channel Connection Credentials:</strong> Encrypted OAuth access tokens, channel identifiers, and account handles required to format and publish posts to supported social platforms (Facebook, Instagram, LinkedIn, X, TikTok, YouTube).
            </li>
            <li>
              <strong className="text-white">User-Generated Content & Drafts:</strong> Master post ideas, brand assets, prompt templates, and custom post variants saved in your private workspace.
            </li>
            <li>
              <strong className="text-white">Billing & Subscription Details:</strong> Secure transaction records, payment plan tier, and invoice identifiers processed by our payment provider (Stripe). We do not store full credit card details on our servers.
            </li>
            <li>
              <strong className="text-white">Technical Telemetry & Usage Logs:</strong> IP address, device type, browser specifications, API error telemetry, and performance performance logs collected to ensure service stability.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Artificial Intelligence (AI) Content Processing</h2>
          <p>
            Mini Post App integrates with Google Gemini AI Flash architecture to power automated multi-platform post generation, tone adaptation, and caption formatting.
            When you process content through our AI features:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Input prompts and master post text are sent securely to Google AI servers for instantaneous generation.</li>
            <li>
              <strong>Zero AI Training Guarantee:</strong> Your private brand content, master ideas, and generated post copy are strictly isolated and are <strong>never used to train public AI models</strong>.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Cookies & Local Storage</h2>
          <p>
            We use essential cookies and browser local storage to maintain session states, secure account logins, store workspace layout preferences, and manage consent controls.
            Detailed information on cookie categories and consent management is available in our dedicated{" "}
            <a href="/cookie-policy" className="text-amber-400 underline font-semibold">
              Cookie Policy
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Your Data Subject Rights (GDPR & CCPA)</h2>
          <p>
            Under European data protection laws and global privacy regulations, you possess the following rights:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right of Access:</strong> Request a comprehensive export of your personal data held by Mini Post App.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate profile data.</li>
            <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request permanent deletion of your account and credentials via our <a href="/data-deletion" className="text-amber-400 underline">Data Deletion Page</a>.</li>
            <li><strong>Right to Restrict Processing:</strong> Request limits on how your personal data is utilized.</li>
            <li><strong>Right to Data Portability:</strong> Obtain a structured JSON/CSV export of your workspace posts and settings.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">7. Data Retention & Erasure Procedures</h2>
          <p>
            We retain account data for as long as your subscription remains active. When an account deletion is requested:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Connected social platform OAuth tokens are immediately revoked.</li>
            <li>Workspace drafts, master posts, and scheduled items are queued for permanent database removal.</li>
            <li>Complete data purge takes effect within 30 days, except where legal or financial audit laws require extended record retention.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">8. Privacy Contact Information</h2>
          <p>
            For privacy inquiries, Data Subject Access Requests (DSAR), or GDPR compliance questions, please contact our Data Protection Officer at:
          </p>
          <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-400">
            <a href="mailto:privacy@minipostapp.space" className="underline font-bold">
              privacy@minipostapp.space
            </a>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
