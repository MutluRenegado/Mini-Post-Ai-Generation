import { ImageGenerationContract, RawProviderImageInput } from './image.types';

export class ImageResponseNormalizer {
  private static SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

  /**
   * Validates and normalizes provider response into standard ImageGenerationContract.
   */
  static normalize(
    input: RawProviderImageInput | string | undefined | null,
    promptFallback?: string,
    options?: { versionId?: string }
  ): ImageGenerationContract {
    const versionId = typeof input === 'object' && input?.versionId ? input.versionId : options?.versionId || `v_${Date.now()}`;

    if (!input) {
      return {
        imageStatus: 'failed',
        imageError: 'NO_IMAGE_RESPONSE: Provider returned null or empty payload.',
        promptUsed: promptFallback,
        versionId,
      };
    }

    // Handle case where input is a raw object
    if (typeof input === 'object') {
      // 1. Check inlineData / base64 payload
      if (input.inlineData?.data || input.base64) {
        const mime = input.inlineData?.mimeType || 'image/png';
        if (!this.SUPPORTED_MIME_TYPES.includes(mime.toLowerCase())) {
          return {
            imageStatus: 'failed',
            imageError: `UNSUPPORTED_MIME_TYPE: Image format "${mime}" is not supported.`,
            promptUsed: input.textPrompt || promptFallback,
            versionId,
          };
        }

        const dataStr = input.inlineData?.data || input.base64;
        const dataUrl = `data:${mime};base64,${dataStr}`;

        return {
          imageUrl: dataUrl,
          imageMimeType: mime,
          imageSource: 'inlineData',
          imageStatus: 'generated',
          promptUsed: input.textPrompt || promptFallback,
          versionId,
        };
      }

      // 2. Check public HTTP/HTTPS URL
      if (input.url && this.isValidHttpUrl(input.url)) {
        return {
          imageUrl: input.url,
          imageMimeType: 'image/png',
          imageSource: 'remoteUrl',
          imageStatus: 'generated',
          promptUsed: input.textPrompt || promptFallback,
          versionId,
        };
      }
    }

    // Handle case where input is a raw string (could be URL or text prompt)
    if (typeof input === 'string') {
      const trimmed = input.trim();

      // If string is valid HTTP/HTTPS URL or Data URI
      if (this.isValidHttpUrl(trimmed) || trimmed.startsWith('data:image/')) {
        return {
          imageUrl: trimmed,
          imageMimeType: trimmed.startsWith('data:') ? trimmed.split(';')[0].replace('data:', '') : 'image/png',
          imageSource: 'stringUrl',
          imageStatus: 'generated',
          promptUsed: promptFallback,
          versionId,
        };
      }

      // If string is an image prompt (not a URL), mark as prompt requiring image generation
      return {
        imageStatus: 'failed',
        imageError: 'TEXT_PROMPT_NOT_URL: Provided input is an image prompt description, not a rendered image URL.',
        promptUsed: trimmed || promptFallback,
        versionId,
      };
    }

    return {
      imageStatus: 'failed',
      imageError: 'MALFORMED_IMAGE_RESPONSE: Response format could not be parsed into a valid image.',
      promptUsed: promptFallback,
      versionId,
    };
  }

  public static isValidHttpUrl(stringUrl: string): boolean {
    if (!stringUrl || typeof stringUrl !== 'string') return false;
    try {
      const url = new URL(stringUrl);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }
}
