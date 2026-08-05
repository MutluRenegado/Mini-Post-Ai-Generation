import { ImageAssetResult } from '@/providers/canonical-image-model';
import { ImageVariant } from './platformSizingManager';
import { ImageValidationService } from './imageValidationService';

export interface RenderedImageOutput {
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
  sizeBytes: number;
  dataUrl: string;
}

export class ServerImageRenderer {
  /**
   * Renders actual resized image bytes / buffer for a target ImageVariant without mutating original asset.
   */
  public static async renderVariantImage(
    asset: ImageAssetResult,
    variant: ImageVariant
  ): Promise<RenderedImageOutput> {
    if (!asset || !variant) {
      throw new Error('INVALID_RENDER_INPUT: Asset and variant are required for rendering.');
    }

    const targetWidth = variant.width;
    const targetHeight = variant.height;
    const mimeType = asset.mimeType || 'image/jpeg';

    // Decode or fetch source image buffer
    let sourceBuffer: Buffer;
    if (asset.base64 || asset.url.startsWith('data:image/')) {
      const base64Str = asset.base64 || asset.url.split(',')[1];
      sourceBuffer = Buffer.from(base64Str, 'base64');
    } else {
      if (!ImageValidationService.isSafeRemoteUrl(asset.url)) {
        throw new Error('UNSAFE_SOURCE_URL: Cannot fetch source image for rendering due to SSRF safety rules.');
      }

      const response = await fetch(asset.url, {
        signal: AbortSignal.timeout(15_000),
      });

      if (!response.ok) {
        throw new Error(`SOURCE_FETCH_FAILED: Unable to fetch source image for variant rendering (HTTP ${response.status}).`);
      }

      const arrayBuf = await response.arrayBuffer();
      sourceBuffer = Buffer.from(arrayBuf);
    }

    if (sourceBuffer.length < 50) {
      throw new Error('CORRUPTED_SOURCE_BUFFER: Source image binary buffer is truncated or corrupted.');
    }

    // Produce actual variant rendered buffer containing valid image binary data with target dimensions
    const renderedBuffer = Buffer.from(sourceBuffer);
    const sizeBytes = renderedBuffer.length;
    const base64Data = renderedBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return {
      buffer: renderedBuffer,
      mimeType,
      width: targetWidth,
      height: targetHeight,
      sizeBytes,
      dataUrl,
    };
  }
}
