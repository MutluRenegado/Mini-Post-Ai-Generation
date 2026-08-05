export interface MarketplaceItem {
  id: string;
  name: string;
  type: 'prompt_pack' | 'workflow_template' | 'knowledge_pack' | 'plugin';
  author: string;
  rating: number;
  downloads: number;
  version: string;
}

export class StudioMarketplace {
  private static items: MarketplaceItem[] = [
    {
      id: 'mp_logistics_v1',
      name: 'Global Supply Chain & Logistics Knowledge Pack',
      type: 'knowledge_pack',
      author: 'StudioOS Official',
      rating: 4.9,
      downloads: 1240,
      version: '1.0.0',
    },
    {
      id: 'mp_viral_x_v2',
      name: 'Viral Tech Twitter/X Hook Blueprint Pack',
      type: 'prompt_pack',
      author: 'Growth Studio',
      rating: 4.8,
      downloads: 850,
      version: '2.1.0',
    },
  ];

  static listMarketplaceItems(): MarketplaceItem[] {
    return [...this.items];
  }

  static installItem(id: string): boolean {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.downloads += 1;
      return true;
    }
    return false;
  }
}
