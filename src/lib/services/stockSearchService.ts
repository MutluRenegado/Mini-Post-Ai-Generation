import { StockProviderRouter, StockProviderName, ProviderNotConfiguredError, ProviderUnknownError } from '../../providers/stock-provider-router';
import { ImageAssetResult, externalAssetToCanonical } from '../../providers/canonical-image-model';
import { ExternalImageSearchInput } from '../../providers/external-image-provider.interface';

export interface UnifiedStockSearchRequest {
  action?: string;
  provider: StockProviderName | 'all';
  query: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  page?: number;
  perPage?: number;
  color?: string;
  safeSearch?: boolean;
}

export interface ProviderStatusSummary {
  status: 'ok' | 'error' | 'unavailable';
  error?: string;
}

export interface UnifiedStockSearchResponse {
  provider: StockProviderName | 'all';
  page: number;
  perPage: number;
  hasMore: boolean;
  assets: ImageAssetResult[];
  providers?: {
    pexels?: ProviderStatusSummary;
    pixabay?: ProviderStatusSummary;
    unsplash?: ProviderStatusSummary;
  };
}

export class StockSearchService {
  private static router = new StockProviderRouter();

  /**
   * Main unified search entry point supporting individual and federated multi-provider searches
   */
  static async search(request: UnifiedStockSearchRequest): Promise<UnifiedStockSearchResponse> {
    const rawQuery = (request.query || '').trim();
    if (!rawQuery) {
      throw new Error('VALIDATION_ERROR: Search query cannot be empty or whitespace only.');
    }
    if (rawQuery.length > 100) {
      throw new Error('VALIDATION_ERROR: Search query exceeds maximum length of 100 characters.');
    }

    const page = Math.max(request.page || 1, 1);
    const perPage = Math.max(1, Math.min(request.perPage || 20, 50));
    const targetProvider = (request.provider || 'all').toLowerCase().trim();

    const searchInput: ExternalImageSearchInput = {
      query: rawQuery,
      page,
      perPage,
      orientation: request.orientation,
      color: request.color,
    };

    // Single Provider Search Path
    if (targetProvider !== 'all') {
      const providerInstance = this.router.getProvider(targetProvider as StockProviderName);
      
      let canonicalAssets: ImageAssetResult[] = [];
      if ('searchPhotosCanonical' in providerInstance && typeof (providerInstance as any).searchPhotosCanonical === 'function') {
        canonicalAssets = await (providerInstance as any).searchPhotosCanonical(searchInput);
      } else {
        const rawResult = await providerInstance.searchPhotos(searchInput);
        canonicalAssets = (rawResult.assets || []).map(externalAssetToCanonical);
      }

      return {
        provider: targetProvider as StockProviderName,
        page,
        perPage,
        hasMore: canonicalAssets.length >= perPage,
        assets: canonicalAssets.slice(0, perPage),
        providers: {
          [targetProvider]: { status: 'ok' },
        },
      };
    }

    // Federated Multi-Provider Search Path ("all")
    const configuredProviders: StockProviderName[] = ['pexels', 'pixabay', 'unsplash'];
    const providerStatuses: Record<string, ProviderStatusSummary> = {
      pexels: { status: 'unavailable' },
      pixabay: { status: 'unavailable' },
      unsplash: { status: 'unavailable' },
    };

    const searchPromises = configuredProviders.map(async (providerName) => {
      try {
        const instance = this.router.getProvider(providerName);
        let assets: ImageAssetResult[] = [];
        
        if ('searchPhotosCanonical' in instance && typeof (instance as any).searchPhotosCanonical === 'function') {
          assets = await (instance as any).searchPhotosCanonical(searchInput);
        } else {
          const rawResult = await instance.searchPhotos(searchInput);
          assets = (rawResult.assets || []).map(externalAssetToCanonical);
        }

        providerStatuses[providerName] = { status: 'ok' };
        return assets;
      } catch (err: any) {
        const sanitizedMsg = (err.message || 'Provider search failed').replace(/key=[a-zA-Z0-9_-]+/gi, 'key=[REDACTED]');
        providerStatuses[providerName] = {
          status: err.code === 'PROVIDER_NOT_CONFIGURED' ? 'unavailable' : 'error',
          error: sanitizedMsg,
        };
        return [] as ImageAssetResult[];
      }
    });

    const resultsArray = await Promise.all(searchPromises);

    // Merge results in round-robin / interleaved order to balance provider representation
    const mergedAssets: ImageAssetResult[] = [];
    const seenUrls = new Set<string>();
    const maxLen = Math.max(...resultsArray.map((arr) => arr.length), 0);

    for (let i = 0; i < maxLen; i++) {
      for (const providerAssets of resultsArray) {
        if (i < providerAssets.length) {
          const asset = providerAssets[i];
          if (!seenUrls.has(asset.url)) {
            seenUrls.add(asset.url);
            mergedAssets.push(asset);
          }
        }
      }
    }

    const finalAssets = mergedAssets.slice(0, perPage);

    return {
      provider: 'all',
      page,
      perPage,
      hasMore: mergedAssets.length > perPage,
      assets: finalAssets,
      providers: providerStatuses,
    };
  }
}
