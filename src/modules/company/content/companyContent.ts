import { COMPANY_FACTS } from '../config/companyFacts';

export const ABOUT_PAGE_CONTENT = {
  hero: {
    badge: 'ABOUT MINI POST APP',
    title: 'Empowering Creators & Businesses to Publish Smarter',
    subtitle: `${COMPANY_FACTS.productName} is an AI-powered personal publishing platform operated by ${COMPANY_FACTS.operatingEntity}. We eliminate social media friction by allowing users to craft content once and publish everywhere seamlessly.`,
  },
  workflow: {
    title: 'The Core Workflow',
    steps: [
      { step: '01', name: 'Create', desc: 'Input your core master post, thought, or video concept into our unified editor.' },
      { step: '02', name: 'Optimise', desc: 'Google Gemini AI Flash tailors your message into platform-native scripts, threads, and captions.' },
      { step: '03', name: 'Publish', desc: 'Schedule or post directly across Facebook, Instagram, LinkedIn, X, TikTok, and YouTube.' },
      { step: '04', name: 'Analyse', desc: 'Track multi-channel post performance and audience engagement metrics.' },
    ],
  },
  pillars: [
    { title: 'Practicality & Clarity', desc: 'We prioritize clear, fast, zero-fluff software tools that save real hours every week.' },
    { title: 'User Control', desc: 'You maintain 100% control over your connected accounts, tokens, and generated content.' },
    { title: 'Responsible AI', desc: 'AI is designed as an assistant to augment human creativity, not replace authentic voice.' },
  ],
};

export const STORY_PAGE_CONTENT = {
  hero: {
    badge: 'OUR STORY',
    title: 'Built to Solve the Multi-Channel Publishing Paradox',
    subtitle: 'Managing personal or business brands across five different social platforms shouldn’t mean rewriting the same post five times.',
  },
  narrative: [
    {
      title: 'The Challenge',
      content: 'As social platforms multiplied, creators and small business owners found themselves spending more time reformatting text, adjusting hashtag rules, and battling character limits than actually sharing valuable ideas.',
    },
    {
      title: 'The Product Philosophy',
      content: 'We built Mini Post App around a single premise: master content should be created once, then intelligently adapted by AI to respect the unique format, culture, and requirements of every target channel.',
    },
    {
      title: 'Built with Precision',
      content: `Operated by ${COMPANY_FACTS.operatingEntity}, Mini Post App combines sub-second AI inference, robust token encryption, and clean dark-mode UI design.`,
    },
  ],
};

export const MISSION_PAGE_CONTENT = {
  hero: {
    badge: 'OUR MISSION',
    title: 'Eliminate Repetitive Publishing Friction',
    subtitle: 'Our mission is to empower individuals, freelancers, coaches, and businesses to maintain a high-impact multi-channel presence without wasting hours on manual formatting.',
  },
  goals: [
    { title: 'Sub-Second Speed', desc: 'Deliver sub-second multi-channel post generation powered by Google Gemini AI Flash.' },
    { title: 'Brand Consistency', desc: 'Provide reusable brand kit guidelines, custom prompt rules, and format guards.' },
    { title: 'Total Privacy & Control', desc: 'Protect OAuth credentials with AES-256 vault encryption and respect user data rights.' },
  ],
};

export const VISION_PAGE_CONTENT = {
  hero: {
    badge: 'OUR VISION',
    title: 'Authentic Digital Presence Made Effortless',
    subtitle: 'We envision a future where every professional and business can share ideas, build trust, and grow an audience across any social channel with absolute clarity and control.',
  },
  commitments: [
    { title: 'Continuous Refinement', desc: 'Constantly improving prompt quality, semantic validation, and publishing speed.' },
    { title: 'Zero Unsupported Promises', desc: 'We commit to transparent communication and realistic feature releases without fake hype.' },
    { title: 'Engineering Excellence', desc: 'Building on modern web standards, strict type safety, and responsive design.' },
  ],
};

export const VALUES_PAGE_CONTENT = {
  hero: {
    badge: 'OUR VALUES',
    title: 'Principles That Guide Product & Engineering',
    subtitle: 'Our core values define how we build Mini Post App, treat our users, and handle their data.',
  },
  valuesList: [
    { title: 'Clarity & Simplicity', desc: 'Eliminate unnecessary UI clutter and complex steps. Keep every workflow direct and intuitive.' },
    { title: 'User Control', desc: 'Users own their content, tokens, and data. Easy deletion and export at any time.' },
    { title: 'Responsible AI', desc: 'AI outputs are transparently reviewable and editable before publication.' },
    { title: 'Reliability & Speed', desc: 'Sub-second AI response times and reliable OAuth publishing connections.' },
    { title: 'Practical Creativity', desc: 'Focus on tools that solve real daily publishing challenges for real creators.' },
    { title: 'Privacy & Security', desc: 'AES-256 token vault encryption and zero unnecessary data collection.' },
  ],
};

export const CAREERS_PAGE_CONTENT = {
  hero: {
    badge: 'CAREERS',
    title: 'Work With Us',
    subtitle: 'We are an engineering-driven, creator-focused team building AI publishing tools.',
  },
  status: {
    hasVacancies: false,
    message: 'There are currently no active job vacancies at Mini Post App. When new positions open in engineering, product design, or AI research, they will be posted here.',
    contactNotice: `General talent inquiries may be directed to our official team mailbox at ${COMPANY_FACTS.supportEmail}.`,
  },
  culturePillars: [
    { title: 'Remote-First Environment', desc: 'Asynchronous collaboration, flexible working hours, and autonomy.' },
    { title: 'Modern Tech Stack', desc: 'Next.js 16, TypeScript, Google Gemini AI Flash, Tailwind CSS, and Firebase.' },
    { title: 'Engineering Quality', desc: 'Clean architecture, type safety, sub-second performance, and zero technical debt.' },
  ],
};
