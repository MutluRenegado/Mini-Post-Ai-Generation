export interface SocialPlatformConfig {
  id: string;
  name: string;
  category: string;
  apiName: string;
  tokenStatus: 'active' | 'expiring_soon' | 'expired';
  tokenExpiresInDays: number;
  handle: string;
  followersCount: string;
  postTypes: { name: string; sharePercent: string; avgEngagement: string }[];
  templates: { name: string; format: string; desc: string }[];
  metrics: { reach: string; impressions: string; ctr: string; engagementRate: string };
  bestPostingWindow: string;
}

export class PlatformHubService {
  static getAllPlatformConfigs(): SocialPlatformConfig[] {
    return [
      {
        id: 'facebook',
        name: 'Facebook',
        category: 'Meta Ecosystem',
        apiName: 'Meta Graph API v19.0',
        tokenStatus: 'active',
        tokenExpiresInDays: 54,
        handle: '@miniposthq',
        followersCount: '9,400',
        postTypes: [
          { name: 'Multi-Slide Carousel', sharePercent: '42%', avgEngagement: '9.4%' },
          { name: 'Single Image Banner', sharePercent: '38%', avgEngagement: '6.8%' },
          { name: 'Video Broadcast', sharePercent: '20%', avgEngagement: '11.8%' },
        ],
        templates: [
          { name: 'High-Impact Product Banner', format: '16:9', desc: 'Optimal for announcements' },
          { name: 'Feature Showcase Carousel', format: '1:1', desc: 'Optimal for step-by-step guides' },
        ],
        metrics: { reach: '38,400', impressions: '112,900', ctr: '4.4%', engagementRate: '7.8%' },
        bestPostingWindow: '01:00 PM - 03:00 PM EST (Mon & Fri)',
      },
      {
        id: 'twitter',
        name: 'Twitter (X)',
        category: 'Microblogging',
        apiName: 'X API v2 OAuth 2.0',
        tokenStatus: 'active',
        tokenExpiresInDays: 88,
        handle: '@MiniPostApp',
        followersCount: '28,900',
        postTypes: [
          { name: 'Multi-Tweet Threads', sharePercent: '55%', avgEngagement: '12.4%' },
          { name: 'Single Tweet + Image', sharePercent: '30%', avgEngagement: '7.2%' },
          { name: 'Text-Only Hot Take', sharePercent: '15%', avgEngagement: '8.9%' },
        ],
        templates: [
          { name: '5-Step Educational Thread', format: '280-char', desc: 'Viral thread hook layout' },
          { name: 'Product Release ChangeLog', format: '280-char', desc: 'Bullet points with link preview' },
        ],
        metrics: { reach: '84,200', impressions: '241,000', ctr: '5.8%', engagementRate: '9.5%' },
        bestPostingWindow: '09:00 AM - 11:00 AM EST (Tue & Thu)',
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        category: 'B2B Professional',
        apiName: 'LinkedIn Community Management API',
        tokenStatus: 'active',
        tokenExpiresInDays: 60,
        handle: '@minipost-app',
        followersCount: '14,200',
        postTypes: [
          { name: 'PDF Carousel Document', sharePercent: '48%', avgEngagement: '14.2%' },
          { name: 'Long-Form Article Post', sharePercent: '32%', avgEngagement: '8.6%' },
          { name: 'Single Image Insights', sharePercent: '20%', avgEngagement: '6.4%' },
        ],
        templates: [
          { name: 'B2B Thought Leadership Carousel', format: 'PDF 4:5', desc: 'High conversion slide deck' },
          { name: 'Case Study ROI breakdown', format: 'Text + PDF', desc: 'Client success breakdown' },
        ],
        metrics: { reach: '52,100', impressions: '145,000', ctr: '6.2%', engagementRate: '11.4%' },
        bestPostingWindow: '08:00 AM - 10:00 AM EST (Tue & Wed)',
      },
      {
        id: 'instagram',
        name: 'Instagram (Feed)',
        category: 'Visual & Reels',
        apiName: 'Instagram Graph API',
        tokenStatus: 'active',
        tokenExpiresInDays: 54,
        handle: '@minipost_studio',
        followersCount: '19,800',
        postTypes: [
          { name: 'Reels Short-Video', sharePercent: '50%', avgEngagement: '16.4%' },
          { name: 'Multi-Slide Carousel', sharePercent: '35%', avgEngagement: '11.2%' },
          { name: 'Single Grid Image', sharePercent: '15%', avgEngagement: '5.4%' },
        ],
        templates: [
          { name: 'Viral Reel Hook Template', format: '9:16 Video', desc: 'Fast text overlay animation' },
          { name: 'Infographic Slide Deck', format: '1:1 Square', desc: 'Seamless side scroll grid' },
        ],
        metrics: { reach: '68,900', impressions: '192,000', ctr: '3.9%', engagementRate: '12.8%' },
        bestPostingWindow: '06:00 PM - 09:00 PM EST (Wed & Sat)',
      },
      {
        id: 'youtube',
        name: 'YouTube & Shorts',
        category: 'Video Broadcast',
        apiName: 'YouTube Data API v3',
        tokenStatus: 'active',
        tokenExpiresInDays: 120,
        handle: '@MiniPostChannel',
        followersCount: '32,100',
        postTypes: [
          { name: 'YouTube Shorts (Vertical)', sharePercent: '60%', avgEngagement: '18.2%' },
          { name: 'Long-Form Video Tutorial', sharePercent: '40%', avgEngagement: '14.5%' },
        ],
        templates: [
          { name: '60s Tech Shorts Breakdown', format: '9:16 Shorts', desc: 'High engagement subtitle style' },
          { name: 'Product Demo Deep Dive', format: '16:9 4K', desc: 'Intro bumper + chapter links' },
        ],
        metrics: { reach: '128,000', impressions: '410,000', ctr: '7.4%', engagementRate: '15.2%' },
        bestPostingWindow: '02:00 PM - 05:00 PM EST (Thu & Fri)',
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        category: 'Short Video',
        apiName: 'TikTok Content Posting API',
        tokenStatus: 'active',
        tokenExpiresInDays: 45,
        handle: '@minipost_tiktok',
        followersCount: '45,600',
        postTypes: [
          { name: 'Vertical Reel Video', sharePercent: '75%', avgEngagement: '21.4%' },
          { name: 'Photo Carousel Slides', sharePercent: '25%', avgEngagement: '13.8%' },
        ],
        templates: [
          { name: 'Trending Audio Product Demo', format: '9:16 Vertical', desc: 'Viral sound pairing layout' },
        ],
        metrics: { reach: '184,000', impressions: '620,000', ctr: '8.2%', engagementRate: '19.4%' },
        bestPostingWindow: '07:00 PM - 10:00 PM EST (Everyday)',
      },
      {
        id: 'google_business',
        name: 'Google Business',
        category: 'Local SEO',
        apiName: 'Google Business Profile API',
        tokenStatus: 'active',
        tokenExpiresInDays: 90,
        handle: 'G-BUS-948',
        followersCount: 'N/A (Local Views)',
        postTypes: [
          { name: 'What\'s New Update', sharePercent: '50%', avgEngagement: '5.4%' },
          { name: 'Special Offer Discount', sharePercent: '50%', avgEngagement: '9.2%' },
        ],
        templates: [
          { name: 'Weekly Special Offer Announcement', format: '16:9 Image + CTA', desc: 'Call button conversion layout' },
        ],
        metrics: { reach: '18,400', impressions: '42,000', ctr: '9.1%', engagementRate: '7.2%' },
        bestPostingWindow: '10:00 AM - 01:00 PM EST (Weekdays)',
      },
      {
        id: 'bluesky',
        name: 'Bluesky',
        category: 'Open Web',
        apiName: 'AT Protocol XRPC API',
        tokenStatus: 'active',
        tokenExpiresInDays: 365,
        handle: '@minipost.bsky.social',
        followersCount: '8,900',
        postTypes: [
          { name: 'Skeet + Rich Link Card', sharePercent: '60%', avgEngagement: '10.2%' },
          { name: 'Single Skeet + Image', sharePercent: '40%', avgEngagement: '8.4%' },
        ],
        templates: [
          { name: 'Open Web Dev Update', format: 'Text + Link', desc: 'Clean link card formatting' },
        ],
        metrics: { reach: '24,100', impressions: '68,000', ctr: '6.4%', engagementRate: '9.2%' },
        bestPostingWindow: '11:00 AM - 02:00 PM EST (Mon-Fri)',
      },
      {
        id: 'threads',
        name: 'Threads',
        category: 'Meta Threads',
        apiName: 'Meta Threads API',
        tokenStatus: 'active',
        tokenExpiresInDays: 54,
        handle: '@minipost_threads',
        followersCount: '12,400',
        postTypes: [
          { name: 'Text Discussion Thread', sharePercent: '65%', avgEngagement: '11.8%' },
          { name: 'Carousel Photo Story', sharePercent: '35%', avgEngagement: '9.4%' },
        ],
        templates: [
          { name: 'Dev Discussion Hook', format: 'Text Thread', desc: 'Interactive prompt style' },
        ],
        metrics: { reach: '36,500', impressions: '94,000', ctr: '5.2%', engagementRate: '10.6%' },
        bestPostingWindow: '12:00 PM - 03:00 PM EST (Weekdays)',
      },
      {
        id: 'telegram',
        name: 'Telegram Channel',
        category: 'Direct Broadcast',
        apiName: 'Telegram Bot API v7.0',
        tokenStatus: 'active',
        tokenExpiresInDays: 365,
        handle: '@MiniPostNewsChannel',
        followersCount: '16,800',
        postTypes: [
          { name: 'Rich Broadcast + Inline Button', sharePercent: '70%', avgEngagement: '28.4%' },
          { name: 'Media Attachment Digest', sharePercent: '30%', avgEngagement: '22.1%' },
        ],
        templates: [
          { name: 'Instant News Flash + Call Button', format: 'MarkdownV2', desc: 'Direct broadcast layout' },
        ],
        metrics: { reach: '16,800', impressions: '48,000', ctr: '14.2%', engagementRate: '25.8%' },
        bestPostingWindow: '08:00 AM & 08:00 PM EST (Daily)',
      },
      {
        id: 'instagram_story',
        name: 'Instagram (Story)',
        category: 'Ephemeral 24h',
        apiName: 'Instagram Story API',
        tokenStatus: 'active',
        tokenExpiresInDays: 54,
        handle: '@minipost_studio',
        followersCount: '19,800',
        postTypes: [
          { name: '15s Vertical Story Video', sharePercent: '60%', avgEngagement: '18.9%' },
          { name: 'Sticker Poll & Question Card', sharePercent: '40%', avgEngagement: '24.2%' },
        ],
        templates: [
          { name: 'Behind the Scenes Story Reel', format: '9:16 Vertical', desc: 'Interactive sticker overlays' },
        ],
        metrics: { reach: '42,000', impressions: '89,000', ctr: '8.4%', engagementRate: '21.5%' },
        bestPostingWindow: '12:00 PM & 09:00 PM EST (Daily)',
      },
    ];
  }
}
