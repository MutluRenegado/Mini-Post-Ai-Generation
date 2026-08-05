/**
 * Mini Post App - Pinterest Post Standard
 * Informed by Pinterest API v5 Guidelines.
 */

export interface PinterestPostStandardSpec {
  platform: 'pinterest';
  maxTitleLimit: number;
  maxDescriptionLimit: number;
  maxHashtags: number;
  destinationUrlRequired: boolean;
  supportedAspectRatios: string[];
  platformPolicy: {
    apiEndpoint: string;
    guidelinesUrl: string;
  };
}

export const PinterestPostStandard: PinterestPostStandardSpec = {
  platform: 'pinterest',
  maxTitleLimit: 100,
  maxDescriptionLimit: 500,
  maxHashtags: 5,
  destinationUrlRequired: true,
  supportedAspectRatios: ['2:3', '1:1'],
  platformPolicy: {
    apiEndpoint: 'Pinterest API v5',
    guidelinesUrl: 'https://developers.pinterest.com/docs/api/v5/',
  },
};
