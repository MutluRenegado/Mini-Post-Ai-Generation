/**
 * Mini Post App - Threads Post Standard
 * Informed by Threads API Guidelines.
 */

export interface ThreadsPostStandardSpec {
  platform: 'threads';
  maxCharacterLimit: number;
  recommendedLength: number;
  maxHashtags: number;
  supportedAspectRatios: string[];
  platformPolicy: {
    apiEndpoint: string;
    guidelinesUrl: string;
  };
}

export const ThreadsPostStandard: ThreadsPostStandardSpec = {
  platform: 'threads',
  maxCharacterLimit: 500,
  recommendedLength: 200,
  maxHashtags: 1,
  supportedAspectRatios: ['1:1', '9:16', '4:5'],
  platformPolicy: {
    apiEndpoint: 'Threads API v1',
    guidelinesUrl: 'https://developers.facebook.com/docs/threads',
  },
};
