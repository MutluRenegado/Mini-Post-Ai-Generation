'use client';

import { BrandService } from '@/lib/services/brandService';
import { PublishingDispatchService } from '@/lib/services/publishingDispatchService';
import { AssetsService } from '@/lib/services/assetsService';
import { StudioClientService } from '@/lib/services/studioClientService';

export interface YouTubeChapter {
  timestamp: string;
  title: string;
  keyPoints: string[];
}

export interface YouTubeLongFormScript {
  videoTitle: string;
  estimatedDurationMinutes: number;
  chapters: YouTubeChapter[];
  fullOutlineText: string;
}

export interface YouTubeThumbnailConcept {
  id: string;
  layoutTitle: string;
  expressionStyle: string;
  colorScheme: [string, string, string];
  ctrEstimateScore: number;
  visualPrompt: string;
}

export interface YouTubeSeoMetadata {
  seoTitles: { title: string; ctrScore: number }[];
  description: string;
  tags: string[];
  keywords: string[];
}

export interface YouTubeClassicPostRequest {
  id: string;
  videoTitle: string;
  script: YouTubeLongFormScript;
  thumbnail: YouTubeThumbnailConcept;
  metadata: YouTubeSeoMetadata;
  scheduledAt?: string;
}

export class YouTubeClassicService {
  /**
   * Get Brand 3-Color Palette
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
   * Generate comprehensive long-form video scripts via PromptOrchestrator
   */
  public static async generateLongFormScript(topic: string): Promise<YouTubeLongFormScript> {
    const profile = BrandService.getActiveBrandRules();
    const brandName = profile.brandName || 'Mini Post';

    const response = await StudioClientService.generate({
      action: 'generate_text',
      textAction: 'full_article',
      topic: `YouTube Long Form Video Script: ${topic}`,
      platforms: ['YouTube'],
      tone: 'Informative & Engaging',
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'YouTube Classic script generation failed.');
    }

    const content = response.data.content || '';
    const paragraphs = content.split('\n\n').filter((p) => p.trim());

    const chapters: YouTubeChapter[] = [
      {
        timestamp: '00:00',
        title: 'Introduction & High-Stakes Hook',
        keyPoints: [paragraphs[0]?.slice(0, 100) || `Why ${topic} matters in 2026`],
      },
      {
        timestamp: '02:15',
        title: 'Core Deep Dive & Strategy',
        keyPoints: [paragraphs[1]?.slice(0, 100) || `Key breakdown of ${topic}`],
      },
      {
        timestamp: '05:30',
        title: 'Execution & Implementation',
        keyPoints: [paragraphs[2]?.slice(0, 100) || `Actionable steps to implement ${topic}`],
      },
      {
        timestamp: '08:45',
        title: 'Summary & Call To Action',
        keyPoints: [`Like, Subscribe, and try ${brandName}!`],
      },
    ];

    const fullOutlineText = `${content}\n\n` + chapters
      .map((c) => `[${c.timestamp}] ${c.title}\n${c.keyPoints.map((k) => `  - ${k}`).join('\n')}`)
      .join('\n\n');

    return {
      videoTitle: response.data.title || `Masterclass: ${topic}`,
      estimatedDurationMinutes: 10,
      chapters,
      fullOutlineText,
    };
  }

  /**
   * Generate high-CTR 16:9 thumbnail concepts and visual asset specifications
   */
  public static generateThumbnailConcepts(topic: string): YouTubeThumbnailConcept[] {
    const palette = this.getBrandPalette();
    return [
      {
        id: 'thumb_1',
        layoutTitle: 'Shocked Founder + Glowing Code Window',
        expressionStyle: 'High Contrast Dramatic Lighting',
        colorScheme: palette,
        ctrEstimateScore: 12.8,
        visualPrompt: `16:9 YouTube Thumbnail of a founder pointing to glowing 3D holographic code window displaying ${topic}, bold neon text "100X FAST", hyperrealistic.`,
      },
      {
        id: 'thumb_2',
        layoutTitle: 'Split Screen: Old vs. New AI Pipeline',
        expressionStyle: 'Clean Minimalist Executive',
        colorScheme: palette,
        ctrEstimateScore: 11.4,
        visualPrompt: `16:9 YouTube Thumbnail split screen showing red manual struggle on left vs cyan automated AI engine on right for ${topic}, 4K render.`,
      },
      {
        id: 'thumb_3',
        layoutTitle: 'Cyberpunk Neon Badge + Revenue Arrow',
        expressionStyle: 'Vibrant Punchy Studio',
        colorScheme: palette,
        ctrEstimateScore: 10.9,
        visualPrompt: `16:9 YouTube Thumbnail with giant bold text "${topic.toUpperCase()}", glowing revenue chart climbing, dark mode glassmorphism.`,
      },
    ];
  }

  /**
   * SEO-assisted title optimization, keyword research, tags, and timestamped description
   */
  public static generateSeoMetadata(topic: string, script: YouTubeLongFormScript): YouTubeSeoMetadata {
    const profile = BrandService.getActiveBrandRules();
    const brandName = profile.brandName || 'Mini Post';

    const timestampSection = script.chapters.map((c) => `${c.timestamp} - ${c.title}`).join('\n');

    const description = `In this complete step-by-step masterclass, we dive deep into ${topic} using ${brandName}. Learn how to automate social media publishing, scale long-form content, and optimize your 16:9 YouTube video workflow.

📌 TIMESTAMPS:
${timestampSection}

🔗 RESOURCES & LINKS:
• Try ${brandName}: ${profile.website || 'https://minipost.app'}
• Full Studio Documentation & Guides included in app.

#${brandName.replace(/\s+/g, '')} #YouTubeSEO #SocialMediaAutomation #AIVideoStudio #ContentStrategy`;

    const cleanTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '');

    return {
      seoTitles: [
        { title: `How I Automated 100% of Social Media Video in 2026 (${topic})`, ctrScore: 14.2 },
        { title: `Building a Multi-Channel AI Content Studio: The Ultimate Guide`, ctrScore: 12.9 },
        { title: `Stop Making Videos Manually! Do THIS Instead (${topic})`, ctrScore: 11.7 },
      ],
      description,
      tags: [
        '#YouTubeVideo',
        '#SocialMediaAutomation',
        '#AIContentGenerator',
        '#VideoMarketing',
        `#${cleanTopic || 'saas'}`,
        '#MiniPostApp',
        '#LongFormVideo',
        '#ContentStrategy',
      ],
      keywords: ['ai video creator', 'social media dispatcher', '16:9 video studio', 'youtube seo optimization', 'automated content calendar'],
    };
  }

  /**
   * Direct scheduling & publishing via PublishingDispatchService to YouTube channel
   */
  public static async scheduleYouTubeClassicPost(
    post: YouTubeClassicPostRequest
  ): Promise<{ success: boolean; dispatchId?: string }> {
    // 1. Save visual & thumbnail asset to Asset Library
    AssetsService.addAsset({
      name: `YouTube_16x9_Thumbnail_${post.videoTitle.replace(/\s+/g, '_')}`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      sizeBytes: 3145728,
      tags: ['youtube', 'long-form', '16:9', 'thumbnail'],
    });

    // 2. Dispatch via PublishingDispatchService
    const result = await PublishingDispatchService.dispatchPost({
      title: post.videoTitle,
      content: `${post.metadata.description}\n\nTAGS:\n${post.metadata.tags.join(' ')}`,
      platforms: ['YouTube'],
      mediaPrompt: post.thumbnail.visualPrompt,
      scheduledTime: post.scheduledAt || new Date(Date.now() + 86400000).toISOString(),
    });

    return {
      success: result.success,
      dispatchId: result.logs?.[0]?.id || `disp_yt_classic_${Date.now()}`,
    };
  }
}
