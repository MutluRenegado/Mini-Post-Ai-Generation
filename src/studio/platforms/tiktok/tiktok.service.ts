'use client';

import { BrandService } from '@/lib/services/brandService';
import { PublishingDispatchService } from '@/lib/services/publishingDispatchService';
import { AssetsService } from '@/lib/services/assetsService';
import { StudioClientService } from '@/lib/services/studioClientService';

export type TikTokCampaignMode = 'spark_ads' | 'organic_viral' | 'creator_marketplace' | 'tiktok_shop';

export interface TikTokStoryboardScene {
  sceneIndex: number;
  timeRange: string;
  visualAction: string;
  audioVoiceover: string;
  trendingSoundHook: string;
}

export interface TikTokMultiAssetBundle {
  topic: string;
  campaignMode: TikTokCampaignMode;
  viralHookText: string;
  storyboard: TikTokStoryboardScene[];
  autoCaptionsStyle: string;
  trendingAudioTrack: string;
  hashtags: string[];
  visualPrompt: string;
  colorPalette: [string, string, string];
}

export class TikTokStudioService {
  /**
   * Get Brand Kit 3-Color Palette
   */
  public static getBrandPalette(): [string, string, string] {
    const profile = BrandService.getActiveBrandRules();
    return [
      profile.primaryColor || '#00F2FE',
      profile.secondaryColor || '#FF0050',
      profile.accentColor || '#000000',
    ];
  }

  /**
   * Algorithm Intelligence: TikTok Best Practices & Trending Hooks
   */
  public static getAlgorithmTips(mode: TikTokCampaignMode): {
    hookStrength: string;
    optimalDuration: string;
    soundStrategy: string;
    algorithmRecommendation: string;
  } {
    switch (mode) {
      case 'spark_ads':
        return {
          hookStrength: 'High Urgency (0-2s)',
          optimalDuration: '15 - 21 Seconds',
          soundStrategy: 'Commercial Licensed Trending Sound',
          algorithmRecommendation: 'Spark Ads boost native organic views by +45% when combining text overlays with strong call-to-action stickers.',
        };
      case 'tiktok_shop':
        return {
          hookStrength: 'Product Reveal (0-3s)',
          optimalDuration: '24 - 30 Seconds',
          soundStrategy: 'Upbeat High-Tempo Rhythm',
          algorithmRecommendation: 'Tag direct product links within the first 3 seconds to maximize in-app checkout conversion.',
        };
      case 'creator_marketplace':
        return {
          hookStrength: 'Relatable Storytelling (0-4s)',
          optimalDuration: '30 - 45 Seconds',
          soundStrategy: 'Voiceover + Lo-Fi Background',
          algorithmRecommendation: 'Creator collaborations maintain 2.4X longer view duration when structured as genuine non-scripted reviews.',
        };
      case 'organic_viral':
      default:
        return {
          hookStrength: 'Pattern Interrupt (0-1.5s)',
          optimalDuration: '12 - 18 Seconds',
          soundStrategy: 'Viral FYP Trending Track',
          algorithmRecommendation: 'The FYP algorithm prioritizes watch completion rate (>80%) and fast comment loop replies.',
        };
    }
  }

  /**
   * Generate synchronized TikTok multi-asset bundle via PromptOrchestrator
   */
  public static async generateTikTokBundle(
    topic: string,
    campaignMode: TikTokCampaignMode = 'organic_viral'
  ): Promise<TikTokMultiAssetBundle> {
    const profile = BrandService.getActiveBrandRules();
    const brandName = profile.brandName || 'Mini Post';
    const palette = this.getBrandPalette();

    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic,
      platforms: ['TikTok'],
      goal: 'Viral Reach',
      tone: 'Energetic',
      brandName,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'TikTok AI generation failed.');
    }

    const aiContent = response.data.content || '';
    const hashtags = response.data.hashtags || ['#TikTokGrowth', '#FYP', '#MiniPostApp'];
    const visualPrompt = response.data.imagePrompt || `9:16 vertical TikTok video graphic for topic: ${topic}`;

    const storyboard: TikTokStoryboardScene[] = [
      {
        sceneIndex: 1,
        timeRange: '0:00 - 0:03',
        visualAction: `Pattern Interrupt: Fast zoom on screen showing ${topic} with brand colors (${palette[0]}, ${palette[1]})`,
        audioVoiceover: `Stop scrolling if you want to master ${topic}!`,
        trendingSoundHook: '🔥 [Viral FYP Bass Drop]',
      },
      {
        sceneIndex: 2,
        timeRange: '0:03 - 0:15',
        visualAction: `Screen walkthrough of core points for ${topic}`,
        audioVoiceover: aiContent.slice(0, 180),
        trendingSoundHook: '🎵 [Subtle High Tempo Synth]',
      },
      {
        sceneIndex: 3,
        timeRange: '0:15 - 0:24',
        visualAction: `Point to comment section CTA with glowing neon text sticker and brand logo`,
        audioVoiceover: `Hit + follow and tap the link in bio for more!`,
        trendingSoundHook: '⚡ [Upbeat Outro Beat]',
      },
    ];

    return {
      topic,
      campaignMode,
      viralHookText: `POV: You discovered the best strategy for ${topic} 🤯`,
      storyboard,
      autoCaptionsStyle: 'Bold Yellow Kinetic Pop',
      trendingAudioTrack: 'FYP Top 50 Trending Track (Commercial License)',
      hashtags,
      visualPrompt,
      colorPalette: palette,
    };
  }

  /**
   * Schedule & Dispatch TikTok Campaign Bundle via PublishingDispatchService
   */
  public static async scheduleTikTokBundle(
    bundle: TikTokMultiAssetBundle,
    scheduledAt?: string
  ): Promise<{ success: boolean; dispatchId?: string }> {
    // 1. Save visual & video asset to Asset Library
    AssetsService.addAsset({
      name: `TikTok_9x16_Video_${bundle.topic.replace(/\s+/g, '_')}`,
      type: 'video',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
      sizeBytes: 16485760,
      tags: ['tiktok', 'fyp', '9:16', 'vertical-video'],
    });

    // 2. Dispatch via PublishingDispatchService
    const fullContent = `[TIKTOK VIRAL HOOK]\n${bundle.viralHookText}\n\n[STORYBOARD SCRIPT]\n${bundle.storyboard.map((s) => `[${s.timeRange}] ${s.audioVoiceover}`).join('\n')}\n\n[HASHTAGS]\n${bundle.hashtags.join(' ')}`;

    const result = await PublishingDispatchService.dispatchPost({
      title: `TikTok Campaign: ${bundle.topic}`,
      content: fullContent,
      platforms: ['TikTok'],
      mediaPrompt: bundle.visualPrompt,
      scheduledTime: scheduledAt || new Date(Date.now() + 3600000).toISOString(),
    });

    return {
      success: result.success,
      dispatchId: result.logs?.[0]?.id || `disp_tiktok_${Date.now()}`,
    };
  }
}
