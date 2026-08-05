export class QualityMetrics {
  static calculateSuccessRate(scores: number[]): number {
    if (scores.length === 0) return 100;
    const passed = scores.filter((s) => s >= 92).length;
    return Math.round((passed / scores.length) * 100);
  }
}
