'use client';

import { BrandService } from '@/lib/services/brandService';
import { PublishingDispatchService } from '@/lib/services/publishingDispatchService';
import { AssetsService } from '@/lib/services/assetsService';
import { StudioClientService } from '@/lib/services/studioClientService';

export type ThreadsTone = 'provocative' | 'storytelling' | 'educational';

export interface ThreadsPostPart {
  partIndex: number;
  content: string;
  charCount: number;
  hasVisualAsset: boolean;
}

export interface ThreadsThreadPackage {
  topic: string;
  tone: ThreadsTone;
  parts: ThreadsPostPart[];
  visualPrompt: string;
  colorPalette: [string, string, string];
}

export class ThreadsStudioService {
  /**
   * Get Brand Kit 3-Color Palette
   */
  public static getBrandPalette(): [string, string, string] {
    const profile = BrandService.getActiveBrandRules();
    return [
      profile.primaryColor || '#000000',
      profile.secondaryColor || '#06B6D4',
      profile.accentColor || '#EC4899',
    ];
  }

  /**
   * Generate multi-part serial thread via PromptOrchestrator
   */
  public static async generateSerializedThread(topic: string, tone: ThreadsTone): Promise<ThreadsThreadPackage> {
    const profile = BrandService.getActiveBrandRules();
    const brandName = profile.brandName || 'Mini Post';
    const palette = this.getBrandPalette();

    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic,
      platforms: ['Threads'],
      goal: 'Engagement',
      tone,
      brandName,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Threads serial thread generation failed.');
    }

    const content = response.data.content || '';
    const paragraphs = content.split('\n\n').filter((p) => p.trim());
    const visualPrompt = response.data.imagePrompt || `Minimalist 4:5 Threads graphic for topic: ${topic}`;

    const parts: ThreadsPostPart[] = paragraphs.map((p, idx) => ({
      partIndex: idx + 1,
      content: p,
      charCount: p.length,
      hasVisualAsset: idx === 0 || idx === paragraphs.length - 1,
    }));

    if (parts.length === 0) {
      parts.push({ partIndex: 1, content, charCount: content.length, hasVisualAsset: true });
    }

    return {
      topic,
      tone,
      parts,
      visualPrompt,
      colorPalette: palette,
    };
  }

  /**
   * Schedule & dispatch multi-part thread via PublishingDispatchService to Threads
   */
  public static async scheduleThreadsPackage(
    pkg: ThreadsThreadPackage,
    scheduledAt?: string
  ): Promise<{ success: boolean; dispatchId?: string }> {
    // 1. Save visual prompt to Asset Library
    AssetsService.addAsset({
      name: `Threads_4x5_TextCard_${pkg.topic.replace(/\s+/g, '_')}`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      sizeBytes: 1845760,
      tags: ['threads', 'text-card', '4:5', 'multi-post'],
    });

    // 2. Combine thread parts for dispatch payload
    const fullThreadBody = pkg.parts.map((p) => `--- [Part ${p.partIndex}] ---\n${p.content}`).join('\n\n');

    const result = await PublishingDispatchService.dispatchPost({
      title: `Threads Multi-Part Post: ${pkg.topic}`,
      content: fullThreadBody,
      platforms: ['Threads'],
      mediaPrompt: pkg.visualPrompt,
      scheduledTime: scheduledAt || new Date(Date.now() + 3600000).toISOString(),
    });

    return {
      success: result.success,
      dispatchId: result.logs?.[0]?.id || `disp_threads_${Date.now()}`,
    };
  }
}
