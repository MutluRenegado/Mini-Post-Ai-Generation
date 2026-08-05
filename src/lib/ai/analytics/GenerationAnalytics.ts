import { AnalyticsRecord } from '../models/ai.types';

export class GenerationAnalytics {
  private static records: AnalyticsRecord[] = [];

  static log(record: AnalyticsRecord): void {
    this.records.push(record);
  }

  static getSummary() {
    const total = this.records.length;
    if (total === 0) return { totalGenerations: 0, avgScore: 0, avgLatencyMs: 0 };
    const avgScore = Math.round(this.records.reduce((s, r) => s + r.qualityScore, 0) / total);
    const avgLatencyMs = Math.round(this.records.reduce((s, r) => s + r.generationTimeMs, 0) / total);
    return { totalGenerations: total, avgScore, avgLatencyMs };
  }
}
