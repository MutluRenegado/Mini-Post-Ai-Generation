export class PerformanceMetrics {
  private static latencies: number[] = [];

  static recordLatency(ms: number): void {
    this.latencies.push(ms);
  }

  static getAverageLatency(): number {
    if (this.latencies.length === 0) return 0;
    return Math.round(this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length);
  }
}
