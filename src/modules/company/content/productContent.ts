import { COMPANY_FACTS } from '../config/companyFacts';

export const FEATURES_PAGE_CONTENT = {
  hero: {
    badge: 'PRODUCT FEATURES',
    title: 'Engineered for Personal & Business Publishing',
    subtitle: 'Discover the core features inside Mini Post App designed to streamline multi-platform content creation.',
  },
  featureList: [
    { title: 'Unified Master Post Editor', desc: 'Write your core post once and preview platform adaptations side-by-side.' },
    { title: 'Google Gemini AI Flash Engine', desc: 'Sub-second AI post reformatting tailored to Facebook, Instagram, LinkedIn, X, and TikTok.' },
    { title: 'Multi-Channel Fast Post', desc: 'Instant single-click distribution across connected OAuth accounts.' },
    { title: 'Brand Kit & Tone Rules', desc: 'Save your custom brand voice rules, target keywords, and visual themes.' },
    { title: 'Custom Prompt Templates', desc: 'Access pre-built template categories or save your own custom prompt workflows.' },
    { title: 'AES-256 Token Encryption', desc: 'Enterprise-grade vault storage for connected social media OAuth access tokens.' },
  ],
};

export const CAPABILITIES_PAGE_CONTENT = {
  hero: {
    badge: 'PLATFORM CAPABILITIES',
    title: 'Supported Channels & Format Capabilities',
    subtitle: 'Mini Post App adapts content to meet the specific character limits, tone expectations, and formatting standards of each network.',
  },
  supportedMatrix: [
    { platform: 'Facebook Pages & Groups', status: 'Available', details: 'Long-form posts, link previews, image captions, group updates' },
    { platform: 'Instagram Feed & Stories', status: 'Available', details: 'Caption generation, hashtag blocks, carousel copy, story text' },
    { platform: 'LinkedIn Posts & Articles', status: 'Available', details: 'Professional thought leadership, line-break formatting, slide scripts' },
    { platform: 'X (Twitter) Threads', status: 'Available', details: 'Thread splitting, character count enforcement (280/25,000), hook creation' },
    { platform: 'TikTok & Shorts Scripts', status: 'Available', details: 'Video script outlines, hook formulas, call-to-action captions' },
    { platform: 'Visual Calendar Scheduling', status: 'Planned', details: 'Drag-and-drop posting calendar in active development' },
  ],
};

export const AI_ENGINE_PAGE_CONTENT = {
  hero: {
    badge: 'AI ENGINE ARCHITECTURE',
    title: 'Powered by Google Gemini AI Flash',
    subtitle: 'Sub-second generation latency, platform semantic matching, and strict format compliance.',
  },
  specs: [
    { label: 'Core AI Model', value: 'Google Gemini AI Flash' },
    { label: 'Average Response Time', value: '< 900ms' },
    { label: 'Semantic Acceptance Rate', value: '95%+' },
    { label: 'Prompt Security', value: 'Isolated execution, zero training on private user data' },
  ],
  principles: [
    { title: 'Format Guards', desc: 'Ensures generated posts strictly respect platform character limits and link formatting.' },
    { title: 'Tone Preservation', desc: 'Applies saved brand kit voice rules across all target outputs.' },
    { title: 'User Review & Override', desc: 'All AI outputs are editable prior to publishing.' },
  ],
};

export const TEMPLATES_PAGE_CONTENT = {
  hero: {
    badge: 'TEMPLATE GALLERY',
    title: 'Proven Prompts & Content Frameworks',
    subtitle: 'Choose from pre-engineered templates designed for thought leadership, product launches, case studies, and storytelling.',
  },
  categories: [
    { name: 'Founders & Solopreneurs', count: '12 Templates', desc: 'Build in public updates, product milestones, and strategic breakdowns.' },
    { name: 'Coaches & Consultants', count: '15 Templates', desc: 'Client transformation stories, framework breakdowns, and Q&A posts.' },
    { name: 'Marketing & Agencies', count: '10 Templates', desc: 'Multi-channel campaign announcements and brand story posts.' },
    { name: 'Content Creators', count: '14 Templates', desc: 'Viral hook formulas, video script outlines, and engagement starters.' },
  ],
};

export const PRICING_PAGE_CONTENT = {
  hero: {
    badge: 'PRICING PLANS',
    title: 'Transparent Plans for Every Creator',
    subtitle: 'Start with our free starter tier or unlock full multi-channel automation with Pro and Studio plans.',
  },
  plans: [
    {
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      features: ['Up to 15 AI post generations/mo', 'Single-channel publishing', 'Standard prompt templates', 'Community support'],
      ctaText: 'Get Started Free',
      ctaHref: '/dashboard',
    },
    {
      name: 'Pro Creator',
      price: '$19',
      period: 'per month',
      popular: true,
      features: ['Unlimited AI post generations', 'Multi-channel publishing (Facebook, IG, LinkedIn, X)', 'Custom Brand Kit & prompt rules', 'Priority support'],
      ctaText: 'Upgrade to Pro',
      ctaHref: '/subscribe',
    },
    {
      name: 'Studio & Agency',
      price: '$49',
      period: 'per month',
      features: ['Everything in Pro', 'Multiple brand profiles', 'Team collaboration workflows', 'Advanced Gemini Flash customization'],
      ctaText: 'Explore Studio Plan',
      ctaHref: '/subscribe',
    },
  ],
};

export const ENTERPRISE_PAGE_CONTENT = {
  hero: {
    badge: 'ENTERPRISE & AGENCIES',
    title: 'Multi-Brand Content Orchestration for Teams',
    subtitle: 'Scale social media output across multiple client accounts while maintaining strict brand guidelines.',
  },
  useCases: [
    { title: 'Marketing Agencies', desc: 'Manage client accounts with isolated brand kits, custom prompts, and team roles.' },
    { title: 'Franchises & Multi-Location Brands', desc: 'Distribute localized posts across regional social accounts from a central workflow.' },
    { title: 'Corporate Communications', desc: 'Empower executive leadership team members to build personal brands on LinkedIn.' },
  ],
  contactNotice: `For custom team seating, billing, or enterprise onboarding, contact our team directly at ${COMPANY_FACTS.supportEmail}.`,
};
