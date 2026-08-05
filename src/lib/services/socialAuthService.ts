export interface ConnectedSocialAccount {
  id: string;
  platform: string;
  accountName: string;
  accountHandle: string;
  avatarUrl?: string;
  status: 'connected' | 'expired' | 'error';
  lastSyncedAt: string;
  followersCount?: number;
}

export class SocialAuthService {
  static getSupportedPlatforms(): string[] {
    return [
      'LinkedIn',
      'Twitter (X)',
      'Facebook',
      'Instagram Feed',
      'Instagram Story',
      'YouTube',
      'TikTok',
      'Google Business',
      'Bluesky',
      'Threads',
      'Telegram',
    ];
  }

  static getConnectedAccounts(): ConnectedSocialAccount[] {
    return [
      { id: 'sa_1', platform: 'LinkedIn', accountName: 'Mini Post App Official', accountHandle: '@minipost-app', status: 'connected', lastSyncedAt: new Date().toISOString(), followersCount: 14200 },
      { id: 'sa_2', platform: 'Twitter (X)', accountName: 'Mini Post Studio', accountHandle: '@MiniPostApp', status: 'connected', lastSyncedAt: new Date().toISOString(), followersCount: 28900 },
      { id: 'sa_3', platform: 'Facebook', accountName: 'Mini Post Official Page', accountHandle: '@miniposthq', status: 'connected', lastSyncedAt: new Date().toISOString(), followersCount: 9400 },
      { id: 'sa_4', platform: 'Instagram Feed', accountName: 'Mini Post Visuals', accountHandle: '@minipost_studio', status: 'connected', lastSyncedAt: new Date().toISOString(), followersCount: 19800 },
      { id: 'sa_5', platform: 'Instagram Story', accountName: 'Mini Post Visuals', accountHandle: '@minipost_studio', status: 'connected', lastSyncedAt: new Date().toISOString(), followersCount: 19800 },
      { id: 'sa_6', platform: 'YouTube', accountName: 'Mini Post Channel', accountHandle: '@MiniPostChannel', status: 'connected', lastSyncedAt: new Date().toISOString(), followersCount: 32100 },
      { id: 'sa_7', platform: 'TikTok', accountName: 'Mini Post Shorts', accountHandle: '@minipost_tiktok', status: 'connected', lastSyncedAt: new Date().toISOString(), followersCount: 45600 },
      { id: 'sa_8', platform: 'Google Business', accountName: 'Mini Post Software HQ', accountHandle: 'G-BUS-948', status: 'connected', lastSyncedAt: new Date().toISOString() },
      { id: 'sa_9', platform: 'Bluesky', accountName: 'Mini Post Open Web', accountHandle: '@minipost.bsky.social', status: 'connected', lastSyncedAt: new Date().toISOString() },
      { id: 'sa_10', platform: 'Threads', accountName: 'Mini Post Threads', accountHandle: '@minipost_threads', status: 'connected', lastSyncedAt: new Date().toISOString() },
      { id: 'sa_11', platform: 'Telegram', accountName: 'Mini Post Channel Dispatch', accountHandle: '@MiniPostNewsChannel', status: 'connected', lastSyncedAt: new Date().toISOString() },
    ];
  }

  static initiateOAuthFlow(platform: string): { authUrl: string } {
    return {
      authUrl: `/api/social/connect?platform=${encodeURIComponent(platform)}`,
    };
  }
}
