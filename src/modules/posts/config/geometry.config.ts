export type PlatformKey = 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok';

export type FormatPresetMode = 'normal' | 'summary' | 'lengthened';

export interface PlatformGeometryConfig {
  aspectRatio: string;
  aspectRatioCss: string; // Tailwind aspect ratio class or style
  layoutType: string;
  layoutLabel: string;
  maxChars: number;
  normalRange: string;
  summaryRange: string;
  lengthenedRange: string;
  presetDescriptions: {
    normal: string;
    summary: string;
    lengthened: string;
  };
}

export const platformGeometryPresets: Record<PlatformKey, PlatformGeometryConfig> = {
  facebook: {
    aspectRatio: '16:9',
    aspectRatioCss: 'aspect-[16/9]',
    layoutType: 'standard-feed',
    layoutLabel: '16:9 Landscape Link & Feed',
    maxChars: 2000,
    normalRange: '1,000 – 2,000 chars',
    summaryRange: '250 – 400 chars',
    lengthenedRange: '3,000 – 5,000 chars',
    presetDescriptions: {
      normal: 'Balanced 3-paragraph post with engaging hook, core breakdown, and community call-to-action.',
      summary: 'Punchy 2-sentence takeaway optimized for quick scrolling and immediate engagement.',
      lengthened: 'In-depth multi-section community deep-dive with bullet points and extensive context.',
    },
  },
  instagram: {
    aspectRatio: '1:1',
    aspectRatioCss: 'aspect-square',
    layoutType: 'square-card',
    layoutLabel: '1:1 Square Carousel & Feed',
    maxChars: 1500,
    normalRange: '800 – 1,500 chars',
    summaryRange: '150 – 300 chars',
    lengthenedRange: 'Up to 2,000 chars',
    presetDescriptions: {
      normal: 'Visually structured story-arc caption with hook, spacing, and max 30 hashtag block.',
      summary: 'Minimalist one-liner hook paired with core brand hashtags.',
      lengthened: 'Rich narrative storytelling caption with educational carousel breakdown.',
    },
  },
  linkedin: {
    aspectRatio: '1.91:1',
    aspectRatioCss: 'aspect-[1.91/1]',
    layoutType: 'professional-card',
    layoutLabel: '1.91:1 Professional Landscape',
    maxChars: 3000,
    normalRange: '1,500 – 3,000 chars',
    summaryRange: '300 – 500 chars',
    lengthenedRange: 'Up to 3,000 chars',
    presetDescriptions: {
      normal: 'Professional thought-leadership update with industry insights and bulleted key takeaways.',
      summary: 'Sharp executive summary bullet highlighting a single major business metric.',
      lengthened: 'Structured analytical article exploring macroeconomic or industry-specific impacts.',
    },
  },
  twitter: {
    aspectRatio: '16:9',
    aspectRatioCss: 'aspect-[16/9]',
    layoutType: 'micro-card',
    layoutLabel: '16:9 In-Stream Card',
    maxChars: 280,
    normalRange: 'Under 280 chars',
    summaryRange: '100 – 140 chars',
    lengthenedRange: 'Thread format (Connected 280-char posts)',
    presetDescriptions: {
      normal: 'Concise, high-impact post structured strictly under 280 characters with 1-2 tags.',
      summary: 'Micro-hook or punchy quote under 140 characters designed for maximum retweets.',
      lengthened: 'Threaded sequence of connected 280-character posts breaking down complex topics step-by-step.',
    },
  },
  tiktok: {
    aspectRatio: '9:16',
    aspectRatioCss: 'aspect-[9/16]',
    layoutType: 'vertical-story',
    layoutLabel: '9:16 Vertical Full-Screen',
    maxChars: 600,
    normalRange: '300 – 600 chars',
    summaryRange: '100 – 150 chars',
    lengthenedRange: 'Up to 2,100 chars',
    presetDescriptions: {
      normal: 'Lively trend-aware video description combining a curiosity hook with community tags.',
      summary: 'Rapid attention-grabbing text overlay caption synced with fast video editing.',
      lengthened: 'Explanatory background narrative providing full context and step-by-step tutorial details.',
    },
  },
};
