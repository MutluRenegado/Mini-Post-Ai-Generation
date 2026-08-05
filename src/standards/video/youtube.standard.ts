/**
 * Mini Post App - YouTube Long-Form Video Standard
 * Informed by YouTube Data API v3 & ISO/IEC 25010 Performance.
 */

export interface YouTubeVideoStandardSpec {
  aspectRatio: '16:9';
  minResolution: { width: number; height: number };
  maxFileSizeGb: number;
  chapterSupport: boolean;
  thumbnailAspectRatio: '16:9';
  platformPolicy: {
    maxTitleLength: number;
    maxDescriptionLength: number;
    maxTagsCount: number;
  };
}

export const YouTubeVideoStandard: YouTubeVideoStandardSpec = {
  aspectRatio: '16:9',
  minResolution: { width: 1920, height: 1080 },
  maxFileSizeGb: 256,
  chapterSupport: true,
  thumbnailAspectRatio: '16:9',
  platformPolicy: {
    maxTitleLength: 100,
    maxDescriptionLength: 5000,
    maxTagsCount: 500,
  },
};
