/**
 * Mini Post App - YouTube Community Post Standard
 * Informed by YouTube Data API v3 Guidelines.
 */

export interface YouTubePostStandardSpec {
  platform: 'youtube-community';
  maxCharacterLimit: number;
  pollSupported: boolean;
  maxImageAttachments: number;
  supportedAspectRatios: string[];
  platformPolicy: {
    apiEndpoint: string;
    guidelinesUrl: string;
  };
}

export const YouTubePostStandard: YouTubePostStandardSpec = {
  platform: 'youtube-community',
  maxCharacterLimit: 5000,
  pollSupported: true,
  maxImageAttachments: 5,
  supportedAspectRatios: ['1:1', '16:9'],
  platformPolicy: {
    apiEndpoint: 'YouTube Data API v3',
    guidelinesUrl: 'https://developers.google.com/youtube/v3',
  },
};
