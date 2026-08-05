import { UsageMetrics } from './UsageMetrics';
import { PerformanceMetrics } from './PerformanceMetrics';

export class StudioDashboardAnalytics {
  static getMetricsSummary() {
    return {
      usage: UsageMetrics.getMetrics(),
      averageLatencyMs: PerformanceMetrics.getAverageLatency(),
      activePlugins: 1,
      totalWorkflowsExecuted: 12,
      publishingSuccessRate: 98,
    };
  }
}
