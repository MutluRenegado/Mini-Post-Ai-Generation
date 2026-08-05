import { AIProvider, AIProviderType } from '../models/ai.types';

export class ProviderHealthMonitor {
  private static healthMap: Map<AIProviderType, { healthy: boolean; lastChecked: number }> = new Map();

  static async checkHealth(provider: AIProvider): Promise<boolean> {
    try {
      const healthy = await provider.isHealthy();
      this.healthMap.set(provider.name, { healthy, lastChecked: Date.now() });
      return healthy;
    } catch {
      this.healthMap.set(provider.name, { healthy: false, lastChecked: Date.now() });
      return false;
    }
  }

  static isProviderHealthy(name: AIProviderType): boolean {
    return this.healthMap.get(name)?.healthy ?? (name === 'gemini');
  }
}
