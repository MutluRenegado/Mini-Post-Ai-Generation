import { uploadBufferToFirebaseStorage } from '@/lib/firebaseAdmin';
import { ImageGenerationContract } from './image.types';
import { Logger } from '../logging/Logger';

export class ImageStorageService {
  /**
   * Persists a generated image into Firebase Storage server-side and returns a stable HTTPS download URL.
   */
  static async storeImage(
    contract: ImageGenerationContract,
    userId: string = 'guest-user'
  ): Promise<ImageGenerationContract> {
    if (!contract.imageUrl || contract.imageStatus === 'failed') {
      return contract;
    }

    const versionId = contract.versionId || `v_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    try {
      const fileName = `img_${versionId}_${Date.now()}.png`;
      const storagePath = `users/${userId}/generated/${fileName}`;

      let buffer: Buffer;
      let contentType = contract.imageMimeType || 'image/png';

      if (contract.imageUrl.startsWith('data:image/')) {
        const matches = contract.imageUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (!matches) {
          throw new Error('INVALID_DATA_URI_FORMAT: Base64 data URI structure is invalid.');
        }
        contentType = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        const resp = await fetch(contract.imageUrl);
        if (!resp.ok) {
          throw new Error(`REMOTE_FETCH_FAILED: Unable to fetch image for storage persistence (HTTP ${resp.status})`);
        }
        const arrayBuf = await resp.arrayBuffer();
        buffer = Buffer.from(arrayBuf);
        contentType = resp.headers.get('content-type') || contentType;
      }

      Logger.info('ImageStorageService', 'uploading_to_firebase_storage', {
        storagePath,
        sizeBytes: buffer.length,
        contentType,
        versionId,
      });

      const { downloadUrl } = await uploadBufferToFirebaseStorage(buffer, storagePath, contentType);
      const cacheBustedUrl = downloadUrl.includes('?') ? `${downloadUrl}&v=${versionId}` : `${downloadUrl}?v=${versionId}`;

      Logger.info('ImageStorageService', 'storage_upload_success', {
        storagePath,
        downloadUrl: cacheBustedUrl,
        versionId,
      });

      return {
        imageUrl: cacheBustedUrl,
        imageMimeType: contentType,
        imageSource: 'firebase-storage',
        imageStatus: 'stored',
        storagePath,
        promptUsed: contract.promptUsed,
        versionId,
        operation: contract.operation,
      };
    } catch (storageErr: any) {
      Logger.error('ImageStorageService', 'firebase_storage_upload_failed', {
        error: storageErr?.message || 'Storage upload error',
      });

      // Preserve generated image preview when storage fails so UI can still show generated asset
      return {
        imageUrl: contract.imageUrl,
        imageMimeType: contract.imageMimeType || 'image/png',
        imageSource: contract.imageSource || 'ai-generator',
        imageStatus: 'generation_succeeded_persistence_failed',
        imageError: `Image generated, but could not be saved to the Asset Library. (${storageErr?.message || 'Firebase storage upload failed.'})`,
        promptUsed: contract.promptUsed,
        versionId,
        operation: contract.operation,
      };
    }
  }
}
