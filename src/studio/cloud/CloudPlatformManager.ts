export interface CloudRegion {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'standby' | 'degraded';
  latencyMs: number;
  primaryProvider: string;
}

export class CloudPlatformManager {
  private static regions: CloudRegion[] = [
    { id: 'us-east-1', name: 'US East (N. Virginia)', location: 'USA', status: 'active', latencyMs: 15, primaryProvider: 'gemini' },
    { id: 'eu-west-1', name: 'EU West (Ireland)', location: 'Europe', status: 'active', latencyMs: 35, primaryProvider: 'gemini' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', location: 'Asia', status: 'active', latencyMs: 65, primaryProvider: 'gemini' },
  ];

  static listRegions(): CloudRegion[] {
    return [...this.regions];
  }

  static getRegionHealth() {
    return {
      activeRegions: this.regions.length,
      globalCDNStatus: 'HEALTHY',
      edgeCacheHitRatio: '96.4%',
      activeTenants: 1420,
      monthlyGenerations: 1250000,
    };
  }
}
