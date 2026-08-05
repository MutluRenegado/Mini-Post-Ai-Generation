import { AudienceProfile, StudioTone } from '../models/ai.types';

export class AudienceAnalyzer {
  static analyze(audience: string, tone: StudioTone): AudienceProfile {
    const lower = audience.toLowerCase();
    return {
      segment: audience,
      vocabularyLevel: this.detectVocabularyLevel(lower),
      formality: this.detectFormality(lower, tone),
      painPoints: this.detectPainPoints(lower),
      motivations: this.detectMotivations(lower),
      preferredCTA: this.detectCTA(lower, tone),
      emojiUsage: this.detectEmojiUsage(lower, tone),
      sentenceLength: this.detectSentenceLength(lower, tone),
    };
  }

  private static detectVocabularyLevel(lower: string): AudienceProfile['vocabularyLevel'] {
    if (lower.includes('ceo') || lower.includes('executive') || lower.includes('c-suite') || lower.includes('director')) return 'executive';
    if (lower.includes('developer') || lower.includes('engineer') || lower.includes('technical') || lower.includes('architect')) return 'technical';
    if (lower.includes('founder') || lower.includes('entrepreneur') || lower.includes('manager') || lower.includes('professional')) return 'professional';
    if (lower.includes('student') || lower.includes('beginner') || lower.includes('general') || lower.includes('consumer')) return 'simple';
    return 'intermediate';
  }

  private static detectFormality(lower: string, tone: StudioTone): AudienceProfile['formality'] {
    if (tone === 'Luxury' || tone === 'Corporate') return 'executive';
    if (tone === 'Professional' || tone === 'Technical') return 'formal';
    if (tone === 'Casual' || tone === 'Funny') return 'casual';
    if (lower.includes('ceo') || lower.includes('executive')) return 'executive';
    if (lower.includes('consumer') || lower.includes('general')) return 'casual';
    return 'semi-formal';
  }

  private static detectPainPoints(lower: string): string[] {
    const map: Record<string, string[]> = {
      'ceo': ['scaling operations', 'board accountability', 'market positioning', 'talent retention'],
      'founder': ['finding product-market fit', 'fundraising', 'team building', 'burn rate management'],
      'developer': ['debugging complex systems', 'technical debt', 'performance bottlenecks', 'deployment failures'],
      'marketing': ['low conversion rates', 'shrinking organic reach', 'attribution challenges', 'content at scale'],
      'small business': ['cash flow', 'customer acquisition costs', 'competing with large brands', 'time management'],
      'student': ['information overload', 'practical experience gaps', 'networking', 'job market competition'],
    };
    for (const [key, points] of Object.entries(map)) {
      if (lower.includes(key)) return points;
    }
    return ['time constraints', 'achieving results with limited resources', 'staying competitive', 'keeping up with change'];
  }

  private static detectMotivations(lower: string): string[] {
    const map: Record<string, string[]> = {
      'ceo': ['driving shareholder value', 'legacy building', 'market dominance', 'industry influence'],
      'founder': ['building something meaningful', 'financial freedom', 'solving real problems', 'scaling impact'],
      'developer': ['shipping clean code', 'learning new tech', 'open source contribution', 'career growth'],
      'marketing': ['campaign performance', 'brand recognition', 'lead generation', 'creative expression'],
      'consumer': ['saving money', 'finding the best deals', 'convenience', 'quality products'],
    };
    for (const [key, motivations] of Object.entries(map)) {
      if (lower.includes(key)) return motivations;
    }
    return ['professional growth', 'efficiency', 'success', 'innovation'];
  }

  private static detectCTA(lower: string, tone: StudioTone): string {
    if (tone === 'Professional' || lower.includes('executive') || lower.includes('ceo')) return 'Share your experience in the comments';
    if (tone === 'Friendly' || lower.includes('consumer')) return 'Save this for later!';
    if (tone === 'Educational') return 'Follow for daily insights';
    if (lower.includes('founder') || lower.includes('entrepreneur')) return 'What has worked for your business?';
    if (lower.includes('developer')) return 'Drop your approach in the replies';
    return 'What are your thoughts? Comment below';
  }

  private static detectEmojiUsage(lower: string, tone: StudioTone): AudienceProfile['emojiUsage'] {
    if (tone === 'Corporate' || tone === 'Luxury' || tone === 'Minimal') return 'none';
    if (tone === 'Professional' || lower.includes('executive') || lower.includes('ceo')) return 'minimal';
    if (tone === 'Funny' || tone === 'Casual') return 'heavy';
    return 'moderate';
  }

  private static detectSentenceLength(lower: string, tone: StudioTone): AudienceProfile['sentenceLength'] {
    if (tone === 'Minimal' || lower.includes('twitter') || lower.includes('tiktok')) return 'short';
    if (tone === 'Corporate' || tone === 'Luxury') return 'long';
    if (lower.includes('executive') || lower.includes('ceo')) return 'medium';
    return 'mixed';
  }
}
