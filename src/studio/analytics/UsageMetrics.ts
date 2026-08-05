export interface UsageRecord {
  feature: string;
  count: number;
  lastUsed: string;
}

export class UsageMetrics {
  private static usage: Map<string, number> = new Map();

  static track(feature: string): void {
    const current = this.usage.get(feature) || 0;
    this.usage.set(feature, current + 1);
  }

  static getMetrics(): UsageRecord[] {
    return Array.from(this.usage.entries()).map(([feature, count]) => ({
      feature,
      count,
      lastUsed: new Date().toISOString(),
    }));
  }
}
