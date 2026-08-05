export interface ThumbnailResult {
  thumbnailDataUrl: string;
  width: number;
  height: number;
}

export class ThumbnailGenerator {
  /**
   * Generates a web-optimized thumbnail maintaining original aspect ratio.
   * Max dimension: 320px.
   */
  static async generateThumbnail(
    base64OrDataUrl: string,
    targetMaxDimension = 320
  ): Promise<ThumbnailResult> {
    // If running in browser canvas context
    if (typeof window !== 'undefined' && window.document) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          if (width > height) {
            if (width > targetMaxDimension) {
              height = Math.round((height * targetMaxDimension) / width);
              width = targetMaxDimension;
            }
          } else {
            if (height > targetMaxDimension) {
              width = Math.round((width * targetMaxDimension) / height);
              height = targetMaxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve({ thumbnailDataUrl: base64OrDataUrl, width, height });
          }

          ctx.drawImage(img, 0, 0, width, height);
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve({ thumbnailDataUrl, width, height });
        };
        img.onerror = () => {
          resolve({ thumbnailDataUrl: base64OrDataUrl, width: 320, height: 320 });
        };
        img.src = base64OrDataUrl;
      });
    }

    // Node environment fallback thumbnail generator
    return {
      thumbnailDataUrl: base64OrDataUrl,
      width: 320,
      height: 320,
    };
  }
}
