import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "image.pollinations.ai" },
      { protocol: "https", hostname: "pollinations.ai" },
    ],
  },
  async redirects() {
    return [
      { source: "/company", destination: "/company/about", permanent: true },
      { source: "/values", destination: "/company/values", permanent: true },
      { source: "/careers", destination: "/company/careers", permanent: true },
      { source: "/contact", destination: "/company/contact", permanent: true },
      { source: "/press", destination: "/company/media/press", permanent: true },
      { source: "/help", destination: "/company/resources/help", permanent: true },
      { source: "/security", destination: "/legal/security-disclosure", permanent: true },
      { source: "/privacy-policy", destination: "/legal/privacy", permanent: true },
      { source: "/privacy", destination: "/legal/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/legal/terms", permanent: true },
      { source: "/terms", destination: "/legal/terms", permanent: true },
      { source: "/cookie-policy", destination: "/legal/cookies", permanent: true },
      { source: "/gdpr", destination: "/legal/gdpr", permanent: true },
      { source: "/gdpr-request", destination: "/legal/gdpr", permanent: true },
      { source: "/data-processing-agreement", destination: "/legal/data-processing-agreement", permanent: true },
      { source: "/subprocessors", destination: "/legal/subprocessors", permanent: true },
      { source: "/trust-safety", destination: "/company/trust/trust-safety", permanent: true },
      { source: "/trust-center", destination: "/company/trust/trust-safety", permanent: true },
      { source: "/status", destination: "/company/trust/status", permanent: true },
      { source: "/legal/privacy-policy", destination: "/legal/privacy", permanent: true },
      { source: "/legal/terms-of-service", destination: "/legal/terms", permanent: true },
      { source: "/legal/cookie-policy", destination: "/legal/cookies", permanent: true },
      { source: "/legal/gdpr", destination: "/legal/gdpr", permanent: true },
      { source: "/legal/dpa", destination: "/legal/data-processing-agreement", permanent: true },
      { source: "/legal/security", destination: "/legal/security-disclosure", permanent: true },
      { source: "/legal/subprocessors", destination: "/legal/subprocessors", permanent: true },
      { source: "/legal/disclaimer", destination: "/legal/disclaimer", permanent: true },
      { source: "/disclaimer", destination: "/legal/disclaimer", permanent: true },
    ];
  },
};

export default nextConfig;
