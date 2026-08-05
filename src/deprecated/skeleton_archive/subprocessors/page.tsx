import React from "react";
import { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Subprocessors | Mini Post App",
  description: "View the list of active third-party subprocessors and service providers used by Mini Post App.",
  alternates: {
    canonical: "https://minipostapp.space/subprocessors",
  },
  openGraph: {
    title: "Subprocessors | Mini Post App",
    description: "View the list of active third-party subprocessors used by Mini Post App.",
    url: "https://minipostapp.space/subprocessors",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Subprocessors | Mini Post App",
    description: "View the list of active third-party subprocessors used by Mini Post App.",
  },
};

export default function SubprocessorsPage() {
  return (
    <LegalLayout
      title="Subprocessors Directory"
      subtitle="Third-party service providers authorized to process data on behalf of Mini Post App."
      lastUpdated="August 1, 2026"
    >
      <div className="space-y-6 text-slate-300">
        <p>
          Mini Post App (operated by Yoga Products Top Limited) contracts with vetted third-party service providers ("Subprocessors") to perform cloud hosting, database storage, payment processing, transactional communications, and AI text generation activities necessary to operate the platform.
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#05070c] p-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Subprocessor</th>
                <th className="py-3 px-3">Processing Purpose</th>
                <th className="py-3 px-3">Data Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr>
                <td className="py-3.5 px-3 font-bold text-white">Google Cloud Platform & Firebase</td>
                <td className="py-3.5 px-3">Web app hosting, Cloud Firestore database, user authentication, and encrypted media storage infrastructure.</td>
                <td className="py-3.5 px-3 font-mono text-[11px]">United States / Europe</td>
              </tr>
              <tr>
                <td className="py-3.5 px-3 font-bold text-white">Google AI (Gemini AI Flash)</td>
                <td className="py-3.5 px-3">Multi-platform post text generation, tone adaptation, and caption optimization.</td>
                <td className="py-3.5 px-3 font-mono text-[11px]">United States</td>
              </tr>
              <tr>
                <td className="py-3.5 px-3 font-bold text-white">Stripe Inc.</td>
                <td className="py-3.5 px-3">PCI-DSS compliant subscription payment processing, card billing, and checkout gateway.</td>
                <td className="py-3.5 px-3 font-mono text-[11px]">United States</td>
              </tr>
              <tr>
                <td className="py-3.5 px-3 font-bold text-white">Resend / Email Services</td>
                <td className="py-3.5 px-3">Transactional system emails, password reset routing, and account notification dispatch.</td>
                <td className="py-3.5 px-3 font-mono text-[11px]">United States</td>
              </tr>
            </tbody>
          </table>
        </div>

        <section className="space-y-3 pt-2">
          <h2 className="text-xl font-bold text-white">Updates to Subprocessors</h2>
          <p>
            When we engage new subprocessors that process customer personal data, we update this directory.
            For questions regarding subprocessor compliance or data processing addenda, contact:{" "}
            <a href="mailto:privacy@minipostapp.space" className="text-amber-400 underline font-semibold">
              privacy@minipostapp.space
            </a>.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
