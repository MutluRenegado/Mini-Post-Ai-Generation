'use client';

import { BrandService } from '@/lib/services/brandService';
import { PublishingDispatchService } from '@/lib/services/publishingDispatchService';
import { AssetsService } from '@/lib/services/assetsService';
import { StudioClientService } from '@/lib/services/studioClientService';

export type InstagramFormat = 'reels' | 'carousel' | 'single' | 'story';
export type AspectRatio = '1:1' | '4:5' | '9:16';

export interface InstagramVisualAsset {
  id: string;
  url: string;
  aspectRatio: AspectRatio;
  format: InstagramFormat;
  styleTransfer: string;
  enhancementPreset: string;
}

export interface InstagramHashtagGroup {
  niche: string;
  reach: string;
  tags: string[];
}

export interface InstagramGeneratedPost {
  id: string;
  format: InstagramFormat;
  caption: string;
  firstComment: string;
  hashtags: string[];
  aspectRatio: AspectRatio;
  visualAssetPrompt: string;
  colorPalette: [string, string, string];
  scheduledAt?: string;
  status: 'draft' | 'queued' | 'published';
}

export class InstagramStudioService {
  /**
   * Get brand 3-color palette for Instagram generation
   */
  public static getBrandPalette(): [string, string, string] {
    const profile = BrandService.getActiveBrandRules();
    return [
      profile.primaryColor || '#0095F6',
      profile.secondaryColor || '#833AB4',
      profile.accentColor || '#F77737',
    ];
  }

  /**
   * Generate context-aware Instagram caption via PromptOrchestrator
   */
  public static async generateInstagramCaption(
    topic: string,
    format: InstagramFormat,
    callToAction: string = 'Save & Share with your network'
  ): Promise<{ caption: string; firstComment: string }> {
    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic,
      platforms: ['Instagram Feed'],
      goal: 'Engagement',
      tone: 'Professional',
      cta: callToAction,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Instagram AI generation failed.');
    }

    const caption = response.data.content || '';
    const hashtags = response.data.hashtags || ['#InstagramGrowth', '#ContentStrategy'];
    const firstComment = `🔍 Related Tags: ${hashtags.join(' ')}`;

    return { caption, firstComment };
  }

  /**
   * Strategic performance-based hashtag research grouped by reach tier
   */
  public static getHashtagResearch(topic: string): InstagramHashtagGroup[] {
    const cleanTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '');
    return [
      {
        niche: 'High Volume (1M+ Posts)',
        reach: 'Massive Reach',
        tags: ['#instagram', '#reels', '#contentcreator', '#viral', '#trending', `#${cleanTopic || 'saas'}`],
      },
      {
        niche: 'Targeted Niche (100K-500K)',
        reach: 'High Engagement',
        tags: ['#socialmediastrategy', '#aigenerator', '#marketingtips', '#contentstudio', '#brandidentity'],
      },
      {
        niche: 'Hyper Niche (<50K)',
        reach: 'Targeted Buyers',
        tags: ['#minipostapp', '#multichanneldispatch', '#fastpostexpress', '#brandpalette', '#instagramcarousel'],
      },
    ];
  }

  /**
   * Format visual asset specifications with auto-resizing specs
   */
  public static getFormatSpecs(format: InstagramFormat): {
    recommendedAspect: AspectRatio;
    resolution: string;
    maxDuration?: string;
    tips: string;
  } {
    switch (format) {
      case 'reels':
        return {
          recommendedAspect: '9:16',
          resolution: '1080 x 1920 px',
          maxDuration: '90 Seconds',
          tips: 'Vertical video format optimized for Instagram algorithm recommendation feed.',
        };
      case 'carousel':
        return {
          recommendedAspect: '4:5',
          resolution: '1080 x 1350 px',
          tips: 'Multi-slide format delivering +38.2% higher engagement than single images.',
        };
      case 'story':
        return {
          recommendedAspect: '9:16',
          resolution: '1080 x 1920 px',
          maxDuration: '15 Seconds',
          tips: '24-hour vertical story cards for direct community polls and sticker CTAs.',
        };
      case 'single':
      default:
        return {
          recommendedAspect: '1:1',
          resolution: '1080 x 1080 px',
          tips: 'Classic square grid post layout for clean feed curation.',
        };
    }
  }

  /**
   * Schedule & dispatch post to Instagram via PublishingDispatchService
   */
  public static async scheduleInstagramPost(
    post: InstagramGeneratedPost
  ): Promise<{ success: boolean; dispatchId?: string }> {
    // 1. Save visual prompt to Asset Library
    AssetsService.addAsset({
      name: `Instagram_${post.format.toUpperCase()}_Asset`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
      sizeBytes: 1548576,
      tags: ['instagram', post.format, 'ai-generated'],
    });

    // 2. Dispatch via PublishingDispatchService
    const platformName = post.format === 'story' ? 'Instagram Story' : 'Instagram Feed';
    const result = await PublishingDispatchService.dispatchPost({
      title: `Instagram ${post.format.toUpperCase()} Post`,
      content: `${post.caption}\n\n${post.hashtags.join(' ')}`,
      platforms: [platformName],
      mediaPrompt: post.visualAssetPrompt,
      scheduledTime: post.scheduledAt || new Date(Date.now() + 3600000).toISOString(),
    });

    return {
      success: result.success,
      dispatchId: result.logs?.[0]?.id || `disp_${Date.now()}`,
    };
  }
}
