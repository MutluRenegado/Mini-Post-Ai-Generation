import { MediaAsset } from '../types/studio.types';

const ASSETS_STORAGE_KEY = 'minipost_studio_assets_v2';

export class AssetManagerService {
  static getSampleAssets(): MediaAsset[] {
    return [
      {
        id: 'asset_1',
        name: 'Brand-Hero-Banner.png',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        sizeBytes: 2516582,
        mimeType: 'image/png',
        tags: ['banner', 'brand', 'hero'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'asset_2',
        name: 'Product-Demo-Reel.mp4',
        type: 'video',
        url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
        sizeBytes: 14784921,
        mimeType: 'video/mp4',
        tags: ['demo', 'product', 'reel'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'asset_3',
        name: 'Company-Logo-White.svg',
        type: 'logo',
        url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400',
        sizeBytes: 122880,
        mimeType: 'image/svg+xml',
        tags: ['logo', 'vector', 'white'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  static getStoredAssets(): MediaAsset[] {
    if (typeof window === 'undefined') {
      return this.getSampleAssets();
    }
    try {
      const raw = localStorage.getItem(ASSETS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load assets from storage', e);
    }
    return this.getSampleAssets();
  }

  static saveAsset(asset: Partial<MediaAsset> & { name: string; url: string; type: MediaAsset['type'] }): MediaAsset[] {
    const current = this.getStoredAssets();
    const newAsset: MediaAsset = {
      id: asset.id || `asset_${Date.now()}`,
      name: asset.name,
      type: asset.type,
      url: asset.url,
      thumbnailUrl: asset.thumbnailUrl || asset.url,
      sizeBytes: asset.sizeBytes || 1887436,
      mimeType: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/png'),
      tags: asset.tags || ['generated', 'studio'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newAsset, ...current];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save assets to storage', e);
      }
    }
    return updated;
  }

  static deleteAsset(id: string): MediaAsset[] {
    const current = this.getStoredAssets();
    const updated = current.filter((item) => item.id !== id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to delete asset from storage', e);
      }
    }
    return updated;
  }
}

