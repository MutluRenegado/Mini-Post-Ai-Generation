import { COMPANY_FACTS } from '../config/companyFacts';

export const PRESS_PAGE_CONTENT = {
  hero: {
    badge: 'PRESS & MEDIA RELATIONS',
    title: 'Mini Post App Press Center',
    subtitle: `Official product information, corporate background, and press contact for journalists, publications, and media outlets covering ${COMPANY_FACTS.productName}.`,
  },
  facts: [
    { label: 'Product Name', value: COMPANY_FACTS.productName },
    { label: 'Operating Entity', value: COMPANY_FACTS.operatingEntity },
    { label: 'Primary Domain', value: COMPANY_FACTS.primaryDomain },
    { label: 'Product Category', value: 'AI-Powered Personal Publishing Platform' },
    { label: 'Core AI Architecture', value: 'Google Gemini AI Flash Architecture' },
    { label: 'Press Contact Email', value: COMPANY_FACTS.supportEmail },
  ],
};

export const BRAND_KIT_PAGE_CONTENT = {
  hero: {
    badge: 'BRAND GUIDELINES',
    title: 'Brand Assets & Style Guide',
    subtitle: 'Official brand guidelines, color palettes, logo usage rules, and typography standards.',
  },
  colorPalette: [
    { name: 'Pure Dark Base', hex: '#05070c', usage: 'Background & Spatial Surfaces' },
    { name: 'Amber Gold Accent', hex: '#ffae00', usage: 'Primary Badges, Active Nav, Focus States' },
    { name: 'Dark Slate Card', hex: '#0c101a', usage: 'Component Containers & Cards' },
    { name: 'Slate Light Text', hex: '#f8fafc', usage: 'Primary Headings & Readable Text' },
  ],
  typography: {
    primaryFont: 'Inter / System Sans-Serif',
    monoFont: 'JetBrains Mono / System Monospace (for codes, stats, badges)',
  },
  rules: [
    'Always maintain clear space around the logo equal to at least 50% of the logo height.',
    'Do not distort, stretch, or alter the color of the official brand logo.',
    'Use the dark mode emblem on dark backgrounds and light emblem on light backgrounds.',
  ],
};

export const LOGOS_PAGE_CONTENT = {
  hero: {
    badge: 'LOGOS & ASSETS',
    title: 'Official Logo Package',
    subtitle: 'High-resolution logo files, wordmarks, and emblems for media use.',
  },
  assets: [
    { title: 'Dark Background Wordmark', format: 'PNG (mix-blend screen ready)', path: '/Logoblackbackground.png' },
    { title: 'App Icon / Favicon Emblem', format: 'PNG / ICO', path: '/icon.png' },
    { title: 'Apple Touch Icon', format: 'PNG (180x180)', path: '/apple-icon.png' },
  ],
};

export const SCREENSHOTS_PAGE_CONTENT = {
  hero: {
    badge: 'UI SCREENSHOTS',
    title: 'Creator Studio Interface Showcases',
    subtitle: 'Official high-definition preview cards of the 7-step pipeline, template editor, and multi-channel preview.',
  },
  showcases: [
    { title: '7-Step Creator Studio Workflow', desc: 'Step-by-step master post creation and prompt tuning interface.' },
    { title: 'Multi-Channel Preview Screen', desc: 'Simultaneous previews for Facebook, Instagram, LinkedIn, X, and TikTok.' },
    { title: 'Brand Kit & Prompt Editor', desc: 'Configuring custom brand voice rules, target keywords, and template defaults.' },
  ],
};

export const MEDIA_KIT_PAGE_CONTENT = {
  hero: {
    badge: 'MEDIA KIT DOWNLOADS',
    title: 'Press & Media Package Index',
    subtitle: 'Request or download official press backgrounders, executive bios, and brand assets.',
  },
  packages: [
    { name: 'Brand Assets & Vector Logos', format: 'ZIP / SVG / PNG', desc: 'High-resolution logo files and style guidelines.' },
    { name: 'Product Fact Sheet & Executive Bio', format: 'PDF Document', desc: 'Official company facts, product workflow overview, and entity details.' },
  ],
  requestNotice: `To request high-res assets or custom press materials, email ${COMPANY_FACTS.supportEmail}.`,
};
