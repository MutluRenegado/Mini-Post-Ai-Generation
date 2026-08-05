import { BrandProfile } from '../types/studio.types';

const BRAND_STORAGE_KEY = 'minipost_studio_brand_kit_v2';

export interface ExtendedBrandKitProfile extends BrandProfile {
  brandName: string;
  defaultTone: string;
  fontFamily: string;
  logoUrl?: string;
}

export class BrandManagerService {
  static getDefaultBrandProfile(): ExtendedBrandKitProfile {
    return {
      id: 'brand_default',
      name: 'Mini Post App',
      brandName: 'Mini Post App',
      primaryColor: '#06b6d4',
      secondaryColor: '#3b82f6',
      accentColor: '#f59e0b',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      fontFamily: 'Inter, sans-serif',
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      defaultTone: 'Professional & Engaging',
      voiceTone: 'Professional & Engaging',
      targetKeywords: ['AI', 'Productivity', 'Social Media', 'Growth'],
      ctaStyles: ['Learn More', 'Try Free Today', 'Get Started'],
      companyInfo: {
        website: 'https://minipost.app',
        tagline: 'AI Powered Social Media Engine',
        industry: 'Software & Technology',
      },
    };
  }

  static getActiveBrandProfile(): ExtendedBrandKitProfile {
    if (typeof window === 'undefined') {
      return this.getDefaultBrandProfile();
    }
    try {
      const raw = localStorage.getItem(BRAND_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load brand profile from storage', e);
    }
    return this.getDefaultBrandProfile();
  }

  static saveBrandProfile(profile: Partial<ExtendedBrandKitProfile>): ExtendedBrandKitProfile {
    const current = this.getActiveBrandProfile();
    const updated: ExtendedBrandKitProfile = {
      ...current,
      ...profile,
      name: profile.brandName || profile.name || current.brandName,
      brandName: profile.brandName || current.brandName,
      voiceTone: profile.defaultTone || current.defaultTone,
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist brand profile', e);
      }
    }

    return updated;
  }
}
