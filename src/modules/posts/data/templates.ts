export interface SocialTemplate {
  id: string;
  platform: 'facebook' | 'linkedin' | 'instagram' | 'twitter' | 'tiktok';
  title: string;
  category: string;
  content: string;
  aestheticBadge?: string;
  sampleImage: string;
  sampleVideo?: string;
  sampleData: {
    hashtags: string[];
    ctaText: string;
    mediaType: 'image' | 'video' | 'carousel';
    engagementMetric: string;
  };
}

export const READY_TEMPLATES: SocialTemplate[] = [
  // --- FACEBOOK PREMIUM TEMPLATES (3) ---
  {
    id: 'fb-1',
    platform: 'facebook',
    category: 'VIP Product Reveal',
    title: '💎 Apex Suite • VIP Product Unveiling',
    aestheticBadge: 'Luminous Neon & Gold',
    sampleImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80',
    sampleVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    content: `🌌 [MINI POST APP EXECUTIVE INTEL] • VIP PRODUCT REVEAL

We have been quietly engineering something revolutionary behind closed doors, and today we unveil the next-generation experience.

Introducing the Mini Post App Creator Suite — built for visionary founders, high-output agencies, and elite creators who demand perfection.

✨ Key Architecture Highlights:
• Instant 1-Click Multi-Platform Adaptation
• Deep Space Dark Glassmorphic Canvas
• Direct Postproxy Transmission Engine

🎟️ Exclusive early access passes are active now. Click below to experience the future of content engineering.`,
    sampleData: {
      hashtags: ['#MiniPostApp', '#ExecutiveTech', '#Innovation'],
      ctaText: 'Claim VIP Early Access',
      mediaType: 'video',
      engagementMetric: '4.8k Likes • 1.2k Shares',
    },
  },
  {
    id: 'fb-2',
    platform: 'facebook',
    category: 'Luxury Storytelling',
    title: '🏛️ Monolith • Founders Story & High-Impact Case Study',
    aestheticBadge: 'Editorial Dark',
    sampleImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1080&q=80',
    content: `🏛️ [EDITORIAL PERSPECTIVE]: Uncompromising Execution

3 years ago, conventional wisdom said our approach would fail. The market demanded cheap shortcuts, but we doubled down on craftsmanship, speed, and privacy.

The lesson? True differentiation is built in the details that competitors ignore.

Have you ever backed a high-stakes decision when everyone doubted the vision? Drop your experience below.`,
    sampleData: {
      hashtags: ['#Monolith', '#FoundersMindset', '#TechLeadership', '#Craftsmanship'],
      ctaText: 'Join Executive Discussion',
      mediaType: 'image',
      engagementMetric: '3.2k Engagements • 480 Comments',
    },
  },
  {
    id: 'fb-3',
    platform: 'facebook',
    category: 'Executive Masterclass',
    title: '📅 Mini Post Live • Executive Strategy Briefing',
    aestheticBadge: 'Deep Space Glass',
    sampleImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1080&q=80',
    sampleVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    content: `🌌 [MINI POST MASTERCLASS]: Scaling Digital Distribution in 2026

Join our exclusive live briefing this Thursday at 5 PM EST. We are pulling back the curtain on how high-volume media companies automate multi-platform distribution without sacrificing quality.

🎟️ Seats are strictly limited to preserve Q&A quality. Reserve your invitation link below.`,
    sampleData: {
      hashtags: ['#ExecutiveBriefing', '#MediaStrategy', '#Automation', '#MiniPostHQ'],
      ctaText: 'Reserve Live Masterclass Seat',
      mediaType: 'video',
      engagementMetric: '2.9k Registered Attendees',
    },
  },

  // --- LINKEDIN PREMIUM TEMPLATES (3) ---
  {
    id: 'li-1',
    platform: 'linkedin',
    category: 'Strategic Analysis',
    title: '📈 Executive Intel • 2026 Strategic Market Analysis',
    aestheticBadge: 'High-Contrast Cyber',
    sampleImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1080&q=80',
    content: `📈 [EXECUTIVE INTEL] • 3 Macro Shifts Redefining Enterprise Media in 2026

The primary vulnerability for modern brands isn't lack of content — it's friction in execution.

Here is the strategic analysis our advisory team prepared for Q3:

1. Autonomous Pipeline Systems replacing legacy manual content production teams.
2. Direct Audience Ownership outperforming algorithmic distribution dependencies.
3. High-Fidelity Branding out-converting generic low-effort AI filler.

Which of these strategic priorities is your board accelerating this quarter?`,
    sampleData: {
      hashtags: ['#ExecutiveLeadership', '#Strategy', '#CorporateGovernance', '#TechTrends'],
      ctaText: 'Download Full Q3 Report',
      mediaType: 'carousel',
      engagementMetric: '12.4k Impressions • 890 Reactions',
    },
  },
  {
    id: 'li-2',
    platform: 'linkedin',
    category: 'Milestone & Scaling',
    title: '🏆 Monolith Milestone • Scaling Beyond $10M ARR',
    aestheticBadge: 'Refined Platinum',
    sampleImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&q=80',
    content: `🏆 [MILESTONE REPORT] • Crossing 100,000 Active Creator Workspaces

Scaling our infrastructure across 40+ countries taught our engineering team three non-negotiable principles:

• Architectural Simplicity beats overly complex abstractions every single time.
• User Velocity is the ultimate moat in software adoption.
• High-Trust Culture accelerates execution far faster than micromanagement.

Gratitude to our extraordinary engineering team, advisors, and global creator community.`,
    sampleData: {
      hashtags: ['#ScaleUp', '#EnterpriseTech', '#Milestone', '#SoftwareEngineering'],
      ctaText: 'Read Architectural Whitepaper',
      mediaType: 'image',
      engagementMetric: '8.9k Reactions • 340 Reposts',
    },
  },
  {
    id: 'li-3',
    platform: 'linkedin',
    category: 'Leadership Framework',
    title: '🧠 C-Suite Playbook • 4 Rules for High-Trust Engineering',
    aestheticBadge: 'Enterprise Blue',
    sampleImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1080&q=80',
    content: `🧠 [C-SUITE PLAYBOOK] • 4 Principles of Autonomous Product Teams

High-performing product organizations don't manage tasks — they align vision and unleash ownership.

1. Clear Boundaries: Define non-negotiable outcomes, not rigid paths.
2. Rapid Iteration: Ship small increments daily rather than monolith releases.
3. Radical Transparency: Share metric dashboards across every engineering guild.
4. Continuous Feedback: Replace annual reviews with real-time peer alignment.

How does your team foster autonomous execution?`,
    sampleData: {
      hashtags: ['#Leadership', '#EngineeringExcellence', '#CTOPlaybook', '#Management'],
      ctaText: 'Save Strategy Framework',
      mediaType: 'image',
      engagementMetric: '5.1k Reactions • 210 Comments',
    },
  },

  // --- INSTAGRAM PREMIUM TEMPLATES (3) ---
  {
    id: 'ig-1',
    platform: 'instagram',
    category: 'Editorial Graphic',
    title: '✨ Editorial Visual • 5 Rules for High-End Creators',
    aestheticBadge: 'Luxury Minimalist',
    sampleImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1080&q=80',
    content: `✨ [EDITORIAL CAROUSEL] • 5 Unfair Advantages for High-End Creators ➡️ SWIPE TO READ

Elevate your brand presence with uncompromising design precision. Save this visual guide for your next content sprint! 📌

Which slide aligns closest with your current aesthetic vision? Drop your choice below! 👇

.
.
.`,
    sampleData: {
      hashtags: ['#MinimalistDesign', '#LuxuryAesthetic', '#CreatorStudio', '#VisualIdentity', '#DigitalArchitecture'],
      ctaText: 'Save Carousel Pin 📌',
      mediaType: 'carousel',
      engagementMetric: '15.8k Saves • 2.1k Likes',
    },
  },
  {
    id: 'ig-2',
    platform: 'instagram',
    category: 'Studio Cinema',
    title: '🎬 Cinema Studio • Behind the Scenes at Mini Post App',
    aestheticBadge: 'Cyber Cinema',
    sampleImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1080&q=80',
    sampleVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    content: `🎬 [STUDIO VLOG] • Late Night Build Sessions at Mini Post App ☕💻✨

Precision UI ➡️ Dark Glassmorphism ➡️ Atomic State Machines ➡️ Deployment Passed!

Real innovation happens in the deep work sessions away from the noise.

Double tap if you're building something exceptional tonight. 🖤

.
.
.`,
    sampleData: {
      hashtags: ['#MiniPostApp', '#StudioVlog', '#CyberAesthetic', '#DeepWork', '#SoftwareArchitect', '#UIUXDesign'],
      ctaText: 'Watch Studio Vlog 🎬',
      mediaType: 'video',
      engagementMetric: '24.3k Plays • 3.4k Likes',
    },
  },
  {
    id: 'ig-3',
    platform: 'instagram',
    category: 'Brand Aesthetic Guide',
    title: '🎨 Visual System • Dark Glassmorphic UI Palette',
    aestheticBadge: 'Neon Obsidian',
    sampleImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80',
    content: `🎨 [DESIGN SYSTEM INTEL] • Building Dark Mode Interfaces That Wow 🌌

Dark mode isn't just turning white backgrounds black. It requires:
1. Curated HSL Accent Colors
2. Subtle Ambient Glows
3. High-Contrast Micro-Typography
4. Glassmorphic Backdrop Blurs

Save this design guide for your next Web App build! 💾`,
    sampleData: {
      hashtags: ['#DesignSystem', '#DarkModeUI', '#UIUX', '#WebDesign', '#FigmaCommunity'],
      ctaText: 'Save Design Tokens 💾',
      mediaType: 'image',
      engagementMetric: '18.9k Saves • 4.1k Likes',
    },
  },

  // --- X / TWITTER PREMIUM TEMPLATES (3) ---
  {
    id: 'tw-1',
    platform: 'twitter',
    category: 'Executive Thesis',
    title: '⚡ Cyber Thesis • The Future of Content Distribution',
    aestheticBadge: 'Luminous Neon',
    sampleImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1080&q=80',
    content: `⚡ [CYBER THESIS]: High-speed execution is no longer optional.

In 2026, the cost of creation dropped to zero. The cost of standing out skyrocketed to infinity.

Speed + Taste + Distribution = Unstoppable Moat. 🧵👇`,
    sampleData: {
      hashtags: ['#TechThesis', '#BuildInPublic', '#AIArchitect'],
      ctaText: 'Bookmark Thread ⚡',
      mediaType: 'image',
      engagementMetric: '140.2k Views • 1.8k Retweets',
    },
  },
  {
    id: 'tw-2',
    platform: 'twitter',
    category: 'High-Impact Thread',
    title: '🧵 Masterclass Thread • 5 Rules of High-Output Teams',
    aestheticBadge: 'Minimal Tech',
    sampleImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1080&q=80',
    content: `🧵 I audited 50 top-tier SaaS teams scaling in 2026.

Here are the 5 non-obvious rules for 10x output with a lean 3-person team:

1. Replace meeting overload with async video memos
2. Enforce strict 4-hour morning deep work blocks
3. Automate 100% of social media publishing pipelines
4. Prioritize clean UI over bloated features
5. Ship daily`,
    sampleData: {
      hashtags: ['#Productivity', '#StartupScale', '#TechHacks'],
      ctaText: 'Read Full Thread 🧵',
      mediaType: 'carousel',
      engagementMetric: '92.4k Views • 940 Retweets',
    },
  },
  {
    id: 'tw-3',
    platform: 'twitter',
    category: 'AI Pipeline Hack',
    title: '🤖 AI Automation • 1-Click Multi-Channel Workflow',
    aestheticBadge: 'Cyberpunk Neon',
    sampleImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1080&q=80',
    sampleVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    content: `🤖 [AUTOMATION HACK]: Stop posting manually on 5 social networks.

1 Master Core Concept ➡️ Gemini AI ➡️ Auto-Adapt for X, LinkedIn, FB, IG & TikTok.

Here is the exact architecture code we built inside Creator Studio: ⚡`,
    sampleData: {
      hashtags: ['#AIAutomation', '#DevRel', '#NoCode', '#SaaS'],
      ctaText: 'Try AI Pipeline Demo 🚀',
      mediaType: 'video',
      engagementMetric: '67.8k Views • 620 Retweets',
    },
  },

  // --- TIKTOK / REELS PREMIUM TEMPLATES (3) ---
  {
    id: 'tk-1',
    platform: 'tiktok',
    category: 'High-Tech Script',
    title: '🎬 Cyber Reel Script • Stop Formatting Posts Manually',
    aestheticBadge: 'Hyper-Growth',
    sampleImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1080&q=80',
    sampleVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    content: `[HOOK]: Stop spending 2 hours reformatting social posts manually! Do this instead 😱 👇

[VIP SCRIPT]:
If you are still copy-pasting text between Facebook, LinkedIn, and Instagram, your workflow is obsolete. 

Use this automated 7-step AI pipeline to convert 1 master concept into 5 high-converting platform posts in under 10 seconds.

[CTA]: Comment "STUDIO" below for VIP access link! 🚀`,
    sampleData: {
      hashtags: ['#TechTok', '#CreatorStudio', '#AutomationHacks', '#AITools', '#ViralGrowth'],
      ctaText: 'Watch Viral Reel Script 🎬',
      mediaType: 'video',
      engagementMetric: '145.2k Plays • 12.8k Shares',
    },
  },
  {
    id: 'tk-2',
    platform: 'tiktok',
    category: 'Founder Story Reel',
    title: '🚀 Founder Story • How We Built Creator Studio in 14 Days',
    aestheticBadge: 'Raw Authenticity',
    sampleImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1080&q=80',
    sampleVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    content: `[HOOK]: Everyone told us building a multi-platform AI studio in 14 days was impossible. Here's what happened 😳

[REEL SCRIPT]:
Day 1: Wrote the core Next.js & Firebase schema.
Day 5: Integrated Gemini 2.5 Flash text AI & Pollinations artwork generation.
Day 10: Wired multi-platform Postproxy pipeline.
Day 14: Shipped to 100,000 global creators.

Lesson: Speed & deep focus solve everything.`,
    sampleData: {
      hashtags: ['#BuildInPublic', '#FounderLife', '#TechStartup', '#ViralReel'],
      ctaText: 'Watch Founder Reel 🚀',
      mediaType: 'video',
      engagementMetric: '98.4k Plays • 8.1k Shares',
    },
  },
  {
    id: 'tk-3',
    platform: 'tiktok',
    category: 'AI Workflow Tutorial',
    title: '⚡ 15-Sec AI Hack • Turn 1 Idea into 5 Platform Posts',
    aestheticBadge: 'Neon Speed',
    sampleImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80',
    sampleVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    content: `[HOOK]: The 15-second hack top marketing agencies use to publish 50 posts per week 🤯

[QUICK TUTORIAL]:
1. Type your core idea into Master Title
2. Click "Adapt to All Platforms (1-Click AI)"
3. Copy exact formatted posts for X, IG, LinkedIn, FB & TikTok

Save this reel before you forget! 📌`,
    sampleData: {
      hashtags: ['#AIHack', '#MarketingTips', '#SocialMediaStrategy', '#GrowthHacking'],
      ctaText: 'Watch Tutorial Video ⚡',
      mediaType: 'video',
      engagementMetric: '210.5k Plays • 19.4k Saves',
    },
  },
];
