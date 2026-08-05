import type { VisualReference } from '../../library/domain/visual-reference.model';

export class RecentUsagePenalty {
  static calculate(reference: VisualReference): { usagePenalty: number; recencyAdjustment: number } {
    let usagePenalty = Math.min(30, (reference.usageCount || 0) * 5);
    let recencyAdjustment = 0;

    if (reference.lastUsedAt) {
      const lastUsedMs = new Date(reference.lastUsedAt).getTime();
      const elapsedDays = (Date.now() - lastUsedMs) / (1000 * 60 * 60 * 24);

      if (elapsedDays < 1) recencyAdjustment = -25;
      else if (elapsedDays < 3) recencyAdjustment = -15;
      else if (elapsedDays < 7) recencyAdjustment = -5;
    }

    return { usagePenalty, recencyAdjustment };
  }
}
