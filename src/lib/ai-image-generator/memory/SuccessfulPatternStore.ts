import { SuccessfulPattern } from '../models/ai.types';

export class SuccessfulPatternStore {
  private static patterns: SuccessfulPattern[] = [];

  static save(pattern: SuccessfulPattern): void {
    if (pattern.qualityScore >= 90) {
      this.patterns.push(pattern);
    }
  }

  static getBestPatterns(category: string): SuccessfulPattern[] {
    return this.patterns
      .filter((p) => p.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, 5);
  }
}
