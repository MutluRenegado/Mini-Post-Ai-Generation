import type { VisualReference } from '../../library/domain/visual-reference.model';
import type { DiversityOptions, DiversityAdjustments } from './diversity.types';
import { RecentUsagePenalty } from './RecentUsagePenalty';
import { RepeatedScenePenalty } from './RepeatedScenePenalty';
import { RepeatedAssetPenalty } from './RepeatedAssetPenalty';

export class DiversityController {
  /**
   * Calculates usage penalty, recency penalty, repeated scene penalty, and repeated asset penalty.
   * Diversity penalties NEVER override required relevance. Usage frequency is NOT automatically rewarded.
   */
  static calculateDiversityAdjustments(
    reference: VisualReference,
    options: DiversityOptions = {}
  ): DiversityAdjustments {
    const { usagePenalty, recencyAdjustment } = RecentUsagePenalty.calculate(reference);
    const diversityPenalty = RepeatedScenePenalty.calculate(reference, options.currentTopic);
    const repeatedAssetPenalty = RepeatedAssetPenalty.calculate(reference, options.recentlyUsedIds);

    return {
      usagePenalty,
      recencyAdjustment,
      diversityPenalty,
      repeatedAssetPenalty,
    };
  }
}
