import crypto from 'crypto';
import { SizingStandard } from '../../../standards';
import { PlatformOptimizationDecision } from './platform-aspect-ratio.types';

export class PlatformAspectRatioEngine {
  public static resolve(input: {
    platform?: string;
    primarySubject?: string;
    centralMessage?: string;
  }): PlatformOptimizationDecision {
    const rawPlatform = (input.platform || 'LinkedIn').trim();
    const platform = rawPlatform.toLowerCase();
    const subject = input.primarySubject || 'Subject';

    let spec = SizingStandard.SQUARE; // Default 1:1 square
    let safeZones = { top: 20, right: 20, bottom: 20, left: 20 };
    let compositionFormat: 'square' | 'portrait' | 'landscape' | 'vertical_full' = 'square';
    let maxTextDensity = 15;

    if (platform.includes('story') || platform.includes('reel') || platform.includes('tiktok') || platform.includes('shorts')) {
      spec = SizingStandard.VERTICAL_STORY;
      safeZones = { top: 80, right: 20, bottom: 120, left: 20 };
      compositionFormat = 'vertical_full';
    } else if (platform.includes('pinterest')) {
      spec = SizingStandard.PIN_VERTICAL;
      safeZones = { top: 40, right: 20, bottom: 40, left: 20 };
      compositionFormat = 'portrait';
    } else if (platform.includes('portrait') || platform.includes('4:5')) {
      spec = SizingStandard.PORTRAIT;
      safeZones = { top: 30, right: 20, bottom: 30, left: 20 };
      compositionFormat = 'portrait';
    } else if (platform.includes('linkedin') || platform.includes('facebook')) {
      // Standard LinkedIn / FB horizontal feed ratio
      dimensionsPxSpec: {
        spec = {
          name: 'LinkedIn Feed',
          ratio: '1.91:1',
          width: 1200,
          height: 627,
          platforms: ['LinkedIn', 'Facebook'],
        };
      }
      safeZones = { top: 20, right: 30, bottom: 20, left: 30 };
      compositionFormat = 'landscape';
    } else if (platform.includes('x') || platform.includes('twitter') || platform.includes('youtube')) {
      spec = SizingStandard.LANDSCAPE;
      safeZones = { top: 20, right: 40, bottom: 20, left: 40 };
      compositionFormat = 'landscape';
    }

    const dimensionsPx = { width: spec.width, height: spec.height };
    const aspectRatio = spec.ratio;

    const payload = `${rawPlatform}|${dimensionsPx.width}x${dimensionsPx.height}|${aspectRatio}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      platform: rawPlatform,
      dimensionsPx,
      aspectRatio,
      safeZones,
      focalPlacementStrategy: `Center-anchored focal alignment for ${rawPlatform} crop safety`,
      cropResilience: `Subject constrained inside ${Math.round(dimensionsPx.width * 0.8)}px protected inner box`,
      maxTextDensityPercentage: maxTextDensity,
      compositionFormat,
      outputFormat: 'png',
      altTextTemplate: `High-quality visual image depicting ${subject} for ${rawPlatform} post: ${input.centralMessage || ''}`,
      deterministicFingerprint,
    };
  }
}
