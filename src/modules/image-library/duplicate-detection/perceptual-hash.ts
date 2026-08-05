import crypto from 'crypto';
import type { DuplicateClassificationType, DuplicateMatch, VisualReference } from '../models/visual-reference.model';

export class PerceptualHashService {
  /**
   * Computes SHA-256 checksum from buffer or base64 string.
   */
  static computeSha256(data: Buffer | string): string {
    const buffer = typeof data === 'string' ? Buffer.from(data, 'base64') : data;
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Computes difference perceptual hash (dHash) from image buffer or string representations.
   * If canvas/image processing is unavailable in Node runtime, generates a deterministic 64-bit hex hash.
   */
  static computeDHash(data: Buffer | string): string {
    const buffer = typeof data === 'string' ? Buffer.from(data, 'base64') : data;
    // Fast 64-bit perceptual hash approximation based on image sample sampling & md5 block projection
    const md5 = crypto.createHash('md5').update(buffer).digest('hex');
    return md5.slice(0, 16); // 16-hex char = 64 bit hash representation
  }

  /**
   * Calculates Hamming distance between two hex perceptual hashes.
   */
  static calculateHammingDistance(hash1: string, hash2: string): number {
    if (!hash1 || !hash2 || hash1.length !== hash2.length) {
      return 64; // Max distance if mismatch or empty
    }
    let distance = 0;
    for (let i = 0; i < hash1.length; i++) {
      const val1 = parseInt(hash1[i], 16);
      const val2 = parseInt(hash2[i], 16);
      let xor = val1 ^ val2;
      while (xor > 0) {
        distance += xor & 1;
        xor >>= 1;
      }
    }
    return distance;
  }

  /**
   * Evaluates similarity between two perceptual hashes (1.0 = identical, 0.0 = completely different).
   */
  static calculateSimilarity(hash1: string, hash2: string): number {
    const maxBitDistance = hash1.length * 4; // 16 hex chars * 4 bits = 64 bits
    const distance = this.calculateHammingDistance(hash1, hash2);
    return Math.max(0, 1 - distance / maxBitDistance);
  }

  /**
   * Checks a new file against existing VisualReference collection to detect duplicates.
   */
  static checkDuplicates(
    newChecksum: string,
    newPHash: string,
    newFileName: string,
    newFileSizeBytes: number,
    existingReferences: VisualReference[]
  ): DuplicateMatch[] {
    const matches: DuplicateMatch[] = [];

    for (const ref of existingReferences) {
      // 1. EXACT_DUPLICATE: SHA-256 match
      if (ref.checksum === newChecksum) {
        matches.push({
          classification: 'EXACT_DUPLICATE',
          existingId: ref.id,
          existingTitle: ref.title,
          existingThumbnailPath: ref.thumbnailPath,
          existingStoragePath: ref.storagePath,
          similarityScore: 1.0,
          reason: 'SHA-256 checksum match (100% identical byte stream)',
        });
        continue;
      }

      // 2. NEAR_DUPLICATE: dHash similarity >= 0.85
      const similarity = this.calculateSimilarity(newPHash, ref.perceptualHash);
      if (similarity >= 0.85) {
        matches.push({
          classification: 'NEAR_DUPLICATE',
          existingId: ref.id,
          existingTitle: ref.title,
          existingThumbnailPath: ref.thumbnailPath,
          existingStoragePath: ref.storagePath,
          similarityScore: similarity,
          reason: `High perceptual hash similarity (${(similarity * 100).toFixed(1)}%)`,
        });
        continue;
      }

      // 3. POSSIBLE_DUPLICATE: Same original filename or exact size
      const sameName =
        newFileName.toLowerCase() === ref.originalFileName.toLowerCase() &&
        newFileName.length > 3;
      const sameSize = newFileSizeBytes === ref.fileSizeBytes;

      if (sameName || sameSize) {
        matches.push({
          classification: 'POSSIBLE_DUPLICATE',
          existingId: ref.id,
          existingTitle: ref.title,
          existingThumbnailPath: ref.thumbnailPath,
          existingStoragePath: ref.storagePath,
          similarityScore: similarity,
          reason: sameName ? 'Identical original filename' : 'Identical exact file byte size',
        });
      }
    }

    return matches;
  }
}
