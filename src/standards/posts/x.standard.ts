/**
 * Mini Post App - X (Twitter) Post Standard
 * Informed by X API v2 Developer Guidelines.
 */

export interface XPostStandardSpec {
  platform: 'x';
  maxCharacterLimit: number;
  premiumCharacterLimit: number;
  maxHashtags: number;
  threadSupported: boolean;
  supportedAspectRatios: string[];
  platformPolicy: {
    apiEndpoint: string;
    guidelinesUrl: string;
  };
}

export const XPostStandard: XPostStandardSpec = {
  platform: 'x',
  maxCharacterLimit: 280,
  premiumCharacterLimit: 25000,
  maxHashtags: 2,
  threadSupported: true,
  supportedAspectRatios: ['16:9', '1:1'],
  platformPolicy: {
    apiEndpoint: 'X API v2',
    guidelinesUrl: 'https://developer.x.com/en/docs',
  },
};
