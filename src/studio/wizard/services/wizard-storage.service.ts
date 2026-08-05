import { WizardFormData } from '../types/wizard.types';

const DRAFT_KEY = 'minipost_studio_creator_wizard_draft_v2';

export class WizardStorageService {
  static getDefaultFormData(): WizardFormData {
    return {
      postGoal: 'Promote Product',
      topic: '',
      title: '',
      description: '',
      callToAction: 'Learn More',
      targetAudience: 'Tech Professionals & Content Creators',
      industry: 'Technology',
      language: 'English',
      tone: 'Professional',
      platforms: ['Instagram Feed', 'LinkedIn', 'X'],
      templateId: 'tmpl_quote_dark',
      brandId: 'brand_default',
      imageSource: 'ai_generated',
      imagePrompt: 'Vibrant modern studio workspace with clean daylight, active strategy team, cyan and amber accents',
      imageStyle: 'colourful-professional',
      imageAspectRatio: '1:1',
      publishMode: 'now',
      timezone: 'UTC',
    };
  }

  static saveDraft(data: Partial<WizardFormData>): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save wizard draft', e);
    }
  }

  static loadDraft(): Partial<WizardFormData> | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load wizard draft', e);
    }
    return null;
  }

  static clearDraft(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      console.warn('Failed to clear wizard draft', e);
    }
  }
}
