import { GenerationAnalytics } from '@/lib/ai-text-editor/analytics/GenerationAnalytics';

export class StudioAnalyticsEngine {
  static getSummary() {
    return GenerationAnalytics.getSummary();
  }
}
