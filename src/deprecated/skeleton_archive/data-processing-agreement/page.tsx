import React from "react";
import { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Data Processing Agreement | Mini Post App",
  description: "Read the Data Processing Addendum / Agreement (DPA) outlining data processor obligations for Mini Post App under GDPR Article 28.",
  alternates: {
    canonical: "https://minipostapp.space/data-processing-agreement",
  },
  openGraph: {
    title: "Data Processing Agreement | Mini Post App",
    description: "Read the Data Processing Agreement (DPA) for Mini Post App.",
    url: "https://minipostapp.space/data-processing-agreement",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Data Processing Agreement | Mini Post App",
    description: "Read the Data Processing Agreement (DPA) for Mini Post App.",
  },
};

export default function DataProcessingAgreementPage() {
  return (
    <LegalLayout
      title="Data Processing Agreement (DPA)"
      subtitle="Standard agreement outlining data processing obligations under GDPR Article 28 for Mini Post App."
      lastUpdated="August 1, 2026"
    >
      <div className="space-y-6 text-slate-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Scope & Applicability</h2>
          <p>
            This Data Processing Agreement ("DPA") applies to the processing of personal data by Mini Post App (operated by Yoga Products Top Limited) as a Data Processor on behalf of customer account owners (the "Data Controller").
            This agreement is integrated into and forms an integral part of the Mini Post App Terms of Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Processing Instructions & Purpose</h2>
          <p>
            Mini Post App shall process personal data solely to provide, maintain, and optimize social media post adaptation, AI content generation, and multi-platform publishing features in accordance with the Controller's explicit instructions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Technical & Organizational Measures (TOMs)</h2>
          <p>
            We implement appropriate technical and organizational security controls to protect customer data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Encryption in transit using TLS 1.3 for all web traffic and API endpoints.</li>
            <li>AES-256 encryption at rest for stored OAuth tokens and database records.</li>
            <li>Multi-tenant Firestore database rule isolation preventing unauthorized data access.</li>
            <li>Role-Based Access Control (RBAC) restricting system administration functions.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Subprocessor Management</h2>
          <p>
            The Controller grants general authorization to Mini Post App to engage third-party infrastructure and service providers ("Subprocessors").
            A current list of subprocessors (including Google Cloud, Stripe, and Google AI) is available on our{" "}
            <a href="/subprocessors" className="text-amber-400 underline font-semibold">
              Subprocessors Page
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Erasure & Audits</h2>
          <p>
            Upon account termination or explicit erasure request, Mini Post App shall delete or return all customer personal data, unless applicable law requires continued retention of tax, accounting, or security records.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Legal Contact & DPA Execution</h2>
          <p>
            For executed DPA requests or enterprise compliance documentation, please contact our legal team at:
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
