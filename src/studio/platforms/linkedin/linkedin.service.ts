'use client';

import { StudioClientService } from '@/lib/services/studioClientService';

export interface LinkedInMetrics {
  totalConnections: string;
  postImpressions: string;
  profileViews: string;
  avgEngagementRate: string;
}

export class LinkedInPlatformService {
  static getMetrics(): LinkedInMetrics {
    return {
      totalConnections: '14,850',
      postImpressions: '84,200',
      profileViews: '1,420',
      avgEngagementRate: '8.6%',
    };
  }

  static async generateThoughtLeadershipPost(topic: string, angle: string = 'Strategic Insight') {
    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic: `${angle}: ${topic}`,
      platforms: ['LinkedIn'],
      goal: 'Thought Leadership',
      tone: 'Professional',
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'LinkedIn thought leadership post generation failed.');
    }

    const content = response.data.content || '';
    const lines = content.split('\n');
    const hook = lines[0] || `Strategic analysis of ${topic}`;
    const body = lines.slice(1).join('\n').trim() || content;
    const hashtags = response.data.hashtags || ['#Leadership', '#Strategy', '#Innovation', '#EnterpriseAI'];

    return {
      topic,
      angle,
      hook,
      body,
      hashtags,
      charCount: content.length,
    };
  }
}
