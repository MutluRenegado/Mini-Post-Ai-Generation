import type { ImageProvider } from '../../application/ports/ImageProvider';
export class ProviderRouter {
  private readonly providers = new Map<string, ImageProvider>();
  public constructor(providers: readonly ImageProvider[]) { for (const provider of providers) this.providers.set(provider.name, provider); }
  public get(name: string): ImageProvider { const provider=this.providers.get(name); if (!provider) throw new Error(`IMAGE_PROVIDER_NOT_FOUND:${name}`); return provider; }
}
