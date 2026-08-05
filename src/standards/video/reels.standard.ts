/**
 * Mini Post App - Instagram Reels Standard
 * Informed by Instagram Reels API Guidelines & Safe Zone Specifications.
 */

export interface ReelsStandardSpec {
  aspectRatio: '9:16';
  maxDurationSeconds: number;
  recommendedDurationSeconds: number;
  safeZones: { topPaddingPx: number; bottomPaddingPx: number };
  resolution: { width: number; height: number };
  platformPolicy: {
    maxCaptionLength: number;
    audioBeatSyncRecommended: boolean;
  };
}

export const ReelsStandard: ReelsStandardSpec = {
  aspectRatio: '9:16',
  maxDurationSeconds: 90,
  recommendedDurationSeconds: 15,
  safeZones: { topPaddingPx: 120, bottomPaddingPx: 240 },
  resolution: { width: 1080, height: 1920 },
  platformPolicy: {
    maxCaptionLength: 2200,
    audioBeatSyncRecommended: true,
  },
};
