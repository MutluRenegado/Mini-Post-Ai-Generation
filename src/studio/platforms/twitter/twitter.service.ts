'use client';

import { BrandService } from '@/lib/services/brandService';
import { PublishingDispatchService } from '@/lib/services/publishingDispatchService';
import { AssetsService } from '@/lib/services/assetsService';
import { StudioClientService } from '@/lib/services/studioClientService';

export interface TwitterPostDraft {
  id: string;
  tweetText: string;
  characterCount: number;
  hashtags: string[];
  cashtags: string[];
  visualPrompt: string;
  isThread: boolean;
  threadPosts?: string[];
}

export class TwitterStudioService {
  public static getBrandPalette(): [string, string, string] {
    const profile = BrandService.getActiveBrandRules();
    return [
      profile.primaryColor || '#1DA1F2',
      profile.secondaryColor || '#000000',
      profile.accentColor || '#17BF63',
    ];
  }

  public static async generateTwitterPost(topic: string, isThread: boolean = false): Promise<TwitterPostDraft> {
    const palette = this.getBrandPalette();

    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic,
      platforms: ['Twitter (X)'],
      goal: 'Engagement',
      tone: 'Bold',
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Twitter post generation failed.');
    }

    const content = response.data.content || '';
    const hashtags = response.data.hashtags || ['#BuildInPublic', '#AIGrowth', '#Tech'];
    const visualPrompt = response.data.imagePrompt || `16:9 Twitter graphic for topic: ${topic}`;

    if (isThread) {
      const paragraphs = content.split('\n\n').filter((p) => p.trim());
      const threadPosts = paragraphs.length >= 2
        ? paragraphs.map((p, idx) => `🧵 ${idx + 1}/${paragraphs.length} ${p.slice(0, 240)}`)
        : [
            `🧵 1/2 ${content.slice(0, 240)}`,
            `2/2 Save & bookmark this thread for daily insights on ${topic}! #Tech`,
          ];

      return {
        id: `tweet_${Date.now()}`,
        tweetText: threadPosts[0],
        characterCount: threadPosts[0].length,
        hashtags,
        cashtags: ['$NVDA', '$BTC'],
        visualPrompt,
        isThread: true,
        threadPosts,
      };
    }

    const tweetText = content.length > 270 ? content.slice(0, 267) + '...' : content;

    return {
      id: `tweet_${Date.now()}`,
      tweetText,
      characterCount: tweetText.length,
      hashtags,
      cashtags: ['$BTC', '$NVDA'],
      visualPrompt,
      isThread: false,
    };
  }

  public static async scheduleTwitterPost(
    draft: TwitterPostDraft,
    scheduledAt?: string
  ): Promise<{ success: boolean; dispatchId?: string }> {
    AssetsService.addAsset({
      name: `Twitter_X_Asset_${draft.id}`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      sizeBytes: 1945760,
      tags: ['twitter', 'x', '16:9', 'tweet'],
    });

    const fullContent = draft.isThread && draft.threadPosts
      ? draft.threadPosts.join('\n\n--- TWEET ---\n\n')
      : `${draft.tweetText}\n\n${draft.hashtags.join(' ')} ${draft.cashtags.join(' ')}`;

    const result = await PublishingDispatchService.dispatchPost({
      title: `Twitter (X) ${draft.isThread ? 'Thread' : 'Tweet'}: ${draft.tweetText.slice(0, 30)}...`,
      content: fullContent,
      platforms: ['Twitter (X)'],
      mediaPrompt: draft.visualPrompt,
      scheduledTime: scheduledAt || new Date(Date.now() + 3600000).toISOString(),
    });

    return {
      success: result.success,
      dispatchId: result.logs?.[0]?.id || `disp_tw_${Date.now()}`,
    };
  }
}
