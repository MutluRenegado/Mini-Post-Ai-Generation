import crypto from 'crypto';
import { PromptCompressionResult, PromptCompressionDelta } from './prompt-compression.types';

export class PromptCompressionEngine {
  public static compress(rawPromptText: string, maxCharLimit = 1000): PromptCompressionResult {
    const originalPromptText = rawPromptText || '';
    const originalPromptFingerprint = crypto.createHash('sha256').update(originalPromptText).digest('hex');

    if (!originalPromptText.trim()) {
      return {
        compressedPromptText: '',
        originalPromptFingerprint,
        compressedPromptFingerprint: originalPromptFingerprint,
        delta: {
          originalLengthChars: 0,
          compressedLengthChars: 0,
          reductionPercentage: 0,
          removedRedundantTokens: [],
          preservedMandatoryConstraints: [],
        },
        providerTokenLimitCompliant: true,
      };
    }

    const redundantFillerWords = [
      'very',
      'extremely',
      'highly',
      'ultra',
      'super',
      'unbelievably',
      'insanely',
      'really',
      'astonishingly',
      '4k',
      '8k',
      'trending on artstation',
      'masterpiece',
    ];

    const removedRedundantTokens: string[] = [];
    let cleaned = originalPromptText;

    redundantFillerWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(cleaned)) {
        removedRedundantTokens.push(word);
        cleaned = cleaned.replace(regex, '');
      }
    });

    // Deduplicate phrases split by commas
    const parts = cleaned.split(',').map((p) => p.trim()).filter(Boolean);
    const uniqueParts: string[] = [];
    const seen = new Set<string>();

    parts.forEach((p) => {
      const lower = p.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        uniqueParts.push(p);
      } else {
        removedRedundantTokens.push(`duplicate: "${p}"`);
      }
    });

    let compressedPromptText = uniqueParts.join(', ').replace(/\s+/g, ' ').trim();

    if (compressedPromptText.length > maxCharLimit) {
      compressedPromptText = compressedPromptText.slice(0, maxCharLimit).trim();
    }

    const compressedPromptFingerprint = crypto.createHash('sha256').update(compressedPromptText).digest('hex');

    const originalLengthChars = originalPromptText.length;
    const compressedLengthChars = compressedPromptText.length;
    const reductionPercentage = originalLengthChars > 0
      ? Math.round(((originalLengthChars - compressedLengthChars) / originalLengthChars) * 100)
      : 0;

    const delta: PromptCompressionDelta = {
      originalLengthChars,
      compressedLengthChars,
      reductionPercentage,
      removedRedundantTokens,
      preservedMandatoryConstraints: uniqueParts,
    };

    return {
      compressedPromptText,
      originalPromptFingerprint,
      compressedPromptFingerprint,
      delta,
      providerTokenLimitCompliant: compressedLengthChars <= maxCharLimit,
    };
  }
}
