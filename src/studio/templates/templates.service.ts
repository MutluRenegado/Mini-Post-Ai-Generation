import { TemplateItem } from '../types/studio.types';
import { StudioClientService } from '@/lib/services/studioClientService';

const STORAGE_KEY = 'minipost_studio_custom_templates_v1';

export class TemplateManagerService {
  static getSystemDefaults(): TemplateItem[] {
    return [
      {
        id: 'tmpl_quote_dark',
        name: 'Dark Executive Quote',
        category: 'Quote',
        aspectRatio: '1:1',
        previewColor: 'from-slate-900 via-indigo-950 to-slate-900',
        layout: {
          fontFamily: 'Inter',
          headingSize: 28,
          bodySize: 16,
          padding: 32,
          safeZoneMargins: { top: 16, bottom: 16, left: 16, right: 16 },
        },
        isCustom: false,
      },
      {
        id: 'tmpl_carousel_modern',
        name: 'Modern Gradient Carousel',
        category: 'Carousel',
        aspectRatio: '4:5',
        previewColor: 'from-cyan-950 via-slate-900 to-indigo-950',
        layout: {
          fontFamily: 'Inter',
          headingSize: 32,
          bodySize: 18,
          padding: 40,
          safeZoneMargins: { top: 24, bottom: 24, left: 24, right: 24 },
        },
        isCustom: false,
      },
      {
        id: 'tmpl_story_vibrant',
        name: 'Vibrant Story Showcase',
        category: 'Story',
        aspectRatio: '9:16',
        previewColor: 'from-purple-900 via-pink-950 to-slate-950',
        layout: {
          fontFamily: 'Inter',
          headingSize: 36,
          bodySize: 18,
          padding: 48,
          safeZoneMargins: { top: 60, bottom: 80, left: 24, right: 24 },
        },
        isCustom: false,
      },
      {
        id: 'tmpl_promo_cyber',
        name: 'Cyberpunk Tech Offer',
        category: 'Promotion',
        aspectRatio: '16:9',
        previewColor: 'from-cyan-900 via-[#0B0F19] to-indigo-950',
        layout: {
          fontFamily: 'Inter',
          headingSize: 30,
          bodySize: 16,
          padding: 36,
          safeZoneMargins: { top: 20, bottom: 20, left: 20, right: 20 },
        },
        isCustom: false,
      },
      {
        id: 'tmpl_edu_minimal',
        name: 'Minimalist Educational Tip',
        category: 'Educational',
        aspectRatio: '4:5',
        previewColor: 'from-emerald-950 via-slate-900 to-teal-950',
        layout: {
          fontFamily: 'Inter',
          headingSize: 26,
          bodySize: 15,
          padding: 32,
          safeZoneMargins: { top: 16, bottom: 16, left: 16, right: 16 },
        },
        isCustom: false,
      },
    ];
  }

  static getCustomTemplates(): TemplateItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse custom templates', e);
    }
    return [];
  }

  static getTemplates(): TemplateItem[] {
    return [...this.getSystemDefaults(), ...this.getCustomTemplates()];
  }

  static saveCustomTemplate(input: Omit<TemplateItem, 'id' | 'isCustom' | 'createdAt'>): TemplateItem {
    const newTemplate: TemplateItem = {
      ...input,
      id: `tmpl_user_${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const existing = this.getCustomTemplates();
      const updated = [newTemplate, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    return newTemplate;
  }

  static deleteCustomTemplate(id: string): void {
    if (typeof window !== 'undefined') {
      const existing = this.getCustomTemplates();
      const filtered = existing.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  }

  static async generateTemplateContent(templateId: string, topic: string) {
    const response = await StudioClientService.generate({
      action: 'generate_post',
      topic,
      templateId,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Template AI content generation failed.');
    }

    return {
      templateId,
      topic,
      content: response.data.content,
      imagePrompt: response.data.imagePrompt,
      hashtags: response.data.hashtags,
    };
  }
}
