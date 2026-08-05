'use client';

import { BrandService } from '@/lib/services/brandService';
import { PublishingDispatchService } from '@/lib/services/publishingDispatchService';
import { AssetsService } from '@/lib/services/assetsService';
import { StudioClientService } from '@/lib/services/studioClientService';

export interface FacebookGraphTokenStatus {
  status: 'active' | 'expiring_soon' | 'expired';
  pageName: string;
  pageId: string;
  tokenExpiresInDays: number;
  scopes: string[];
  lastValidatedAt: string;
}

export interface FacebookPostTypeMetric {
  type: 'Single Image' | 'Carousel' | 'Video Broadcast' | 'Link Post';
  usageCount: number;
  avgEngagementRate: string;
  avgCTR: string;
  color: string;
}

export interface FacebookTemplatePreset {
  id: string;
  name: string;
  category: string;
  aspectRatio: string;
  previewColor: string;
  recommendedFor: string;
}

export type FacebookCampaignType =
  | 'lead_gen'
  | 'carousel_link'
  | 'community_poll'
  | 'event_promo'
  | 'longform_authority';

export interface VideoSceneStoryboard {
  sceneIndex: number;
  heading: string;
  onScreenAction: string;
  voiceoverScript: string;
  durationSeconds: number;
}

export interface FacebookMultiAssetBundle {
  topic: string;
  campaignType: FacebookCampaignType;
  storyAsset: {
    format: '9:16';
    stickerCta: string;
    caption: string;
    visualPrompt: string;
    imageUrl?: string;
    imageStatus?: 'generated' | 'stored' | 'failed';
    imageError?: string;
  };
  reelAsset: {
    format: '9:16';
    voiceoverVoice: string;
    storyboard: VideoSceneStoryboard[];
    visualPrompt: string;
  };
  feedAsset: {
    format: '1:1' | '4:5';
    caption: string;
    headline: string;
    visualPrompt: string;
    imageUrl?: string;
    imageStatus?: 'generated' | 'stored' | 'failed';
    imageError?: string;
  };
  colorPalette: [string, string, string];
}

export class FacebookPlatformService {
  /**
   * Get brand 3-color palette
   */
  public static getBrandPalette(): [string, string, string] {
    const profile = BrandService.getActiveBrandRules();
    return [
      profile.primaryColor || '#0095F6',
      profile.secondaryColor || '#3B82F6',
      profile.accentColor || '#8B5CF6',
    ];
  }

  static getTokenStatus(): FacebookGraphTokenStatus {
    return {
      status: 'active',
      pageName: 'Mini Post Official Page',
      pageId: 'FB-PAGE-9841204',
      tokenExpiresInDays: 54,
      scopes: ['pages_manage_posts', 'pages_read_engagement', 'read_insights'],
      lastValidatedAt: new Date().toISOString(),
    };
  }

  static getPostTypeMetrics(): FacebookPostTypeMetric[] {
    return [
      { type: 'Carousel', usageCount: 42, avgEngagementRate: '9.4%', avgCTR: '5.2%', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
      { type: 'Single Image', usageCount: 38, avgEngagementRate: '6.8%', avgCTR: '3.8%', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
      { type: 'Video Broadcast', usageCount: 24, avgEngagementRate: '11.8%', avgCTR: '6.4%', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
      { type: 'Link Post', usageCount: 19, avgEngagementRate: '4.2%', avgCTR: '2.9%', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    ];
  }

  static getFacebookTemplates(): FacebookTemplatePreset[] {
    return [
      { id: 'fb_tmpl_1', name: 'High-Impact Announcement Banner', category: 'Promotion', aspectRatio: '16:9', previewColor: '#06b6d4', recommendedFor: 'Product launches & major updates' },
      { id: 'fb_tmpl_2', name: 'Multi-Slide Product Showcase', category: 'Carousel', aspectRatio: '1:1', previewColor: '#3b82f6', recommendedFor: 'Feature walkthroughs & step-by-step guides' },
      { id: 'fb_tmpl_3', name: 'Customer Story & Quote Card', category: 'Testimonial', aspectRatio: '4:5', previewColor: '#8b5cf6', recommendedFor: 'Social proof & case studies' },
      { id: 'fb_tmpl_4', name: 'Event & Webinar Broadcast', category: 'Event', aspectRatio: '16:9', previewColor: '#f59e0b', recommendedFor: 'Live sessions & calendar invites' },
    ];
  }

  static getFacebookAnalytics() {
    return {
      totalReach: '38,400',
      impressions: '112,900',
      avgEngagementRate: '7.8%',
      avgCTR: '4.4%',
      carouselVsSingleImageGain: '+38.2% higher engagement on Carousels',
      bestPostingWindows: [
        { window: '01:00 PM - 03:00 PM EST', days: 'Mondays & Fridays', score: 'Peak (98%)' },
        { window: '09:00 AM - 11:00 AM EST', days: 'Wednesdays', score: 'High (92%)' },
      ],
    };
  }

  /**
   * Simultaneous Multi-Asset AI Generation Pipeline (Story 9:16 + Reel 9:16 + Feed Post 4:5)
   */
  /**
   * Simultaneous Multi-Asset AI Generation Pipeline via PromptOrchestrator
   */
  public static async generateMultiAssetBundle(
    topic: string,
    campaignType: FacebookCampaignType = 'lead_gen'
  ): Promise<FacebookMultiAssetBundle> {
    const profile = BrandService.getActiveBrandRules();
    const brandName = profile.brandName || 'Mini Post';
    const palette = this.getBrandPalette();

    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic,
      platforms: ['Facebook'],
      goal: 'Brand Awareness',
      tone: 'Professional',
      brandName,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Facebook AI generation failed.');
    }

    const aiContent = response.data.content || '';
    const headline = aiContent.split('\n')[0] || `Scale Facebook Campaigns: ${topic}`;
    const hashtags = response.data.hashtags || ['#FacebookMarketing', '#MiniPostApp'];

    const storyboard: VideoSceneStoryboard[] = [
      {
        sceneIndex: 1,
        heading: 'Hook & Problem Statement',
        onScreenAction: `Founder analyzing social media workflow for ${topic}`,
        voiceoverScript: `Stop spending hours managing Facebook posts. Here is how to master ${topic}.`,
        durationSeconds: 5,
      },
      {
        sceneIndex: 2,
        heading: 'Core Insights & Framework',
        onScreenAction: `Visual walkthrough of ${topic} content breakdown`,
        voiceoverScript: aiContent.slice(0, 180),
        durationSeconds: 15,
      },
      {
        sceneIndex: 3,
        heading: 'Call To Action',
        onScreenAction: `Brand callout for ${brandName} with colors (${palette.join(', ')})`,
        voiceoverScript: `Click link below to read the full guide and transform your Facebook reach today!`,
        durationSeconds: 10,
      },
    ];

    const imageUrl = response.data.imageUrl;
    const imageStatus = response.data.imageStatus;
    const imageError = response.data.imageError;

    return {
      topic,
      campaignType,
      storyAsset: {
        format: '9:16',
        stickerCta: 'TAP LINK TO ACCESS FULL GUIDE 🚀',
        caption: `🔥 Facebook Story: ${headline}`,
        visualPrompt: response.data.imagePrompt || `9:16 Facebook Story vertical card for topic: ${topic}`,
        imageUrl,
        imageStatus,
        imageError,
      },
      reelAsset: {
        format: '9:16',
        voiceoverVoice: 'Rachel (Upbeat Tech)',
        storyboard,
        visualPrompt: `9:16 Facebook Reel video for topic: ${topic}`,
      },
      feedAsset: {
        format: '4:5',
        headline,
        caption: `${aiContent}\n\n${hashtags.join(' ')}`,
        visualPrompt: response.data.imagePrompt || `4:5 Facebook Feed graphic for topic: ${topic}`,
        imageUrl,
        imageStatus,
        imageError,
      },
      colorPalette: palette,
    };
  }

  /**
   * Schedule & Dispatch Multi-Format Facebook Bundle via PublishingDispatchService
   */
  public static async scheduleMultiAssetBundle(
    bundle: FacebookMultiAssetBundle,
    scheduledAt?: string
  ): Promise<{ success: boolean; dispatchId?: string }> {
    // 1. Save visual assets to Asset Library
    AssetsService.addAsset({
      name: `Facebook_FeedAsset_${bundle.topic.replace(/\s+/g, '_')}`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      sizeBytes: 2548576,
      tags: ['facebook', 'feed', 'multi-asset'],
    });

    AssetsService.addAsset({
      name: `Facebook_ReelAsset_${bundle.topic.replace(/\s+/g, '_')}`,
      type: 'video',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
      sizeBytes: 15485760,
      tags: ['facebook', 'reel', 'multi-asset'],
    });

    // 2. Dispatch via PublishingDispatchService
    const fullContent = `[FACEBOOK FEED POST]\n${bundle.feedAsset.headline}\n\n${bundle.feedAsset.caption}\n\n[STORY STICKER]\n${bundle.storyAsset.stickerCta}\n\n[REEL SCRIPT]\n${bundle.reelAsset.storyboard.map((s) => `Scene ${s.sceneIndex}: ${s.voiceoverScript}`).join('\n')}`;

    const result = await PublishingDispatchService.dispatchPost({
      title: `Facebook Campaign Bundle: ${bundle.topic}`,
      content: fullContent,
      platforms: ['Facebook'],
      mediaPrompt: bundle.feedAsset.visualPrompt,
      scheduledTime: scheduledAt || new Date(Date.now() + 3600000).toISOString(),
    });

    return {
      success: result.success,
      dispatchId: result.logs?.[0]?.id || `disp_fb_bundle_${Date.now()}`,
    };
  }
}
