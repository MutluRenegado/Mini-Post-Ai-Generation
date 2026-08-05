export interface ImageBrandProfile {
  id?: string;
  brandColors: string[];
  visualRestrictions?: string[];
  visualMood?: string;
}

export class ImageBrandAdapter {
  public static extractVisualBrandRules(profile?: any): ImageBrandProfile {
    if (!profile) {
      return {
        brandColors: ['#00F0FF', '#0F172A', '#38BDF8'],
        visualRestrictions: ['no explicit content', 'no low resolution'],
        visualMood: 'Modern, Premium, Clean',
      };
    }

    return {
      id: profile.id,
      brandColors: profile.brandColors || profile.colors || ['#00F0FF', '#0F172A'],
      visualRestrictions: profile.visualRestrictions || [],
      visualMood: profile.visualMood || 'Modern',
    };
  }
}
