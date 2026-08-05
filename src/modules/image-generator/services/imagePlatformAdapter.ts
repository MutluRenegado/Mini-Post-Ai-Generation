export interface ImagePlatformPreset {
  platform: string;
  aspectRatio: string;
  width: number;
  height: number;
  safeAreas: { top: number; right: number; bottom: number; left: number };
}

export class ImagePlatformAdapter {
  public static getVisualPlatformPreset(platform = 'LinkedIn'): ImagePlatformPreset {
    const lower = platform.toLowerCase();

    if (lower.includes('story') || lower.includes('reel') || lower.includes('tiktok')) {
      return { platform: 'Instagram Story / Reel', aspectRatio: '9:16', width: 1080, height: 1920, safeAreas: { top: 80, right: 20, bottom: 120, left: 20 } };
    }
    if (lower.includes('portrait') || lower.includes('instagram')) {
      return { platform: 'Instagram Feed Portrait', aspectRatio: '4:5', width: 1080, height: 1350, safeAreas: { top: 30, right: 20, bottom: 30, left: 20 } };
    }
    if (lower.includes('facebook') || lower.includes('linkedin')) {
      return { platform: 'LinkedIn / Facebook Feed', aspectRatio: '1.91:1', width: 1200, height: 628, safeAreas: { top: 20, right: 30, bottom: 20, left: 30 } };
    }
    if (lower.includes('x') || lower.includes('twitter') || lower.includes('youtube')) {
      return { platform: 'X (Twitter) Landscape', aspectRatio: '16:9', width: 1200, height: 675, safeAreas: { top: 20, right: 40, bottom: 20, left: 40 } };
    }

    return { platform: 'Square Generic', aspectRatio: '1:1', width: 1080, height: 1080, safeAreas: { top: 20, right: 20, bottom: 20, left: 20 } };
  }
}
