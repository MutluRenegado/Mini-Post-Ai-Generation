import { ImageAssetResult } from '@/providers/canonical-image-model';

export interface ImageVariantCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  focalPointX?: number;
  focalPointY?: number;
}

export interface ImageVariant {
  id: string;
  sourceAssetId: string;
  platform: string;
  preset: string;

  width: number;
  height: number;
  aspectRatio: string;

  url?: string;
  previewUrl?: string;
  blobReference?: string;

  mimeType: string;
  fileSize?: number;

  crop?: ImageVariantCrop;

  quality?: number;
  status: 'pending' | 'ready' | 'failed';
  validationErrors?: string[];
  createdAt: string;
}

export interface PlatformPreset {
  platformId: string;
  platformName: string;
  presetName: string;
  aspectRatio: string;
  width: number;
  height: number;
}

export const PLATFORM_PRESETS: PlatformPreset[] = [
  { platformId: 'facebook', platformName: 'Facebook', presetName: 'Feed Post', aspectRatio: '1.91:1', width: 1200, height: 630 },
  { platformId: 'instagram_square', platformName: 'Instagram', presetName: 'Square Feed', aspectRatio: '1:1', width: 1080, height: 1080 },
  { platformId: 'instagram_portrait', platformName: 'Instagram', presetName: 'Portrait Feed', aspectRatio: '4:5', width: 1080, height: 1350 },
  { platformId: 'instagram_story', platformName: 'Instagram', presetName: 'Story / Reel', aspectRatio: '9:16', width: 1080, height: 1920 },
  { platformId: 'linkedin', platformName: 'LinkedIn', presetName: 'Professional Feed', aspectRatio: '1.91:1', width: 1200, height: 627 },
  { platformId: 'x', platformName: 'X (Twitter)', presetName: 'Post Graphic', aspectRatio: '16:9', width: 1200, height: 675 },
  { platformId: 'pinterest', platformName: 'Pinterest', presetName: 'Pin Graphic', aspectRatio: '2:3', width: 1000, height: 1500 },
  { platformId: 'threads', platformName: 'Threads', presetName: 'Post Image', aspectRatio: '1:1', width: 1080, height: 1080 },
  { platformId: 'tiktok', platformName: 'TikTok', presetName: 'Video Cover', aspectRatio: '9:16', width: 1080, height: 1920 },
  { platformId: 'youtube', platformName: 'YouTube', presetName: 'Thumbnail', aspectRatio: '16:9', width: 1280, height: 720 },
  { platformId: 'google_business', platformName: 'Google Business', presetName: 'Update Post', aspectRatio: '4:3', width: 1200, height: 900 },
];

export class PlatformSizingManager {
  /**
   * Computes non-destructive crop bounds for a target aspect ratio given original width & height.
   */
  public static computeCrop(
    origW: number,
    origH: number,
    targetW: number,
    targetH: number
  ): ImageVariantCrop {
    const origRatio = origW / origH;
    const targetRatio = targetW / targetH;

    let cropW = origW;
    let cropH = origH;

    if (origRatio > targetRatio) {
      // Original is wider: crop sides
      cropW = Math.round(origH * targetRatio);
    } else {
      // Original is taller: crop top/bottom
      cropH = Math.round(origW / targetRatio);
    }

    const x = Math.max(0, Math.floor((origW - cropW) / 2));
    const y = Math.max(0, Math.floor((origH - cropH) / 2));

    return {
      x,
      y,
      width: cropW,
      height: cropH,
      focalPointX: 0.5,
      focalPointY: 0.5,
    };
  }

  /**
   * Generates non-destructive platform variants from a confirmed canonical ImageAssetResult.
   */
  public static generateVariants(
    asset: ImageAssetResult,
    selectedPlatforms?: string[]
  ): ImageVariant[] {
    if (!asset || !asset.width || !asset.height) {
      return [];
    }

    const presetsToUse = selectedPlatforms && selectedPlatforms.length > 0
      ? PLATFORM_PRESETS.filter((p) =>
          selectedPlatforms.some((sp) => sp.toLowerCase().includes(p.platformName.toLowerCase()))
        )
      : PLATFORM_PRESETS;

    const finalPresets = presetsToUse.length > 0 ? presetsToUse : PLATFORM_PRESETS;

    return finalPresets.map((preset) => {
      const crop = this.computeCrop(asset.width, asset.height, preset.width, preset.height);
      const errors: string[] = [];

      if (crop.width <= 0 || crop.height <= 0) {
        errors.push('INVALID_CROP_DIMENSIONS: Computed crop dimensions are non-positive.');
      }

      const variantId = `var_${asset.id}_${preset.platformId}_${Date.now()}`;

      return {
        id: variantId,
        sourceAssetId: asset.id,
        platform: preset.platformName,
        preset: preset.presetName,
        width: preset.width,
        height: preset.height,
        aspectRatio: preset.aspectRatio,
        url: asset.url,
        previewUrl: asset.previewUrl || asset.url,
        mimeType: asset.mimeType || 'image/jpeg',
        crop,
        quality: 90,
        status: errors.length === 0 ? 'ready' : 'failed',
        validationErrors: errors.length > 0 ? errors : undefined,
        createdAt: new Date().toISOString(),
      };
    });
  }

  /**
   * Validates an individual ImageVariant.
   */
  public static validateVariant(variant: ImageVariant): boolean {
    if (!variant) return false;
    if (!variant.id || !variant.sourceAssetId || !variant.platform) return false;
    if (variant.width <= 0 || variant.height <= 0) return false;
    if (variant.status === 'failed') return false;
    return true;
  }
}
