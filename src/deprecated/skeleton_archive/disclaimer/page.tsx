import React from "react";
import { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Disclaimer | Mini Post App",
  description: "Read the AI content adaptation disclaimer and platform liability terms for Mini Post App.",
  alternates: {
    canonical: "https://minipostapp.space/disclaimer",
  },
  openGraph: {
    title: "Disclaimer | Mini Post App",
    description: "Read the AI disclaimer and platform liability terms for Mini Post App.",
    url: "https://minipostapp.space/disclaimer",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Disclaimer | Mini Post App",
    description: "Read the AI disclaimer and platform liability terms for Mini Post App.",
  },
};

export default function DisclaimerPage() {
  return (
    <LegalLayout
      title="Platform Disclaimer"
      subtitle="Important notifications regarding AI recommendations, content accuracy, and user liability."
      lastUpdated="August 1, 2026"
    >
      <div className="space-y-6 text-slate-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. AI Content & Adaptation Disclaimer</h2>
          <p className="border-l-4 border-amber-500/50 pl-4 py-2 bg-amber-500/5 text-amber-200 rounded-r-lg">
            <strong>IMPORTANT NOTICE:</strong> AI-generated copy, caption adaptations, hashtag suggestions, and content formatting powered by Google Gemini AI Flash on Mini Post App are provided for assistance purposes. They may occasionally contain factual errors, inaccuracies, or unexpected wording.
          </p>
          <p>
            Users are solely responsible for reviewing, editing, verifying, and approving all content before publishing to connected social media accounts.
            Mini Post App (owned and operated by Yoga Products Top Limited) is not responsible for brand reputation issues, engagement levels, or social media platform actions resulting from published AI content.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Third-Party Social Media Platforms & API Changes</h2>
          <p>
            Mini Post App connects to third-party social media APIs including Meta (Facebook & Instagram), LinkedIn, X (Twitter), TikTok, YouTube, and Stripe.
            Third-party platforms enforce their own terms of service, API access limits, quota restrictions, and privacy protocols.
            Mini Post App is not liable for third-party platform outages, API policy modifications, rate limit restrictions, or external account suspensions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. External Links Disclaimer</h2>
          <p>
            Our website and application may contain links to external third-party websites or resources.
            Mini Post App does not control, endorse, or guarantee the accuracy, security, or privacy policies of third-party external websites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. No Legal or Compliance Guarantee</h2>
          <p>
            Information and recommendations provided on Mini Post App do not constitute formal legal, regulatory, or financial advice.
            Users remain responsible for ensuring their published content complies with local advertising standards, copyright laws, and privacy regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. General Inquiries & Contact</h2>
          <p>
            If you have questions regarding this disclaimer, please contact us at:
          </p>
          <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-400">
            <a href="mailto:info@minipostapp.space" className="underline font-bold">
              info@minipostapp.space
            </a>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
