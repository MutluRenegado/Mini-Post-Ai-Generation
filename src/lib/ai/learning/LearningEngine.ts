import { SuccessfulPattern } from '../models/ai.types';

export class LearningEngine {
  private static highPerformingHooks: string[] = [
    'Most teams approach this completely wrong — here is the fix.',
    '40% of operations suffer from this unseen bottleneck.',
  ];

  private static highPerformingCTAs: string[] = [
    'What has been your experience with this? Share in the comments below!',
    'Save this post for later and tap follow for daily insights.',
  ];

  static learnFromPattern(pattern: SuccessfulPattern): void {
    if (pattern.qualityScore >= 95) {
      if (pattern.promptSnippet && !this.highPerformingHooks.includes(pattern.promptSnippet)) {
        this.highPerformingHooks.push(pattern.promptSnippet);
      }
    }
  }

  static getRecommendedHooks(): string[] {
    return [...this.highPerformingHooks];
  }

  static getRecommendedCTAs(): string[] {
    return [...this.highPerformingCTAs];
  }
}
