import { COMPANY_FACTS } from '../config/companyFacts';

export const TRUST_SAFETY_PAGE_CONTENT = {
  hero: {
    badge: 'TRUST, SAFETY & STANDARDS',
    title: 'Built to Engineering & Safety Standards',
    subtitle: 'Mini Post App is engineered with reference to internationally recognized security, accessibility, privacy, and cloud architecture frameworks.',
  },
  principles: [
    { title: 'User Control', desc: 'Users maintain full ownership over their account data, connected channels, and generated content.' },
    { title: 'Responsible AI Principles', desc: 'AI outputs are transparently reviewable and editable prior to publication. No silent automated posting without user review.' },
    { title: 'Data Privacy & Minimization', desc: 'We collect only data necessary for core product functionality and respect all erasure requests.' },
    { title: 'System Security', desc: 'OAuth 2.0 authentication, AES-256 token encryption, and TLS 1.3 transport layer security.' },
  ],
  frameworkAlignment: [
    { code: 'ISO/IEC 27001', name: 'Information Security Management Alignment' },
    { code: 'ISO/IEC 42001', name: 'Artificial Intelligence Management System Alignment' },
    { code: 'WCAG 2.2 AA', name: 'Web Content Accessibility Guidelines Compliance' },
    { code: 'NIST AI RMF', name: 'NIST AI Risk Management Framework Alignment' },
  ],
};

export const SECURITY_PAGE_CONTENT = {
  hero: {
    badge: 'SECURITY & INFRASTRUCTURE',
    title: 'Verified Security Controls & Data Protection',
    subtitle: 'Our technical measures to safeguard your social media OAuth tokens, prompt templates, and account data.',
  },
  controls: [
    { title: 'OAuth 2.0 Protocol', desc: 'We authenticate directly with Meta, LinkedIn, X, TikTok, and Google via official OAuth 2.0. Passwords are never collected or stored.' },
    { title: 'AES-256 Vault Encryption', desc: 'Connected channel access tokens are encrypted at rest using AES-256 vault encryption.' },
    { title: 'TLS 1.3 Encryption', desc: 'All data transmitted between your browser and our servers is encrypted using TLS 1.3.' },
    { title: 'Firebase Cloud Infrastructure', desc: 'Hosted on Google Cloud Platform / Firebase infrastructure with automated backup and DDoS protection.' },
  ],
};

export const PRIVACY_PAGE_CONTENT = {
  hero: {
    badge: 'PRIVACY POLICY',
    title: 'Privacy Policy for Mini Post App',
    subtitle: `Effective Date: ${COMPANY_FACTS.verifiedLegalDetails.lastPolicyUpdate} • Operating Entity: ${COMPANY_FACTS.operatingEntity}`,
  },
  sections: [
    {
      heading: '1. Introduction',
      content: `${COMPANY_FACTS.operatingEntity} ("Company", "we", "us", or "our") operates ${COMPANY_FACTS.productName} (${COMPANY_FACTS.primaryDomain}). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information.`,
    },
    {
      heading: '2. Information We Collect',
      content: 'Account Information (email address, user ID), Connected Channel OAuth Tokens (encrypted via AES-256), Generated Master Posts & Prompt Templates, Usage Telemetry (IP address, browser type, interaction logs).',
    },
    {
      heading: '3. How We Use Information',
      content: 'To provide core publishing services, execute AI prompt adaptations via Google Gemini AI Flash, manage subscription billing via Stripe, process user requests, and enforce terms of service.',
    },
    {
      heading: '4. Third-Party Service Processors',
      content: 'We share data only with essential subprocessors: Google Cloud / Firebase (hosting & auth), Stripe (payment processing), and Pollinations.ai (optional image generation). We do not sell personal data.',
    },
    {
      heading: '5. Data Rights & Retention',
      content: 'Under GDPR and CCPA, users have the right to access, rectify, export, or permanently delete their personal data. Automated account erasure can be requested at /data-deletion.',
    },
  ],
};

export const TERMS_PAGE_CONTENT = {
  hero: {
    badge: 'TERMS OF SERVICE',
    title: 'Terms of Service Agreement',
    subtitle: `Effective Date: ${COMPANY_FACTS.verifiedLegalDetails.lastPolicyUpdate} • Operating Entity: ${COMPANY_FACTS.operatingEntity}`,
  },
  sections: [
    {
      heading: '1. Acceptance of Terms',
      content: `By accessing or using ${COMPANY_FACTS.productName}, operated by ${COMPANY_FACTS.operatingEntity}, you agree to be bound by these Terms of Service.`,
    },
    {
      heading: '2. Account Responsibilities',
      content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
    },
    {
      heading: '3. Acceptable Use & AI Output Responsibility',
      content: 'Users retain ownership of content submitted and generated. You agree not to use the service to generate illegal, hateful, deceptive, or spam content. You are solely responsible for reviewing AI outputs prior to publishing.',
    },
    {
      heading: '4. Subscriptions & Billing',
      content: 'Paid subscriptions are billed in advance via Stripe on a recurring monthly or annual basis. You may cancel your subscription at any time via your account settings.',
    },
    {
      heading: '5. Limitation of Liability',
      content: `${COMPANY_FACTS.operatingEntity} is not liable for social platform API outages, channel suspensions, or indirect damages arising from service usage.`,
    },
  ],
};

export const COOKIES_PAGE_CONTENT = {
  hero: {
    badge: 'COOKIE POLICY',
    title: 'Cookie & Tracking Disclosures',
    subtitle: `Effective Date: ${COMPANY_FACTS.verifiedLegalDetails.lastPolicyUpdate}`,
  },
  categories: [
    { name: 'Essential Cookies', desc: 'Required for user authentication, session security, and Firebase auth state persistence.' },
    { name: 'Functional Cookies', desc: 'Stores user preferences such as theme settings, active workspace, and UI layout states.' },
    { name: 'Performance Telemetry', desc: 'Anonymous performance metrics to measure page load times and API error rates.' },
  ],
};

export const GDPR_PAGE_CONTENT = {
  hero: {
    badge: 'GDPR COMPLIANCE',
    title: 'General Data Protection Regulation Rights',
    subtitle: 'Information for EU/EEA data subjects regarding personal data rights and processing transparency.',
  },
  rights: [
    { right: 'Right of Access', desc: 'Request a copy of your stored personal data.' },
    { right: 'Right to Erasure (Right to be Forgotten)', desc: 'Request permanent deletion of your account and tokens at /data-deletion.' },
    { right: 'Right to Rectification', desc: 'Update inaccurate profile details or connected channel settings.' },
    { right: 'Right to Data Portability', desc: 'Request an export of your saved master posts and brand kits.' },
  ],
};

export const DPA_PAGE_CONTENT = {
  hero: {
    badge: 'DATA PROCESSING AGREEMENT',
    title: 'Data Processing Addendum (DPA)',
    subtitle: 'Standard contractual clause agreement for business customers processing customer data.',
  },
  summary: `This DPA governs the processing of personal data by ${COMPANY_FACTS.operatingEntity} on behalf of business customers using ${COMPANY_FACTS.productName}.`,
};

export const SUBPROCESSORS_PAGE_CONTENT = {
  hero: {
    badge: 'SUBPROCESSORS DIRECTORY',
    title: 'Verified Vendor Subprocessors',
    subtitle: 'List of third-party vendors utilized by Mini Post App for infrastructure, hosting, payments, AI, and social publishing.',
  },
  categories: [
    {
      group: 'Infrastructure & Hosting',
      subprocessors: [
        { name: 'Google Cloud Platform / Firebase', purpose: 'Database, Authentication, Storage, App Hosting', location: 'United States / EU' },
      ],
    },
    {
      group: 'Payments',
      subprocessors: [
        { name: 'Stripe, Inc.', purpose: 'Payment Processing & Subscription Billing', location: 'United States' },
      ],
    },
    {
      group: 'AI & Content Processing',
      subprocessors: [
        { name: 'Google Gemini AI', purpose: 'AI Text Generation & Prompt Adaptation', location: 'United States' },
        { name: 'Pollinations.ai', purpose: 'Fallback AI Image Rendering & Text Generation', location: 'Distributed (Fallback)' },
      ],
    },
    {
      group: 'Social Publishing',
      subprocessors: [
        { name: 'Post Proxy', purpose: 'Multi-Channel Social OAuth & Publishing Gateway', location: 'United States' },
      ],
    },
    {
      group: 'External Media Providers',
      subprocessors: [
        { name: 'Pexels', purpose: 'Stock Photo Search & Media Library Import', location: 'Implemented' },
        { name: 'Pixabay', purpose: 'Stock Media & Illustration Search', location: 'Planned' },
        { name: 'Unsplash', purpose: 'High-Resolution Photo Search & Asset Tracking', location: 'Partial / Planned' },
      ],
    },
    {
      group: 'Independent Platforms',
      subprocessors: [
        { name: 'Meta', purpose: 'Social Platform Publishing & Engagement (FB, IG, Threads)', location: 'Independent Controller' },
        { name: 'LinkedIn', purpose: 'Professional Network Publishing', location: 'Independent Controller' },
        { name: 'X', purpose: 'Microblogging Publishing & Engagement', location: 'Independent Controller' },
        { name: 'TikTok', purpose: 'Video Content Publishing', location: 'Independent Controller' },
        { name: 'YouTube', purpose: 'Video & Shorts Content Publishing', location: 'Independent Controller' },
        { name: 'Telegram', purpose: 'Channel & Community Messaging', location: 'Independent Controller' },
        { name: 'Bluesky', purpose: 'Decentralized Social Publishing', location: 'Independent Controller' },
        { name: 'Pinterest', purpose: 'Visual Board Publishing', location: 'Independent Controller' },
        { name: 'Google Business Profile', purpose: 'Local Business Updates & Posts', location: 'Independent Controller' },
      ],
    },
  ],
  subprocessorsList: [
    { name: 'Google Cloud Platform / Firebase', purpose: 'Database, Authentication, Storage, App Hosting', location: 'United States / EU' },
    { name: 'Stripe, Inc.', purpose: 'Payment Processing & Subscription Billing', location: 'United States' },
    { name: 'Google Gemini AI', purpose: 'AI Text Generation & Prompt Adaptation', location: 'United States' },
    { name: 'Pollinations.ai', purpose: 'Fallback AI Image Rendering & Text Generation', location: 'Distributed (Fallback)' },
    { name: 'Post Proxy', purpose: 'Multi-Channel Social OAuth & Publishing Gateway', location: 'United States' },
    { name: 'Pexels', purpose: 'Stock Photo Search & Media Library Import', location: 'Implemented' },
    { name: 'Pixabay', purpose: 'Stock Media & Illustration Search', location: 'Planned' },
    { name: 'Unsplash', purpose: 'High-Resolution Photo Search & Asset Tracking', location: 'Partial / Planned' },
    { name: 'Meta', purpose: 'Social Platform Publishing & Engagement', location: 'Independent Controller' },
    { name: 'LinkedIn', purpose: 'Professional Network Publishing', location: 'Independent Controller' },
    { name: 'X', purpose: 'Microblogging Publishing & Engagement', location: 'Independent Controller' },
    { name: 'TikTok', purpose: 'Video Content Publishing', location: 'Independent Controller' },
    { name: 'YouTube', purpose: 'Video & Shorts Content Publishing', location: 'Independent Controller' },
    { name: 'Telegram', purpose: 'Channel & Community Messaging', location: 'Independent Controller' },
    { name: 'Bluesky', purpose: 'Decentralized Social Publishing', location: 'Independent Controller' },
    { name: 'Pinterest', purpose: 'Visual Board Publishing', location: 'Independent Controller' },
    { name: 'Google Business Profile', purpose: 'Local Business Updates & Posts', location: 'Independent Controller' },
  ],
};

export const STATUS_PAGE_CONTENT = {
  hero: {
    badge: 'SYSTEM STATUS',
    title: 'System Operational Status',
    subtitle: 'Real-time service operational state, infrastructure health, and support notifications.',
  },
  statusIndicator: {
    state: 'Fully Operational',
    color: 'emerald',
    lastChecked: 'Real-time live monitoring',
  },
  services: [
    { name: 'Creator Studio Web App', status: 'Operational' },
    { name: 'Google Gemini AI Flash Gateway', status: 'Operational' },
    { name: 'Firebase Authentication & Database', status: 'Operational' },
    { name: 'OAuth 2.0 Social Publishing APIs', status: 'Operational' },
    { name: 'Stripe Subscription Billing', status: 'Operational' },
  ],
};
