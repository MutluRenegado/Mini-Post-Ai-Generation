/**
 * Mini Post App - YouTube Shorts Standard
 * Informed by YouTube Shorts Guidelines & ISO/IEC 25010 Usability.
 */

export interface ShortsStandardSpec {
  aspectRatio: '9:16';
  maxDurationSeconds: number;
  recommendedDurationSeconds: number;
  hookTimeWindowSeconds: number;
  resolution: { width: number; height: number };
  platformPolicy: {
    maxTitleLength: number;
    hashtagRequirement: string;
  };
}

export const ShortsStandard: ShortsStandardSpec = {
  aspectRatio: '9:16',
  maxDurationSeconds: 60,
  recommendedDurationSeconds: 30,
  hookTimeWindowSeconds: 3,
  resolution: { width: 1080, height: 1920 },
  platformPolicy: {
    maxTitleLength: 100,
    hashtagRequirement: '#Shorts in title or description',
  },
};
