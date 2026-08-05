import { PlatformId, SizingVariant } from '../types/studio.types';

export class SizingManagerService {
  static getVariants(text: string): SizingVariant[] {
    const platforms: { platform: PlatformId; formatName: string; ratio: string; w: number; h: number; maxChar: number }[] = [
      { platform: 'instagram', formatName: 'Square Feed', ratio: '1:1', w: 1080, h: 1080, maxChar: 2200 },
      { platform: 'instagram', formatName: 'Portrait Feed', ratio: '4:5', w: 1080, h: 1350, maxChar: 2200 },
      { platform: 'instagram', formatName: 'Story / Reel Cover', ratio: '9:16', w: 1080, h: 1920, maxChar: 2200 },
      { platform: 'facebook', formatName: 'Feed Post', ratio: '1.91:1', w: 1200, h: 630, maxChar: 63206 },
      { platform: 'linkedin', formatName: 'Professional Feed', ratio: '1.91:1', w: 1200, h: 627, maxChar: 3000 },
      { platform: 'twitter', formatName: 'X Post', ratio: '16:9', w: 1200, h: 675, maxChar: 280 },
      { platform: 'threads', formatName: 'Threads Post', ratio: '1:1', w: 1080, h: 1080, maxChar: 500 },
      { platform: 'pinterest', formatName: 'Pin Graphic', ratio: '2:3', w: 1000, h: 1500, maxChar: 500 },
      { platform: 'tiktok', formatName: 'Video Cover', ratio: '9:16', w: 1080, h: 1920, maxChar: 2200 },
      { platform: 'google_business', formatName: 'Update Post', ratio: '4:3', w: 1200, h: 900, maxChar: 1500 },
    ];

    return platforms.map((p) => {
      const isOver = text.length > p.maxChar;
      const reflowed = isOver ? text.slice(0, p.maxChar - 3) + '...' : text;
      return {
        platform: p.platform,
        formatName: p.formatName,
        aspectRatio: p.ratio,
        width: p.w,
        height: p.h,
        maxCharacters: p.maxChar,
        scaledFontSize: p.w < 1100 ? 14 : 16,
        reflowedText: reflowed,
        safeAreaMargin: p.ratio === '9:16' ? 'top: 60px, bottom: 80px' : 'all: 16px',
      };
    });
  }
}
