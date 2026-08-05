import React from "react";
import { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Security | Mini Post App",
  description: "Learn about the technical security controls, AES-256 encryption, access management, and vulnerability disclosures at Mini Post App.",
  alternates: {
    canonical: "https://minipostapp.space/security",
  },
  openGraph: {
    title: "Security | Mini Post App",
    description: "Learn about the technical security controls of Mini Post App.",
    url: "https://minipostapp.space/security",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Security | Mini Post App",
    description: "Learn about the technical security controls of Mini Post App.",
  },
};

export default function SecurityPage() {
  return (
    <LegalLayout
      title="Security & Trust Disclosure"
      subtitle="Overview of application protection strategies, AES-256 encryption, and multi-tenant containment."
      lastUpdated="August 1, 2026"
    >
      <div className="space-y-6 text-slate-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Data Encryption in Transit & At Rest</h2>
          <p>
            All connection requests to Mini Post App (operated by Yoga Products Top Limited) are encrypted in transit using Transport Layer Security (TLS 1.3) protocols.
            Stored database records, OAuth channel tokens, and media files are encrypted at rest using AES-256 bit encryption within Google Cloud Platform infrastructure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Database Security & Tenant Isolation</h2>
          <p>
            We enforce database security rules inside Cloud Firestore. Client-side browser code is denied direct write access to critical collections.
            System interactions flow through authenticated, rate-limited backend endpoints to prevent script injections and cross-tenant data leaks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. OAuth Credential Vaulting</h2>
          <p>
            Social media connection credentials for Facebook, Instagram, LinkedIn, X, TikTok, and YouTube are stored in isolated encrypted vaults.
            Access tokens are utilized strictly for executing requested post formatting and publishing workflows.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Zero AI Training & Content Privacy</h2>
          <p>
            Private master concepts, prompt inputs, and post variants processed through Google Gemini AI Flash are strictly contained.
            Your proprietary brand assets and generated copy are never shared with public model training pools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Vulnerability Disclosure & Security Contact</h2>
          <p>
            We perform continuous dependency checks and code security reviews. If you discover a potential vulnerability or security flaw, please report it to our security response team at:
          </p>
          <div className="bg-[#05070c] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-400">
            <a href="mailto:security@minipostapp.space" className="underline font-bold">
              security@minipostapp.space
            </a>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
