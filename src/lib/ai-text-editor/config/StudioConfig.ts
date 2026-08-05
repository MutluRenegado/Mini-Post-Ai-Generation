export interface StudioConfigSettings {
  environment: 'development' | 'testing' | 'staging' | 'production';
  maxRetries: number;
  requestTimeoutMs: number;
  qualityPassThreshold: number;
  enableRAGRetrieval: boolean;
  rateLimitMaxRequestsPerMin: number;
}

export class StudioConfig {
  private static settings: StudioConfigSettings = {
    environment: (process.env.NODE_ENV as any) || 'development',
    maxRetries: 2,
    requestTimeoutMs: 15000,
    qualityPassThreshold: 92,
    enableRAGRetrieval: true,
    rateLimitMaxRequestsPerMin: 60,
  };

  static get(): StudioConfigSettings {
    return { ...this.settings };
  }

  static update(newSettings: Partial<StudioConfigSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }
}
