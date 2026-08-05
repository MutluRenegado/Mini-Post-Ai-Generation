import React from "react";
import { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie Policy | Mini Post App",
  description: "Learn about the cookies, browser storage, and tracking technologies used on Mini Post App.",
  alternates: {
    canonical: "https://minipostapp.space/cookie-policy",
  },
  openGraph: {
    title: "Cookie Policy | Mini Post App",
    description: "Learn about the cookies and storage systems used on Mini Post App.",
    url: "https://minipostapp.space/cookie-policy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cookie Policy | Mini Post App",
    description: "Learn about the cookies and storage systems used on Mini Post App.",
  },
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="Details on how Mini Post App uses cookies, local storage, and session tokens."
      lastUpdated="August 1, 2026"
    >
      <div className="space-y-6 text-slate-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. What are Cookies and Local Storage?</h2>
          <p>
            Cookies and browser local storage are small text files and storage keys saved on your browser or mobile device when accessing Mini Post App (operated by Yoga Products Top Limited).
            They allow us to maintain your authenticated login session, preserve UI preferences, protect against security threats, and optimize platform performance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Categorized Cookies We Use</h2>
          <p>
            Cookies on Mini Post App are grouped into the following categories:
          </p>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong className="text-white">Strictly Necessary Cookies (Always Active):</strong> Essential for the operation of the web application. 
              These handle Firebase authentication tokens, route security, session state persistence, CSRF protection, and secure checkout navigation.
            </li>
            <li>
              <strong className="text-white">Preference & Functional Storage:</strong> Local storage keys used to store active workspace choices, dark mode settings, prompt builder presets, and UI sidebar state.
            </li>
            <li>
              <strong className="text-white">Performance & Analytics Telemetry:</strong> Aggregated, non-personally identifiable performance metrics used to measure API latency, page load speed, and client error rates for continuous platform reliability.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Third-Party Integrations & Cookies</h2>
          <p>
            When using Mini Post App, third-party infrastructure providers may place session security tokens:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Firebase Authentication & Cloud Storage:</strong> Manages secure user session tokens and encrypted media uploads.</li>
            <li><strong>Stripe Payment Gateway:</strong> Uses fraud detection cookies during billing checkout sessions to protect against payment scams.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Managing Your Cookie Preferences</h2>
          <p>
            You can clear browser cookies or block storage at any time through your browser settings.
            Please note that disabling strictly necessary cookies will prevent you from signing in or maintaining active user sessions on Mini Post App.
          </p>
          <p>
            For questions regarding our cookie practices, reach out to our privacy compliance office at:{" "}
            <a href="mailto:privacy@minipostapp.space" className="text-amber-400 underline font-semibold">
              privacy@minipostapp.space
            </a>.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
