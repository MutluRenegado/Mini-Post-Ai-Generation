import { ImageAssetResult, ImageAssetResultSchema } from '@/providers/canonical-image-model';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedAsset?: ImageAssetResult;
}

export class ImageValidationService {
  /**
   * Evaluates SSRF risk on URL destinations (rejecting loopback, private IPs, local addresses).
   */
  public static isSafeRemoteUrl(urlString: string): boolean {
    if (!urlString) return false;
    try {
      const url = new URL(urlString);
      if (url.protocol !== 'https:' && url.protocol !== 'http:' && !urlString.startsWith('data:image/')) {
        return false;
      }

      const host = url.hostname.toLowerCase();
      // SSRF Rejections
      if (
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '::1' ||
        host.startsWith('10.') ||
        host.startsWith('192.168.') ||
        host.startsWith('169.254.') ||
        (host.startsWith('172.') && parseInt(host.split('.')[1], 10) >= 16 && parseInt(host.split('.')[1], 10) <= 31)
      ) {
        return false;
      }

      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Performs full canonical validation of an ImageAssetResult for UI confirmation & workflow handoff.
   */
  public static validateAsset(asset: ImageAssetResult): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!asset) {
      return { isValid: false, errors: ['MISSING_ASSET: Asset payload is null or undefined.'], warnings: [] };
    }

    // 1. Zod Schema Check
    const schemaCheck = ImageAssetResultSchema.safeParse(asset);
    if (!schemaCheck.success) {
      errors.push(`INVALID_CANONICAL_MODEL: Schema validation failed (${schemaCheck.error.issues.map((i) => i.message).join(', ')})`);
    }

    // 2. Asset ID
    if (!asset.id || asset.id.trim().length === 0) {
      errors.push('MISSING_ASSET_ID: Asset must have a non-empty unique ID.');
    }

    // 3. Image URL & SSRF Safety
    if (!asset.url) {
      errors.push('MISSING_IMAGE_URL: Asset must provide a primary image URL.');
    } else if (!this.isSafeRemoteUrl(asset.url)) {
      errors.push('UNSAFE_IMAGE_URL: Image URL failed SSRF security checks.');
    }

    // 4. Dimensions & Aspect Ratio
    if (!asset.width || asset.width <= 0 || !asset.height || asset.height <= 0) {
      errors.push('INVALID_DIMENSIONS: Image width and height must be positive numbers.');
    }

    // 5. Provider-Specific Compliance Rules
    if (asset.source === 'PEXELS') {
      if (!asset.creator?.name) errors.push('PEXELS_COMPLIANCE: Missing photographer name.');
      if (!asset.attribution?.text) errors.push('PEXELS_COMPLIANCE: Missing attribution text.');
    }

    if (asset.source === 'PIXABAY') {
      if (!asset.creator?.name) errors.push('PIXABAY_COMPLIANCE: Missing contributor name.');
      if (!asset.attribution?.text) errors.push('PIXABAY_COMPLIANCE: Missing attribution text.');
      warnings.push('PIXABAY_STORAGE: Remote URL is temporary preview only and requires server storage before publication.');
    }

    if (asset.source === 'UNSPLASH') {
      if (!asset.creator?.name) errors.push('UNSPLASH_COMPLIANCE: Missing photographer name.');
      if (!asset.attribution?.text) errors.push('UNSPLASH_COMPLIANCE: Missing attribution text.');
      if (!asset.downloadLocation) {
        errors.push('UNSPLASH_COMPLIANCE: Missing download_location tracking URL.');
      }
    }

    if (asset.source === 'USER_UPLOAD') {
      if (asset.mimeType && !['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(asset.mimeType)) {
        errors.push(`UNSUPPORTED_MIME_TYPE: Uploaded file type "${asset.mimeType}" is not supported.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedAsset: asset,
    };
  }
}
