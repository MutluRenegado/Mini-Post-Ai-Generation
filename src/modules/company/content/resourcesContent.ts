import { COMPANY_FACTS } from '../config/companyFacts';

export const HELP_PAGE_CONTENT = {
  hero: {
    badge: 'HELP & SUPPORT CENTER',
    title: 'How Can We Help You?',
    subtitle: 'Find answers to common questions, explore platform guides, or get in touch with our team.',
  },
  categories: [
    { title: 'Getting Started', desc: 'Learn how to create your first master post and publish.', href: '/company/resources/documentation' },
    { title: 'Creator Studio', desc: 'Master prompt templates, AI generation, and brand kits.', href: '/company/product/features' },
    { title: 'Social Channels', desc: 'OAuth channel setup, token security, and troubleshooting.', href: '/company/trust/security' },
    { title: 'Billing & Plans', desc: 'Subscriptions, Stripe invoicing, limits, and upgrades.', href: '/company/product/pricing' },
    { title: 'Data & Privacy', desc: 'Account deletion, privacy rights, and GDPR requests.', href: '/data-deletion' },
    { title: 'Trust & Standards', desc: 'Engineering standards, safety, and responsible AI.', href: '/company/trust/trust-safety' },
  ],
  supportNotice: {
    email: COMPANY_FACTS.supportEmail,
    hours: 'Monday – Friday, 09:00 – 18:00 UTC',
    responseWindow: 'Within 1 business day',
  },
};

export const DOCUMENTATION_PAGE_CONTENT = {
  hero: {
    badge: 'DOCUMENTATION INDEX',
    title: 'Mini Post App Platform Documentation',
    subtitle: 'Official documentation covering Creator Studio workflows, AI generation, channel setup, and account management.',
  },
  sections: [
    { title: 'Creator Studio Pipeline Guide', desc: 'Step-by-step guide to crafting master concepts, selecting target channels, and generating posts.' },
    { title: 'AI Prompt & Brand Kit Configuration', desc: 'How to save custom brand voice rules, target keywords, and template defaults.' },
    { title: 'Social Media Channel Authentication', desc: 'Connecting Meta, LinkedIn, X, TikTok, and YouTube via official OAuth 2.0.' },
    { title: 'Account Deletion & Data Rights', desc: 'Submitting account erasure requests and revoking channel access tokens.' },
  ],
};

export const FAQ_PAGE_CONTENT = {
  hero: {
    badge: 'FREQUENTLY ASKED QUESTIONS',
    title: 'Answers to Common Questions',
    subtitle: 'Everything you need to know about Mini Post App features, pricing, AI generation, and security.',
  },
  faqs: [
    {
      q: 'What is Mini Post App?',
      a: `${COMPANY_FACTS.productName} is an AI-powered personal publishing platform operated by ${COMPANY_FACTS.operatingEntity}. It helps creators, freelancers, and businesses craft social content once and publish it across multiple channels.`,
    },
    {
      q: 'Which social platforms are supported?',
      a: 'We support Facebook Pages & Groups, Instagram Feed & Stories, LinkedIn Posts & Articles, X (Twitter) Threads, and TikTok / YouTube Shorts video scripts.',
    },
    {
      q: 'How does the AI post adaptation work?',
      a: 'Powered by Google Gemini AI Flash, our engine reformats your core post to match the character limits, hashtag norms, line spacing, and tone expectations of each specific network.',
    },
    {
      q: 'Are my social media login credentials safe?',
      a: 'Yes. We use official OAuth 2.0 protocol connections. We never see or store your passwords. All OAuth access tokens are encrypted at rest using AES-256 vault encryption.',
    },
    {
      q: 'How do I delete my account or data?',
      a: 'You can submit an instant deletion request on our dedicated Data Deletion page (/data-deletion) or email deletion@minipostapp.space.',
    },
  ],
};

export const TUTORIALS_PAGE_CONTENT = {
  hero: {
    badge: 'TUTORIALS & GUIDES',
    title: 'Product Walkthroughs & Onboarding Guides',
    subtitle: 'Learn how to maximize your multi-channel social output with practical step-by-step guides.',
  },
  guides: [
    { title: 'Quickstart: Your First Multi-Channel Post', desc: 'Go from master idea to live posts on LinkedIn, X, and Facebook in under 2 minutes.' },
    { title: 'Setting Up Your Brand Kit', desc: 'Configure brand voice parameters, target audience rules, and hashtag preferences.' },
    { title: 'Building Custom Prompt Templates', desc: 'Create reusable templates for weekly newsletter recaps, product updates, and client case studies.' },
  ],
};

export const BLOG_PAGE_CONTENT = {
  hero: {
    badge: 'MINI POST BLOG',
    title: 'Insights & Creator Publishing Strategies',
    subtitle: 'Articles, product update announcements, and multi-channel growth tactics.',
  },
  emptyState: {
    title: 'Official Blog Coming Soon',
    description: 'We are currently preparing deep-dive articles on social content orchestration, prompt engineering, and creator growth tactics. Check back soon for new publications.',
  },
};

export const CHANGELOG_PAGE_CONTENT = {
  hero: {
    badge: 'PRODUCT CHANGELOG',
    title: 'Release Notes & Platform History',
    subtitle: 'Track recent updates, new features, performance improvements, and bug fixes.',
  },
  releases: [
    {
      version: 'v2.4.0',
      date: 'August 2026',
      highlights: ['Company Module Rebuild with unified architecture', 'Centralized route & navigation management', 'Enhanced WCAG 2.2 AA accessibility'],
    },
    {
      version: 'v2.3.0',
      date: 'July 2026',
      highlights: ['Sub-second Gemini AI Flash prompt optimization', 'Expanded X thread auto-splitting', 'Improved AES-256 token encryption vault'],
    },
  ],
};

export const ROADMAP_PAGE_CONTENT = {
  hero: {
    badge: 'PRODUCT ROADMAP',
    title: 'Strategic Focus Areas & Platform Direction',
    subtitle: 'High-level themes we are exploring and developing. Non-binding direction without fixed delivery dates.',
  },
  themes: [
    { stage: 'Current Focus', title: 'Company Module & Accessibility', desc: 'Unified company pages, legal transparency, keyboard navigation, and responsive refinements.' },
    { stage: 'Exploring', title: 'Visual Calendar Scheduling', desc: 'Drag-and-drop posting calendar with cross-channel scheduling preview.' },
    { stage: 'Planned', title: 'Advanced Multi-Brand Profiles', desc: 'Switching between distinct brand kits and client profiles within single workspace.' },
  ],
};
