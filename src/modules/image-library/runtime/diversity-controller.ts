import type { VisualReference } from '../models/visual-reference.model';

export interface DiversityOptions {
  currentCampaignId?: string;
  currentTopic?: string;
  currentPlatform?: string;
  decayHalfLifeDays?: number;
}

export class DiversityController {
  /**
   * Calculates usage penalty, recency penalty, and repeated-scene penalty.
   * Prevents high-scoring popular images from continually dominating selection.
   */
  static calculateDiversityAdjustments(
    reference: VisualReference,
    options: DiversityOptions = {}
  ): { usagePenalty: number; recencyAdjustment: number; diversityPenalty: number } {
    let usagePenalty = 0;
    let recencyAdjustment = 0;
    let diversityPenalty = 0;

    // 1. Usage Count Penalty (-5 points per usage, capped at -30)
    const usageCount = reference.usageCount || 0;
    usagePenalty = Math.min(30, usageCount * 5);

    // 2. Recency Penalty (If used within the last 7 days)
    if (reference.lastUsedAt) {
      const lastUsedMs = new Date(reference.lastUsedAt).getTime();
      const nowMs = Date.now();
      const elapsedDays = (nowMs - lastUsedMs) / (1000 * 60 * 60 * 24);

      if (elapsedDays < 1) {
        recencyAdjustment = -25; // Heavily penalize used today
      } else if (elapsedDays < 3) {
        recencyAdjustment = -15;
      } else if (elapsedDays < 7) {
        recencyAdjustment = -5;
      }
    }

    // 3. Repeated-Scene / Topic Diversity Penalty
    if (options.currentTopic && reference.topic) {
      if (options.currentTopic.toLowerCase() === reference.topic.toLowerCase()) {
        // Slight bonus if matching topic, but penalty if overused
        if (usageCount > 3) {
          diversityPenalty += 10;
        }
      }
    }

    return {
      usagePenalty,
      recencyAdjustment,
      diversityPenalty,
    };
  }
}
