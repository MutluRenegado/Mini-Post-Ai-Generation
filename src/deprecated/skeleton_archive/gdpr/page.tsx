import React from "react";
import { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "GDPR Information | Mini Post App",
  description: "Learn about GDPR and UK-GDPR compliance measures, Data Subject Access Rights (DSAR), and privacy standards at Mini Post App.",
  alternates: {
    canonical: "https://minipostapp.space/gdpr",
  },
  openGraph: {
    title: "GDPR Information | Mini Post App",
    description: "Learn about the GDPR compliance measures of Mini Post App.",
    url: "https://minipostapp.space/gdpr",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GDPR Information | Mini Post App",
    description: "Learn about the GDPR compliance measures of Mini Post App.",
  },
};

export default function GDPRPage() {
  return (
    <LegalLayout
      title="GDPR & UK-GDPR Information"
      subtitle="How Mini Post App is designed to support European and UK data protection requirements."
      lastUpdated="August 1, 2026"
    >
      <div className="space-y-6 text-slate-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Data Subject Access Rights (DSAR)</h2>
          <p>
            Under the EU General Data Protection Regulation (GDPR) and UK-GDPR, individuals within the European Economic Area (EEA) and the United Kingdom possess specific legal rights regarding their personal data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right to be Informed (Article 13/14):</strong> Transparent details on how Mini Post App (operated by Yoga Products Top Limited) processes personal data.</li>
            <li><strong>Right of Access (Article 15):</strong> Request a copy of all personal records held in your account profile.</li>
            <li><strong>Right to Rectification (Article 16):</strong> Update inaccurate or incomplete account details.</li>
            <li><strong>Right to Erasure (Article 17):</strong> Request permanent deletion of your profile and OAuth credentials via our <a href="/data-deletion" className="text-amber-400 underline">Data Deletion Page</a>.</li>
            <li><strong>Right to Data Portability (Article 20):</strong> Request your data in a structured, machine-readable JSON format.</li>
            <li><strong>Right to Object (Article 21):</strong> Object to processing based on legitimate interest or direct marketing.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Lawful Basis for Processing</h2>
          <p>
            We process personal data only when a valid lawful basis exists under GDPR Article 6:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Contract Performance (Article 6(1)(b)):</strong> Necessary to provide user accounts, generate social media post variants, and execute publishing schedules.</li>
            <li><strong>Legitimate Interest (Article 6(1)(f)):</strong> Necessary to secure system infrastructure, prevent fraud, and maintain service performance.</li>
            <li><strong>Legal Obligation (Article 6(1)(c)):</strong> Retaining tax and billing records required under accounting legislation.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Security Measures & Storage Isolation</h2>
          <p>
            All data stored by Mini Post App is hosted in Google Cloud Platform / Firebase infrastructure with AES-256 vault encryption at rest and TLS 1.3 encryption in transit. Strict database security rules deny direct browser write access to sensitive collections.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Incident Response & Breach Notification</h2>
          <p>
            In the event of a verified security incident involving customer personal data, Mini Post App will notify impacted customers and relevant supervisory authorities without undue delay and within <strong>72 hours</strong> of confirmation, in accordance with GDPR Article 33.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Submitting a GDPR Request</h2>
          <p>
            To submit a Data Subject Access Request (DSAR) or inquire about GDPR rights, contact our Data Protection Officer at:
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
