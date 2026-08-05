export interface MediaAssetItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  promptUsed?: string;
  createdAt: string;
}

export class MediaAssets {
  private static media: MediaAssetItem[] = [];

  static saveMedia(item: Omit<MediaAssetItem, 'id' | 'createdAt'>): MediaAssetItem {
    const asset: MediaAssetItem = {
      ...item,
      id: `media_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.media.push(asset);
    return asset;
  }

  static listMedia(): MediaAssetItem[] {
    return [...this.media];
  }
}
