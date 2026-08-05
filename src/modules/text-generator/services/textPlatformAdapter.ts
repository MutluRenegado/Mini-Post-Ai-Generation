export interface TextPlatformRule {
  platform: string;
  maxCharacterLength: number;
  recommendedHashtags: number;
}

export class TextPlatformAdapter {
  public static getTextPlatformRules(platform = 'LinkedIn'): TextPlatformRule {
    const lower = platform.toLowerCase();

    if (lower.includes('x') || lower.includes('twitter')) {
      return { platform: 'X (Twitter)', maxCharacterLength: 280, recommendedHashtags: 2 };
    }
    if (lower.includes('instagram')) {
      return { platform: 'Instagram', maxCharacterLength: 2200, recommendedHashtags: 5 };
    }
    if (lower.includes('linkedin')) {
      return { platform: 'LinkedIn', maxCharacterLength: 3000, recommendedHashtags: 3 };
    }

    return { platform: 'Generic', maxCharacterLength: 2000, recommendedHashtags: 3 };
  }
}
