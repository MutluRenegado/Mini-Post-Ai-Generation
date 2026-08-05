export interface BrandKitAsset {
  id: string;
  name: string;
  type: 'logo' | 'color_palette' | 'font' | 'guideline';
  value: string;
}

export class BrandAssets {
  private static assets: BrandKitAsset[] = [
    { id: '1', name: 'Primary Logo', type: 'logo', value: '/assets/logo-primary.svg' },
    { id: '2', name: 'Corporate Blue Palette', type: 'color_palette', value: '#1D4ED8,#3B82F6,#93C5FD' },
  ];

  static getAssets(): BrandKitAsset[] {
    return [...this.assets];
  }
}
