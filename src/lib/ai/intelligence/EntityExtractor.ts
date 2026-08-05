import { TopicProfile } from '../models/ai.types';

export interface EntitySet {
  organizations: string[];
  standards: string[];
  tools: string[];
  concepts: string[];
}

export class EntityExtractor {
  static extract(profile: TopicProfile): EntitySet {
    const lower = profile.mainTopic.toLowerCase();

    return {
      organizations: this.extractOrgs(lower, profile.industry),
      standards: this.extractStandards(lower, profile.industry),
      tools: this.extractTools(lower, profile.industry),
      concepts: profile.relatedConcepts,
    };
  }

  private static extractOrgs(lower: string, industry: string): string[] {
    const map: Record<string, string[]> = {
      'Technology': ['Google', 'Microsoft', 'OpenAI', 'AWS', 'Anthropic'],
      'Marketing': ['HubSpot', 'Salesforce', 'Hootsuite', 'Meta', 'Google Ads'],
      'Logistics': ['DHL', 'FedEx', 'UPS', 'World Customs Organization', 'WTO'],
      'Finance': ['IMF', 'World Bank', 'SEC', 'Federal Reserve', 'Goldman Sachs'],
      'E-Commerce': ['Shopify', 'Amazon', 'WooCommerce', 'Stripe', 'PayPal'],
    };
    return map[industry] || [];
  }

  private static extractStandards(lower: string, industry: string): string[] {
    const map: Record<string, string[]> = {
      'Logistics': ['Incoterms 2020', 'HS Code', 'ISO 28000', 'AEO Certification'],
      'Technology': ['ISO 27001', 'GDPR', 'SOC 2', 'REST API'],
      'Finance': ['IFRS', 'GAAP', 'Basel III', 'MiFID II'],
    };
    return map[industry] || [];
  }

  private static extractTools(lower: string, industry: string): string[] {
    const map: Record<string, string[]> = {
      'Marketing': ['Google Analytics', 'Ahrefs', 'SEMrush', 'Canva', 'Buffer'],
      'Technology': ['GitHub', 'Docker', 'Kubernetes', 'VS Code', 'Figma'],
      'E-Commerce': ['Shopify', 'Klaviyo', 'Gorgias', 'Triple Whale', 'Postscript'],
    };
    return map[industry] || [];
  }
}
