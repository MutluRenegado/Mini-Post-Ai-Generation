/**
 * Mini Post App - Google Business Profile Post Standard
 * Informed by Google Business Profile API Guidelines.
 */

export interface GoogleBusinessPostStandardSpec {
  platform: 'google-business';
  maxCharacterLimit: number;
  ctaOptions: string[];
  postTypes: string[];
  supportedAspectRatios: string[];
  platformPolicy: {
    apiEndpoint: string;
    guidelinesUrl: string;
  };
}

export const GoogleBusinessPostStandard: GoogleBusinessPostStandardSpec = {
  platform: 'google-business',
  maxCharacterLimit: 1500,
  ctaOptions: ['BOOK', 'ORDER', 'BUY', 'LEARN_MORE', 'SIGN_UP', 'CALL'],
  postTypes: ['UPDATE', 'OFFER', 'EVENT'],
  supportedAspectRatios: ['4:3', '1:1', '16:9'],
  platformPolicy: {
    apiEndpoint: 'Google Business Profile Performance API v1',
    guidelinesUrl: 'https://developers.google.com/my-business',
  },
};
