import type { ExternalImageProvider } from './external-image-provider.interface';
import { PexelsProvider } from './pexels/pexels.provider';
import { PixabayProvider } from './pixabay/pixabay.provider';
import { UnsplashProvider } from './unsplash/unsplash.provider';

export type StockProviderName = 'pexels' | 'pixabay' | 'unsplash';

export class ProviderNotConfiguredError extends Error {
  public readonly code = 'PROVIDER_NOT_CONFIGURED';
  public readonly statusCode = 503;

  constructor(providerName: string) {
    super(`Provider "${providerName}" runtime module is not configured or available.`);
    this.name = 'ProviderNotConfiguredError';
  }
}

export class ProviderUnknownError extends Error {
  public readonly code = 'PROVIDER_UNKNOWN';
  public readonly statusCode = 400;

  constructor(providerName: string) {
    super(`Unknown or unsupported stock provider: "${providerName}".`);
    this.name = 'ProviderUnknownError';
  }
}

const KNOWN_PROVIDERS: StockProviderName[] = ['pexels', 'pixabay', 'unsplash'];

export class StockProviderRouter {
  private readonly registeredProviders = new Map<string, ExternalImageProvider>();

  constructor(providers: ExternalImageProvider[] = []) {
    if (providers.length > 0) {
      for (const p of providers) {
        this.registeredProviders.set(p.providerId.toLowerCase(), p);
      }
    } else {
      // Register all 3 real stock photo providers (Pexels, Pixabay, Unsplash)
      const pexels = new PexelsProvider();
      this.registeredProviders.set(pexels.providerId.toLowerCase(), pexels);

      const pixabay = new PixabayProvider();
      this.registeredProviders.set(pixabay.providerId.toLowerCase(), pixabay);

      const unsplash = new UnsplashProvider();
      this.registeredProviders.set(unsplash.providerId.toLowerCase(), unsplash);
    }
  }

  /**
   * Helper to check if a string is a known provider name
   */
  public isKnownProvider(name: string): boolean {
    const normalized = (name || '').toLowerCase().trim() as StockProviderName;
    return KNOWN_PROVIDERS.includes(normalized);
  }

  /**
   * Resolves a registered ExternalImageProvider instance or throws standard provider errors
   */
  public getProvider(name: string): ExternalImageProvider {
    const normalized = (name || '').toLowerCase().trim();

    if (!this.isKnownProvider(normalized)) {
      throw new ProviderUnknownError(name);
    }

    const provider = this.registeredProviders.get(normalized);
    if (!provider) {
      throw new ProviderNotConfiguredError(normalized);
    }

    return provider;
  }

  /**
   * Lists registered active provider IDs
   */
  public getActiveProviders(): string[] {
    return Array.from(this.registeredProviders.keys()).map((k) => k.toUpperCase());
  }

  /**
   * Lists all known provider statuses
   */
  public getProviderStatuses(): Array<{ provider: StockProviderName; status: 'active' | 'planned' }> {
    return KNOWN_PROVIDERS.map((p) => ({
      provider: p,
      status: this.registeredProviders.has(p) ? 'active' : 'planned',
    }));
  }
}
