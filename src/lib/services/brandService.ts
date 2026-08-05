export interface BrandRulesProfile {
  id: string;
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  defaultTone: string;
  tagline: string;
  website: string;
  industry: string;
  watermarkUrl?: string;
  updatedAt: string;
}

const BRAND_STORAGE_KEY = 'minipost_backend_brand_profile_v1';

export class BrandService {
  static getDefaultBrandRules(): BrandRulesProfile {
    return {
      id: 'brand_default',
      brandName: 'Mini Post App',
      logoUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400',
      primaryColor: '#06b6d4',
      secondaryColor: '#3b82f6',
      accentColor: '#f59e0b',
      fontFamily: 'Inter, sans-serif',
      defaultTone: 'Professional & Engaging',
      tagline: 'AI Powered Social Media Engine',
      website: 'https://minipost.app',
      industry: 'Software & Technology',
      updatedAt: new Date().toISOString(),
    };
  }

  static getActiveBrandRules(): BrandRulesProfile {
    if (typeof window === 'undefined') {
      return this.getDefaultBrandRules();
    }
    try {
      const raw = localStorage.getItem(BRAND_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load brand rules', e);
    }
    return this.getDefaultBrandRules();
  }

  static saveBrandRules(profile: Partial<BrandRulesProfile>): BrandRulesProfile {
    const current = this.getActiveBrandRules();
    const updated: BrandRulesProfile = {
      ...current,
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist brand rules', e);
      }
    }

    return updated;
  }
}
