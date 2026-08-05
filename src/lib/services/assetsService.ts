export interface MediaAssetRecord {
  id: string;
  name: string;
  type: 'image' | 'video' | 'vector' | 'logo';
  url: string;
  sizeBytes: number;
  tags: string[];
  createdAt: string;
}

const ASSETS_STORAGE_KEY = 'minipost_backend_assets_v1';

export class AssetsService {
  static getStoredAssets(): MediaAssetRecord[] {
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
      console.warn('Failed to load assets', e);
    }
    return this.getSampleAssets();
  }

  static getSampleAssets(): MediaAssetRecord[] {
    return [
      { id: 'ast_1', name: 'Brand-Hero-Banner.png', type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', sizeBytes: 2516582, tags: ['banner', 'hero'], createdAt: new Date().toISOString() },
      { id: 'ast_2', name: 'Product-Demo-Reel.mp4', type: 'video', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800', sizeBytes: 14784921, tags: ['demo', 'video'], createdAt: new Date().toISOString() },
      { id: 'ast_3', name: 'Company-Logo-White.svg', type: 'vector', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400', sizeBytes: 122880, tags: ['logo', 'vector'], createdAt: new Date().toISOString() },
    ];
  }

  static addAsset(asset: Omit<MediaAssetRecord, 'id' | 'createdAt'>): MediaAssetRecord[] {
    const current = this.getStoredAssets();
    const newRecord: MediaAssetRecord = {
      ...asset,
      id: `ast_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...current];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save asset record', e);
      }
    }
    return updated;
  }
}
