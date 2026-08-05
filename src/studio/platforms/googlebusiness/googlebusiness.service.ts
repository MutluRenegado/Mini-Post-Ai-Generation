'use client';

import { StudioClientService } from '@/lib/services/studioClientService';

export class GoogleBusinessService {
  static getMetrics() {
    return {
      searchViews: '24,600',
      mapsViews: '18,400',
      actionClicks: '1,280',
      avgRating: '4.9 ⭐',
    };
  }

  static async generateLocalBusinessUpdate(topic: string) {
    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic,
      platforms: ['Google Business'],
      goal: 'Local Business Traffic',
      tone: 'Professional & Welcoming',
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Google Business update generation failed.');
    }

    const content = response.data.content || '';
    const title = response.data.title || `Special Update: ${topic}`;

    return {
      title,
      body: content,
      callToAction: 'Book Appointment',
      recommendedPhotos: ['Office Storefront', 'Team Photo', 'Product Showcase'],
    };
  }
}
