/**
 * Mini Post App - Instagram Post Standard
 * Informed by Instagram Content Publishing API Guidelines.
 */

export interface InstagramPostStandardSpec {
  platform: 'instagram';
  maxCharacterLimit: number;
  recommendedLength: number;
  maxHashtags: number;
  firstCommentHashtags: boolean;
  supportedAspectRatios: string[];
  platformPolicy: {
    apiEndpoint: string;
    carouselLimit: number;
    guidelinesUrl: string;
  };
}

export const InstagramPostStandard: InstagramPostStandardSpec = {
  platform: 'instagram',
  maxCharacterLimit: 2200,
  recommendedLength: 150,
  maxHashtags: 15,
  firstCommentHashtags: true,
  supportedAspectRatios: ['1:1', '4:5', '9:16'],
  platformPolicy: {
    apiEndpoint: 'Instagram Graph API v19.0',
    carouselLimit: 10,
    guidelinesUrl: 'https://developers.facebook.com/docs/instagram-api/',
  },
};
