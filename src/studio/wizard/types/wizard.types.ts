import type { ImageAssetResult } from '@/providers/canonical-image-model';
import type { ImageVariant } from '@/lib/services/platformSizingManager';

export type PostGoalOption =
  | 'brand_awareness'
  | 'lead_generation'
  | 'thought_leadership'
  | 'event_promotion'
  | 'product_launch'
  | 'hiring_talent'
  | 'custom'
  | 'Promote Product'
  | 'Promote Service'
  | 'Blog Article'
  | 'Event'
  | 'Announcement'
  | 'Discount'
  | 'Brand Awareness'
  | 'Educational'
  | 'Testimonial'
  | 'Quote'
  | 'Custom';

export type ToneOption =
  | 'professional'
  | 'conversational'
  | 'bold'
  | 'authoritative'
  | 'inspirational'
  | 'witty'
  | 'Professional'
  | 'Friendly'
  | 'Corporate'
  | 'Luxury'
  | 'Casual'
  | 'Educational'
  | 'Funny';

export type PlatformOption =
  | 'Facebook'
  | 'Instagram Feed'
  | 'Instagram Story'
  | 'LinkedIn'
  | 'X'
  | 'Pinterest'
  | 'Threads'
  | 'TikTok';

export type ImageSourceOption =
  | 'ai_generated'
  | 'pexels'
  | 'pixabay'
  | 'unsplash'
  | 'stock'
  | 'upload'
  | 'asset_library';

export interface CreatePostRequest {
  id?: string;
  workflowId?: string;
  topic: string;
  title?: string;
  description?: string;
  callToAction?: string;
  postGoal?: string;
  customGoal?: string;
  targetAudience?: string;
  industry?: string;
  language?: string;
  tone?: string;
  platforms: (PlatformOption | string)[];
  templateId?: string;
  brandId?: string;
  imageSource?: string;
  imagePrompt?: string;
  imageStyle?: string;
  imageAspectRatio?: string;
  imageUrl?: string;
  imageSettings?: any;
  scheduledDate?: string;
  scheduledTime?: string;
  timezone?: string;
  autoOptimizeTime?: boolean;
  publishMode?: string;
  metadata?: any;
  audience?: any;
  schedule?: any;
}

export interface WizardFormData {
  // Step 1 - Goal
  postGoal: PostGoalOption;
  customGoal?: string;

  // Step 2 - Content
  topic: string;
  title?: string;
  description: string;
  callToAction: string;

  // Step 3 - Audience
  targetAudience: string;
  industry: string;
  language: string;
  tone: ToneOption;

  // Step 4 - Platforms
  platforms: PlatformOption[];

  // Step 5 - Template
  templateId: string;

  // Step 6 - Brand
  brandId: string;

  // Step 7 - Images
  imageSource: ImageSourceOption;
  imagePrompt?: string;
  imageStyle?: string;
  imageAspectRatio?: '1:1' | '4:5' | '9:16' | '16:9' | '2:3' | '4:3';
  imageUrl?: string;
  queryRefinement?: string;
  stockOrientation?: 'landscape' | 'portrait' | 'square';
  stockColor?: string;
  selectedImageAsset?: ImageAssetResult;
  aiVersions?: ImageAssetResult[];
  imageConfirmed?: boolean;
  imageConfirmedAt?: string;
  unsplashTracked?: boolean;
  requiresServerStorage?: boolean;
  imageVariants?: ImageVariant[];

  // Step 8 - Schedule
  scheduledDate?: string;
  scheduledTime?: string;
  timezone: string;
  autoOptimizeTime?: boolean;
  publishMode?: 'now' | 'schedule' | 'draft' | 'scheduled';
}

export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
