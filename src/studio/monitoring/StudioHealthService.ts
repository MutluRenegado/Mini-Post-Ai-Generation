import { CircuitBreaker } from './CircuitBreaker';
import { StudioConfig } from '@/lib/ai-text-editor/config/StudioConfig';
import { Logger } from '@/lib/ai-text-editor/logging/Logger';
import { ProviderHealthMonitor } from '@/lib/ai-text-editor/providers/ProviderHealthMonitor';
import { GenerationAnalytics } from '@/lib/ai-text-editor/analytics/GenerationAnalytics';

export class StudioHealthService {
  static getHealthOverview() {
    const config = StudioConfig.get();
    const analytics = GenerationAnalytics.getSummary();
    const isGeminiHealthy = ProviderHealthMonitor.isProviderHealthy('gemini');

    return {
      status: CircuitBreaker.canExecute() && isGeminiHealthy ? 'OPERATIONAL' : 'DEGRADED',
      environment: config.environment,
      circuitBreaker: CircuitBreaker.getStatus(),
      providers: {
        gemini: isGeminiHealthy ? 'HEALTHY' : 'STANDBY',
        openai: 'STANDBY',
        claude: 'STANDBY',
      },
      analytics: {
        totalGenerations: analytics.totalGenerations,
        avgScore: analytics.avgScore,
        avgLatencyMs: analytics.avgLatencyMs,
      },
      recentLogs: Logger.getLogs().slice(-10),
      timestamp: new Date().toISOString(),
    };
  }
}
