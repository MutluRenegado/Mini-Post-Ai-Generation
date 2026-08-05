import { PostRequest } from '../types/studio.types';

const STORAGE_KEY = 'minipost_studio_wizard_draft';

export class CreatorWizardService {
  static getInitialRequest(): PostRequest {
    return {
      platforms: ['instagram', 'linkedin', 'twitter'],
      postType: 'single_image',
      goal: 'engagement',
      targetAudience: 'General Audience',
      language: 'English',
      tone: 'Professional & Engaging',
      industry: 'Technology',
      ctaText: 'Learn More',
      keywords: [],
      imagePreference: 'ai_generated',
    };
  }

  static saveDraft(request: Partial<PostRequest>): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(request));
    }
  }

  static loadDraft(): Partial<PostRequest> | null {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}
