import { TopicProfile } from '../models/ai.types';

export interface KeywordSet {
  primary: string[];
  secondary: string[];
  lsi: string[];
  hashtags: string[];
  negative: string[];   // words to avoid for brand safety
}

export class KeywordExtractor {
  static extract(profile: TopicProfile): KeywordSet {
    return {
      primary: profile.primaryKeywords,
      secondary: profile.secondaryKeywords,
      lsi: profile.lsiKeywords,
      hashtags: this.buildHashtags(profile),
      negative: this.buildNegativeList(profile.industry),
    };
  }

  private static buildHashtags(profile: TopicProfile): string[] {
    const base = profile.primaryKeywords.map((k) =>
      '#' + k.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, '')
        .split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    );

    const industryTags: Record<string, string[]> = {
      'Technology': ['#TechLeadership', '#Innovation', '#DigitalTransformation', '#FutureOfWork'],
      'Marketing': ['#ContentStrategy', '#DigitalMarketing', '#MarketingTips', '#GrowthMarketing'],
      'Logistics': ['#SupplyChain', '#GlobalTrade', '#Logistics', '#FreightForwarding'],
      'Finance': ['#FinTech', '#Investment', '#WealthBuilding', '#Finance'],
      'E-Commerce': ['#Ecommerce', '#OnlineBusiness', '#DTC', '#RetailStrategy'],
      'Healthcare': ['#HealthTech', '#Wellness', '#DigitalHealth', '#MedTech'],
      'Education': ['#EdTech', '#LearningAndDevelopment', '#Upskilling', '#FutureSkills'],
      'General Business': ['#Business', '#Entrepreneurship', '#Leadership', '#Strategy'],
    };

    const industry = profile.industry;
    const extra = industryTags[industry] || industryTags['General Business'];
    return [...new Set([...base, ...extra])].slice(0, 12);
  }

  private static buildNegativeList(industry: string): string[] {
    return ['guaranteed', 'best ever', 'number one', '#1', 'click here', 'buy now', 'limited time'];
  }
}
