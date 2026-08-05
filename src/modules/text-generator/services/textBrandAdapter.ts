export interface TextBrandProfile {
  id?: string;
  brandTone: string;
  brandKeywords: string[];
}

export class TextBrandAdapter {
  public static extractTextBrandRules(profile?: any): TextBrandProfile {
    if (!profile) {
      return {
        brandTone: 'Professional, Authoritative, Inspiring',
        brandKeywords: ['Innovation', 'Excellence', 'Growth'],
      };
    }

    return {
      id: profile.id,
      brandTone: profile.brandTone || profile.tone || 'Professional',
      brandKeywords: profile.brandKeywords || profile.keywords || [],
    };
  }
}
