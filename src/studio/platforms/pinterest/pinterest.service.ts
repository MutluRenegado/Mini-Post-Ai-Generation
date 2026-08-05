'use client';

import { StudioClientService } from '@/lib/services/studioClientService';

export class PinterestPlatformService {
  static getMetrics() {
    return {
      monthlyOutboundClicks: '18,600',
      pinSaveCount: '4,200',
      totalImpressions: '142,000',
      topPerformingCategory: 'Infographics & DIY Guides',
    };
  }

  static async generatePinBundle(topic: string) {
    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic,
      platforms: ['Pinterest'],
      goal: 'Traffic & Saves',
      tone: 'Informative & Visual',
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Pinterest AI pin generation failed.');
    }

    const content = response.data.content || '';
    const firstLine = content.split('\n')[0] || `Guide to ${topic}`;

    return {
      title: response.data.title || `📌 ${firstLine}`,
      description: content.length > 300 ? content.slice(0, 297) + '...' : content,
      destinationUrl: 'https://minipost.app/blog/guide',
      suggestedBoard: 'Tech & Marketing Strategy',
      altText: `Vertical 2:3 Pinterest infographic covering ${topic}`,
      visualPrompt: response.data.imagePrompt || `2:3 ratio vertical Pinterest pin graphic for topic: ${topic}`,
    };
  }
}
