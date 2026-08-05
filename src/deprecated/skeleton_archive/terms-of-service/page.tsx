import React from "react";
import { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Mini Post App",
  description: "Read the Terms of Service governing your use of Mini Post App, SaaS subscription rules, AI content conditions, and legal policies.",
  alternates: {
    canonical: "https://minipostapp.space/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service | Mini Post App",
    description: "Read the Terms of Service for using Mini Post App.",
    url: "https://minipostapp.space/terms-of-service",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | Mini Post App",
    description: "Read the Terms of Service for using Mini Post App.",
  },
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="The legal agreement governing your access to and use of the Mini Post App platform."
      lastUpdated="August 1, 2026"
    >
      <div className="space-y-6 text-slate-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
          <p>
            By accessing, creating an account, or using Mini Post App (owned and operated by Yoga Products Top Limited), you enter into a legally binding agreement subject to these Terms of Service.
            If you do not agree to all terms, you may not access or use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. SaaS License & Acceptable Use</h2>
          <p>
            We grant you a revocable, non-exclusive, non-transferable, limited license to access and use Mini Post App in accordance with your active subscription plan.
          </p>
          <p>
            You agree not to use Mini Post App to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Generate or publish illegal, abusive, harassing, defamatory, or harmful content.</li>
            <li>Distribute automated spam, unauthorized marketing broadcasts, or malicious scripts across connected social channels.</li>
            <li>Attempt to reverse-engineer, decompile, or extract source code from the platform or underlying AI modules.</li>
            <li>Violate API terms of service set by external social media platforms (Facebook, Instagram, LinkedIn, X, TikTok, YouTube).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Subscriptions, Payments & Billing</h2>
          <p>
            Mini Post App offers free tiers and paid subscription plans billed on a recurring monthly or annual basis.
            All payment transactions are processed securely through Stripe.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Subscribers are responsible for keeping payment information current.</li>
            <li>Failure to process subscription renewals may result in feature restriction or account suspension.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Refund Policy</h2>
          <p>
            Paid plan subscriptions are non-refundable for billing cycles already commenced.
            If you cancel your subscription, you will retain access to paid features until the conclusion of your current paid billing period.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Intellectual Property & User Content</h2>
          <p>
            You retain all ownership rights over your master ideas, custom text inputs, brand kits, and posts created using Mini Post App.
            Yoga Products Top Limited owns all rights, title, and interest in the Mini Post App software, interface design, algorithms, and brand assets.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. AI Content Generation Disclaimer</h2>
          <p>
            Mini Post App uses Google Gemini AI technology to assist with content adaptation and generation.
            AI-generated copy and formatting suggestions are provided "as-is". You acknowledge that you are solely responsible for reviewing and verifying all generated content prior to social media publication.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Mini Post App and Yoga Products Top Limited shall not be liable for any indirect, incidental, consequential, or punitive damages, including loss of profits, social platform account suspensions, or third-party API downtime.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">8. Formal Legal Notices</h2>
          <p>
            For legal notices, formal legal inquiries, or contractual communications, please contact our legal department at:
          </p>
          <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-400">
            <a href="mailto:legal@minipostapp.space" className="underline font-bold">
              legal@minipostapp.space
            </a>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
