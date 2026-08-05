/**
 * Mini Post App - LinkedIn Post Standard
 * Informed by LinkedIn Share API Specifications.
 */

export interface LinkedInPostStandardSpec {
  platform: 'linkedin';
  maxCharacterLimit: number;
  recommendedLength: number;
  maxHashtags: number;
  tone: string;
  supportedAspectRatios: string[];
  platformPolicy: {
    apiEndpoint: string;
    guidelinesUrl: string;
  };
}

export const LinkedInPostStandard: LinkedInPostStandardSpec = {
  platform: 'linkedin',
  maxCharacterLimit: 3000,
  recommendedLength: 600,
  maxHashtags: 5,
  tone: 'Professional Thought Leadership',
  supportedAspectRatios: ['1:1', '16:9', '4:5'],
  platformPolicy: {
    apiEndpoint: 'LinkedIn Share API v2',
    guidelinesUrl: 'https://learn.microsoft.com/en-us/linkedin/',
  },
};
