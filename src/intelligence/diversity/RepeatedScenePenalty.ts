import type { VisualReference } from '../../library/domain/visual-reference.model';

export class RepeatedScenePenalty {
  static calculate(reference: VisualReference, currentTopic?: string): number {
    let penalty = 0;
    if (currentTopic && reference.topic) {
      if (currentTopic.toLowerCase() === reference.topic.toLowerCase()) {
        if ((reference.usageCount || 0) > 3) {
          penalty = 10;
        }
      }
    }
    return penalty;
  }
}
