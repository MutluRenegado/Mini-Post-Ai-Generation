export interface AnalyticsMetric {
  label: string;
  value: string;
  change: string;
  color: string;
  isPositive: boolean;
}

export interface HashtagPerformance {
  tag: string;
  reach: string;
  engagement: string;
}

export interface PostingHourBreakdown {
  category: string;
  bestHours: string;
  peakDay: string;
}

export class StudioAnalyticsService {
  static getAnalyticsMetrics(timeRange: string = '30D'): AnalyticsMetric[] {
    const is7D = timeRange === '7D';
    const is90D = timeRange === '90D';

    return [
      {
        label: 'Total Reach',
        value: is7D ? '12,850' : is90D ? '142,600' : '45,200',
        change: '+12.4%',
        color: 'text-cyan-400',
        isPositive: true,
      },
      {
        label: 'Impressions',
        value: is7D ? '38,120' : is90D ? '398,500' : '128,450',
        change: '+18.1%',
        color: 'text-blue-400',
        isPositive: true,
      },
      {
        label: 'Click-Through Rate (CTR)',
        value: '4.8%',
        change: '+0.6%',
        color: 'text-emerald-400',
        isPositive: true,
      },
      {
        label: 'Engagement Rate',
        value: '8.2%',
        change: '+2.3%',
        color: 'text-amber-400',
        isPositive: true,
      },
    ];
  }

  static getTopHashtags(): HashtagPerformance[] {
    return [
      { tag: '#SaaS', reach: '14.2K', engagement: '9.4%' },
      { tag: '#NextJS', reach: '11.8K', engagement: '8.8%' },
      { tag: '#AIContent', reach: '18.5K', engagement: '11.2%' },
      { tag: '#WebDevelopment', reach: '9.3K', engagement: '7.6%' },
      { tag: '#TechTrends', reach: '12.1K', engagement: '8.1%' },
      { tag: '#MiniPostApp', reach: '22.4K', engagement: '14.6%' },
    ];
  }

  static getBestPostingHours(): PostingHourBreakdown[] {
    return [
      { category: 'LinkedIn & Professional', bestHours: '10:00 AM - 12:00 PM', peakDay: 'Tuesday & Thursday' },
      { category: 'X (Twitter) & Threads', bestHours: '02:00 PM - 04:00 PM', peakDay: 'Wednesday' },
      { category: 'Instagram (Feed & Story)', bestHours: '06:00 PM - 08:00 PM', peakDay: 'Friday' },
      { category: 'TikTok & YouTube Shorts', bestHours: '08:00 PM - 10:00 PM', peakDay: 'Saturday' },
      { category: 'Facebook & Google Business', bestHours: '01:00 PM - 03:00 PM', peakDay: 'Monday' },
      { category: 'Telegram & Bluesky', bestHours: '11:00 AM - 01:00 PM', peakDay: 'Daily' },
    ];
  }

  static getPlatformPerformance() {
    return [
      { platform: 'LinkedIn', sharePercent: 28, reach: '12.6K', color: 'bg-cyan-500' },
      { platform: 'Instagram', sharePercent: 24, reach: '10.8K', color: 'bg-indigo-500' },
      { platform: 'Twitter (X)', sharePercent: 20, reach: '9.0K', color: 'bg-purple-500' },
      { platform: 'TikTok & YouTube', sharePercent: 16, reach: '7.2K', color: 'bg-rose-500' },
      { platform: 'Other Platforms', sharePercent: 12, reach: '5.6K', color: 'bg-emerald-500' },
    ];
  }
}

