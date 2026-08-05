import { RawProviderImageInput } from './image.types';
import { Logger } from '../logging/Logger';

export class ImageGenerationProvider {
  /**
   * Maps aspect ratio string to standard platform pixel dimensions.
   */
  public static getDimensionsFromAspectRatio(aspectRatio?: string): { width: number; height: number } {
    switch (aspectRatio) {
      case '9:16':
        return { width: 1080, height: 1920 };
      case '16:9':
        return { width: 1200, height: 675 };
      case '4:5':
        return { width: 1080, height: 1350 };
      case '2:3':
        return { width: 1000, height: 1500 };
      case '4:3':
        return { width: 1200, height: 900 };
      case '1:1':
      default:
        return { width: 1080, height: 1080 };
    }
  }

  /**
   * Generates a real image from an assembled prompt string.
   * Safely logs provider response shape without exposing secrets or raw binary payloads.
   */
  static async generateImage(
    prompt: string,
    options?: { width?: number; height?: number; aspectRatio?: string; seed?: number; versionId?: string }
  ): Promise<RawProviderImageInput> {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      throw new Error('EMPTY_IMAGE_PROMPT: Cannot generate image with an empty prompt.');
    }

    const { width: defaultW, height: defaultH } = this.getDimensionsFromAspectRatio(options?.aspectRatio);
    const width = options?.width || defaultW;
    const height = options?.height || defaultH;
    const seed = options?.seed || Math.floor(Math.random() * 1000000);
    const versionId = options?.versionId || `v_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const encodedPrompt = encodeURIComponent(cleanPrompt.slice(0, 300));
    const targetUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&v=${versionId}`;

    Logger.info(
      'ImageGenerationProvider',
      'provider_request_started',
      {
        provider: 'pollinations_ai',
        promptLength: cleanPrompt.length,
        dimensions: `${width}x${height}`,
        seed,
        versionId,
      }
    );

    let lastError: any = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      const imageController = new AbortController();
      const timeoutId = setTimeout(() => {
        imageController.abort(new Error('IMAGE_GENERATOR_TIMEOUT: Image provider request timed out after 30 seconds.'));
      }, 30_000);

      try {
        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            Accept: 'image/png,image/jpeg,image/webp,*/*',
          },
          signal: imageController.signal,
        });

        const contentType = response.headers.get('content-type') || '';
        const statusCode = response.status;

        if (!response.ok) {
          throw new Error(`IMAGE_GENERATOR_HTTP_ERROR: Provider returned HTTP ${statusCode}`);
        }

        if (!contentType.startsWith('image/')) {
          throw new Error(`INVALID_IMAGE_CONTENT_TYPE: Provider returned non-image content-type: "${contentType}"`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (buffer.length < 100) {
          throw new Error('TRUNCATED_IMAGE_PAYLOAD: Returned image binary buffer is empty or corrupted.');
        }

        const base64Data = buffer.toString('base64');
        const mimeType = contentType.split(';')[0].trim() || 'image/png';

        return {
          base64: base64Data,
          inlineData: {
            mimeType,
            data: base64Data,
          },
          url: targetUrl,
          textPrompt: cleanPrompt,
          seed,
          versionId,
        };
      } catch (err: any) {
        lastError = err;
        Logger.warn('ImageGenerationProvider', `attempt_${attempt}_failed`, { error: err?.message });
        if (attempt < 2) {
          await new Promise((res) => setTimeout(res, 1500));
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    throw lastError || new Error('IMAGE_GENERATION_FAILED: Image generator failed after 2 attempts.');
  }
}
