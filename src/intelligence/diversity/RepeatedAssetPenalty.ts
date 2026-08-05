import type { VisualReference } from '../../library/domain/visual-reference.model';

export class RepeatedAssetPenalty {
  static calculate(reference: VisualReference, recentlyUsedIds?: string[]): number {
    if (recentlyUsedIds && recentlyUsedIds.includes(reference.id)) {
      return 20;
    }
    return 0;
  }
}
