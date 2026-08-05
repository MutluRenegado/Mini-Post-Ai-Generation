/**
 * Mini Post App - Facebook Post Standard
 * Informed by Meta Graph API Guidelines & Feed Best Practices.
 */

export interface FacebookPostStandardSpec {
  platform: 'facebook';
  maxCharacterLimit: number;
  recommendedLength: number;
  maxHashtags: number;
  linkPreviewEnabled: boolean;
  supportedAspectRatios: string[];
  platformPolicy: {
    apiEndpoint: string;
    rateLimitTier: string;
    guidelinesUrl: string;
  };
}

export const FacebookPostStandard: FacebookPostStandardSpec = {
  platform: 'facebook',
  maxCharacterLimit: 63206,
  recommendedLength: 250,
  maxHashtags: 3,
  linkPreviewEnabled: true,
  supportedAspectRatios: ['1:1', '16:9', '4:5'],
  platformPolicy: {
    apiEndpoint: 'Meta Graph API v19.0',
    rateLimitTier: '200 calls/user/hour',
    guidelinesUrl: 'https://developers.facebook.com/policy/',
  },
};
