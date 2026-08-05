/**
 * Mini Post App - TikTok Post Standard
 * Informed by TikTok Commercial Content API Guidelines.
 */

export interface TikTokPostStandardSpec {
  platform: 'tiktok';
  maxCaptionLimit: number;
  maxHashtags: number;
  trendingAudioRecommended: boolean;
  supportedAspectRatios: string[];
  platformPolicy: {
    apiEndpoint: string;
    guidelinesUrl: string;
  };
}

export const TikTokPostStandard: TikTokPostStandardSpec = {
  platform: 'tiktok',
  maxCaptionLimit: 2200,
  maxHashtags: 6,
  trendingAudioRecommended: true,
  supportedAspectRatios: ['9:16'],
  platformPolicy: {
    apiEndpoint: 'TikTok Content Posting API v2',
    guidelinesUrl: 'https://developers.tiktok.com/doc/',
  },
};
