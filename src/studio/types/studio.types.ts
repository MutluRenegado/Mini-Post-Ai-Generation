export type StudioTab =
  | 'dashboard'
  | 'wizard'
  | 'templates'
  | 'brand'
  | 'assets'
  | 'calendar'
  | 'analytics'
  | 'publishing'
  | 'approval'
  | 'quality'
  | 'prompts'
  | 'automation'
  | 'settings';

export type PlatformId =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'threads'
  | 'pinterest'
  | 'tiktok'
  | 'google_business';

export type PostType =
  | 'single_image'
  | 'carousel'
  | 'reel_hook'
  | 'story'
  | 'educational'
  | 'promotional'
  | 'testimonial'
  | 'quote';

export type PostGoal =
  | 'engagement'
  | 'lead_gen'
  | 'brand_awareness'
  | 'traffic'
  | 'sales'
  | 'community';

export type PostStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'locked'
  | 'scheduled'
  | 'published'
  | 'archived';

export interface PostRequest {
  id?: string;
  platforms: PlatformId[];
  postType: PostType;
  goal: PostGoal;
  targetAudience: string;
  language: string;
  tone: string;
  industry: string;
  brandId?: string;
  ctaText: string;
  keywords: string[];
  imagePreference: 'ai_generated' | 'uploaded' | 'template' | 'none';
  templatePreference?: string;
  customPrompt?: string;
  campaignId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GeneratedContent {
  hook: string;
  headline: string;
  caption: string;
  mainBody: string;
  cta: string;
  suggestedEmojis: string[];
  keywords: string[];
  hashtags: string[];
}

export interface QualityIssue {
  type: 'grammar' | 'readability' | 'hook' | 'cta' | 'character_limit' | 'platform_rule' | 'seo' | 'emoji' | 'brand_voice';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
}

export interface QualityAuditResult {
  score: number; // 0 - 100
  passed: boolean;
  suggestions: string[];
  warnings: string[];
  issues: QualityIssue[];
  metrics: {
    readabilityScore: number;
    hookStrengthScore: number;
    ctaStrengthScore: number;
    seoDensityScore: number;
    brandVoiceScore: number;
    characterCounts: Record<string, number>;
  };
}

export interface BrandProfile {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fonts: {
    heading: string;
    body: string;
  };
  voiceTone: string;
  targetKeywords: string[];
  ctaStyles: string[];
  watermarkUrl?: string;
  companyInfo: {
    website?: string;
    tagline?: string;
    industry?: string;
  };
}

export interface TemplateItem {
  id: string;
  name: string;
  category:
    | 'Quote'
    | 'Carousel'
    | 'Promotion'
    | 'Product'
    | 'Event'
    | 'Story'
    | 'Testimonial'
    | 'Educational'
    | 'Tips'
    | 'Before/After'
    | 'News'
    | 'Meme';
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9' | '2:3' | '4:3';
  previewColor: string;
  layout: {
    fontFamily: string;
    headingSize: number;
    bodySize: number;
    padding: number;
    safeZoneMargins: { top: number; bottom: number; left: number; right: number };
  };
  thumbnailUrl?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export interface SizingVariant {
  platform: PlatformId;
  formatName: string;
  aspectRatio: string;
  width: number;
  height: number;
  maxCharacters: number;
  scaledFontSize: number;
  reflowedText: string;
  safeAreaMargin: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'logo' | 'icon' | 'document';
  url: string;
  thumbnailUrl?: string;
  sizeBytes: number;
  mimeType: string;
  tags: string[];
  collectionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: 'hook' | 'cta' | 'full_post' | 'rephrase' | 'seo' | 'hashtags';
  promptText: string;
  version: number;
  qualityScore: number;
  usageCount: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerType: 'schedule' | 'event' | 'campaign';
  cronExpression?: string;
  targetPlatforms: PlatformId[];
  status: 'active' | 'paused' | 'draft';
  lastRunAt?: string;
  nextRunAt?: string;
}

export interface StudioPost {
  id: string;
  title: string;
  request?: PostRequest;
  content?: GeneratedContent;
  status: PostStatus;
  qualityAudit?: QualityAuditResult;
  brandProfileId?: string;
  templateId?: string;
  sizingVariants?: SizingVariant[];
  mediaUrls?: string[];
  scheduledAt?: string;
  publishedAt?: string;
  publishedUrls?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  lockedAt?: string;
  lockedBy?: string;
  version: number;
}
