/**
 * Mini Post App - Sizing Engine Standard
 * Aligned with Social Media Platform Specs & ISO/IEC 25010 Usability.
 */

export interface AspectRatioSpec {
  name: string;
  ratio: string;
  width: number;
  height: number;
  platforms: string[];
}

export const SizingStandard: Record<string, AspectRatioSpec> = {
  SQUARE: {
    name: 'Square',
    ratio: '1:1',
    width: 1080,
    height: 1080,
    platforms: ['Instagram', 'Facebook', 'LinkedIn', 'X'],
  },
  PORTRAIT: {
    name: 'Vertical Portrait',
    ratio: '4:5',
    width: 1080,
    height: 1350,
    platforms: ['Instagram', 'Facebook'],
  },
  VERTICAL_STORY: {
    name: 'Vertical Full',
    ratio: '9:16',
    width: 1080,
    height: 1920,
    platforms: ['Instagram Reels', 'TikTok', 'YouTube Shorts'],
  },
  LANDSCAPE: {
    name: 'Landscape',
    ratio: '16:9',
    width: 1920,
    height: 1080,
    platforms: ['YouTube', 'Facebook', 'LinkedIn', 'X'],
  },
  PIN_VERTICAL: {
    name: 'Pinterest Vertical',
    ratio: '2:3',
    width: 1000,
    height: 1500,
    platforms: ['Pinterest'],
  },
};
