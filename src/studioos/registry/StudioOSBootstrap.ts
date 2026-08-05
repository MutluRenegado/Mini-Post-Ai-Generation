import { StudioRegistry } from './StudioRegistry';
import { StudioLogger } from '../utils/StudioLogger';

export class StudioOSBootstrap {
  private static registered = false;

  static bootstrapAllStudios(): void {
    if (this.registered) return;

    StudioLogger.info('StudioOSBootstrap', 'Bootstrapping all StudioOS Consolidated Modules...');

    // 1. Core StudioOS Consolidated Modules
    const coreModules = [
      { id: 'fast_creator', name: 'Fast Creator Studio', category: 'fast_creator', version: '10.0' },
      { id: 'creator', name: 'Creator Studio', category: 'creator', version: '10.0' },
      { id: 'publishing', name: 'Publishing Studio', category: 'publishing', version: '10.0' },
      { id: 'workflow', name: 'Workflow Studio', category: 'workflow', version: '10.0' },
      { id: 'brand', name: 'Brand Studio', category: 'brand', version: '10.0' },
      { id: 'analytics', name: 'Analytics Studio', category: 'analytics', version: '10.0' },
      { id: 'billing', name: 'Billing Studio', category: 'billing', version: '10.0' },
    ];

    coreModules.forEach((m) => {
      StudioRegistry.register({
        metadata: {
          id: m.id,
          name: m.name,
          category: m.category as any,
          version: m.version,
          description: `StudioOS Consolidated ${m.name}`,
        },
        async initialize() {},
        render() { return null; },
      });
    });

    // 2. Platform Studios (Facebook, Instagram, LinkedIn, Twitter, TikTok, Pinterest, YouTube, Threads, Google Business)
    const platformModules = [
      'facebook', 'instagram', 'linkedin', 'twitter', 'tiktok',
      'pinterest', 'youtube-shorts', 'youtube-classic', 'threads',
      'googlebusiness', 'bluesky', 'telegram'
    ];

    platformModules.forEach((p) => {
      StudioRegistry.register({
        metadata: {
          id: p,
          name: `${p.toUpperCase()} Studio`,
          category: 'platform',
          version: '10.0',
          platformId: p,
          description: `StudioOS Dedicated ${p} Platform Studio`,
        },
        async initialize() {},
        render() { return null; },
      });
    });

    this.registered = true;
    StudioLogger.info('StudioOSBootstrap', `Successfully registered ${coreModules.length + platformModules.length} studios in StudioRegistry.`);
  }
}
