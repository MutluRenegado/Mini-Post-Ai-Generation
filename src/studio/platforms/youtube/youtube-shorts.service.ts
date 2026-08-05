'use client';

import { BrandService } from '@/lib/services/brandService';
import { PublishingDispatchService } from '@/lib/services/publishingDispatchService';
import { AssetsService } from '@/lib/services/assetsService';
import { StudioClientService } from '@/lib/services/studioClientService';

export interface ShortsScript {
  hook: string;
  middle: string;
  cta: string;
  estimatedDurationSeconds: number;
}

export interface ShortsAudioPreset {
  voiceId: string;
  voiceName: string;
  backgroundTrack: string;
}

export interface YouTubeShortsPostRequest {
  id: string;
  title: string;
  script: ShortsScript;
  visualPrompt: string;
  voicePreset: string;
  backgroundMusic: string;
  captionStyle: string;
  tags: string[];
  scheduledAt?: string;
}

export class YouTubeShortsService {
  /**
   * Get Brand Kit 3-Color Palette
   */
  public static getBrandPalette(): [string, string, string] {
    const profile = BrandService.getActiveBrandRules();
    return [
      profile.primaryColor || '#FF0000',
      profile.secondaryColor || '#06B6D4',
      profile.accentColor || '#F59E0B',
    ];
  }

  /**
   * Generate engaging 60-second video script via PromptOrchestrator
   */
  public static async generateShortsScript(topic: string): Promise<ShortsScript> {
    const profile = BrandService.getActiveBrandRules();
    const brandName = profile.brandName || 'Mini Post';

    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic,
      platforms: ['YouTube Shorts'],
      goal: 'Engagement & Views',
      tone: 'Energetic',
      brandName,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'YouTube Shorts script generation failed.');
    }

    const content = response.data.content || '';
    const paragraphs = content.split('\n\n').filter((p) => p.trim());

    return {
      hook: `🔥 Stop scrolling! ${paragraphs[0]?.slice(0, 120) || `Here is the truth about ${topic}`}`,
      middle: paragraphs.slice(1).join('\n\n') || content,
      cta: `👉 Subscribe and tap the link in bio to learn more!`,
      estimatedDurationSeconds: 55,
    };
  }

  /**
   * Available AI Voiceover Voices & Royalty-Free Audio Tracks
   */
  public static getAudioOptions(): {
    voices: { id: string; name: string; style: string }[];
    tracks: { id: string; name: string; genre: string }[];
  } {
    return {
      voices: [
        { id: 'v_rachel', name: 'Rachel (Energetic Founder)', style: 'Natural, Upbeat' },
        { id: 'v_marcus', name: 'Marcus (Executive Tech)', style: 'Deep, Authoritative' },
        { id: 'v_adam', name: 'Adam (Narrator)', style: 'Clear, Professional' },
        { id: 'v_bella', name: 'Bella (Creator Tech)', style: 'Modern, Engaging' },
      ],
      tracks: [
        { id: 't_saas_synth', name: 'Cyberpunk SaaS Synth', genre: 'Electronic Tech' },
        { id: 't_lofi_executive', name: 'Lo-Fi Executive Chill', genre: 'Ambient Chill' },
        { id: 't_upbeat_future', name: 'Upbeat Future Bass', genre: 'High Energy' },
        { id: 't_minimal_pulse', name: 'Minimalist Pulse', genre: 'Subtle Corporate' },
      ],
    };
  }

  /**
   * Available Caption Styling Presets
   */
  public static getCaptionStyles(): { id: string; name: string; preview: string }[] {
    return [
      { id: 'c_yellow_pop', name: 'Yellow Pop (Hormozi Style)', preview: 'BOLD YELLOW HIGHLIGHT WITH KINETIC BOUNCE' },
      { id: 'c_cyan_glow', name: 'Cyan Tech Glow', preview: 'GLOWING CYAN SUBTITLES WITH GRADIENT BG' },
      { id: 'c_minimal_white', name: 'Minimalist White Bold', preview: 'CLEAN WHITE TEXT WITH DROP SHADOW' },
    ];
  }

  /**
   * Direct scheduling & publishing via PublishingDispatchService to YouTube Shorts
   */
  public static async scheduleYouTubeShort(
    post: YouTubeShortsPostRequest
  ): Promise<{ success: boolean; dispatchId?: string }> {
    // 1. Save visual & video asset to Asset Library
    AssetsService.addAsset({
      name: `YouTube_Shorts_${post.title.replace(/\s+/g, '_')}`,
      type: 'video',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
      sizeBytes: 14857600,
      tags: ['youtube', 'shorts', '9:16', 'vertical-video'],
    });

    // 2. Dispatch via PublishingDispatchService
    const fullScriptText = `[HOOK]\n${post.script.hook}\n\n[BODY]\n${post.script.middle}\n\n[CTA]\n${post.script.cta}`;
    const result = await PublishingDispatchService.dispatchPost({
      title: `YouTube Short: ${post.title}`,
      content: `${fullScriptText}\n\n${post.tags.join(' ')}`,
      platforms: ['YouTube'],
      mediaPrompt: post.visualPrompt,
      scheduledTime: post.scheduledAt || new Date(Date.now() + 3600000).toISOString(),
    });

    return {
      success: result.success,
      dispatchId: result.logs?.[0]?.id || `disp_yt_${Date.now()}`,
    };
  }
}
