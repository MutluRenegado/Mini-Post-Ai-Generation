import { TopicProfile, ContentType, StudioRequest } from '../models/ai.types';

/**
 * TopicAnalyzer — Pure intelligence module.
 * Analyzes user topic and produces a rich TopicProfile without calling any external AI.
 * All classification is done deterministically using keyword matching and heuristics.
 */
export class TopicAnalyzer {
  static analyze(request: StudioRequest): TopicProfile {
    const raw = request.topic.trim();
    const lower = raw.toLowerCase();

    return {
      mainTopic: this.cleanTopic(raw),
      industry: this.detectIndustry(lower, request.industry),
      category: this.detectCategory(lower),
      searchIntent: this.detectSearchIntent(lower, request.goal),
      difficulty: this.detectDifficulty(lower),
      relatedConcepts: this.extractRelatedConcepts(lower),
      primaryKeywords: this.extractPrimaryKeywords(raw, request.keywords),
      secondaryKeywords: this.extractSecondaryKeywords(lower),
      lsiKeywords: this.extractLSIKeywords(lower),
      entities: this.extractEntities(lower),
      faqs: this.generateFAQs(raw),
      contentType: this.classifyContentType(lower, request.goal),
    };
  }

  private static cleanTopic(raw: string): string {
    return raw
      .replace(/^(write me an? (article|post|blog|content) about|create (content|a post) (for|about)|generate|what is|what are|how to|explain)\s+/i, '')
      .trim();
  }

  private static detectIndustry(lower: string, hint?: string): string {
    if (hint && hint.trim() && hint.toLowerCase() !== 'general') return hint;
    const map: Record<string, string[]> = {
      'Technology': ['ai', 'software', 'tech', 'startup', 'saas', 'cloud', 'developer', 'digital', 'api', 'machine learning', 'automation'],
      'E-Commerce': ['ecommerce', 'shopify', 'amazon', 'dropshipping', 'online store', 'checkout', 'cart', 'product listing'],
      'Finance': ['finance', 'investment', 'crypto', 'blockchain', 'banking', 'stock', 'equity', 'fintech', 'trading'],
      'Marketing': ['marketing', 'branding', 'seo', 'social media', 'content strategy', 'advertising', 'campaign', 'funnel', 'conversion'],
      'Logistics': ['logistics', 'shipping', 'customs', 'freight', 'supply chain', 'warehouse', 'cargo', 'import', 'export', 'clearance'],
      'Healthcare': ['health', 'medical', 'wellness', 'fitness', 'doctor', 'clinic', 'therapy', 'nutrition'],
      'Real Estate': ['real estate', 'property', 'housing', 'mortgage', 'rental', 'apartment', 'construction'],
      'Education': ['education', 'learning', 'course', 'training', 'university', 'skill', 'certificate'],
      'Food & Beverage': ['food', 'restaurant', 'recipe', 'cooking', 'beverage', 'coffee', 'nutrition'],
      'Fashion': ['fashion', 'clothing', 'style', 'luxury', 'brand', 'design', 'apparel'],
    };
    for (const [industry, keywords] of Object.entries(map)) {
      if (keywords.some((k) => lower.includes(k))) return industry;
    }
    return 'General Business';
  }

  private static detectCategory(lower: string): string {
    if (lower.includes('how to') || lower.includes('guide') || lower.includes('tutorial')) return 'How-To Guide';
    if (lower.includes('what is') || lower.includes('what are') || lower.includes('definition') || lower.includes('meaning')) return 'Educational Explainer';
    if (lower.includes('best') || lower.includes('top') || lower.includes('review') || lower.includes('compare')) return 'Comparison & Review';
    if (lower.includes('tips') || lower.includes('tricks') || lower.includes('hack')) return 'Tips & Strategies';
    if (lower.includes('strategy') || lower.includes('framework') || lower.includes('playbook')) return 'Strategic Framework';
    if (lower.includes('case study') || lower.includes('success story')) return 'Case Study';
    if (lower.includes('news') || lower.includes('update') || lower.includes('announcement') || lower.includes('launch')) return 'News & Announcement';
    if (lower.includes('mistake') || lower.includes('error') || lower.includes('avoid')) return 'Mistakes to Avoid';
    return 'General Content';
  }

  private static detectSearchIntent(
    lower: string,
    goal: string
  ): 'informational' | 'commercial' | 'transactional' | 'navigational' {
    if (['Promote Product', 'Promote Service', 'Discount'].includes(goal)) return 'transactional';
    if (['Brand Awareness', 'Thought Leadership'].includes(goal)) return 'commercial';
    if (lower.includes('buy') || lower.includes('price') || lower.includes('order') || lower.includes('shop')) return 'transactional';
    if (lower.includes('best') || lower.includes('review') || lower.includes('vs') || lower.includes('compare')) return 'commercial';
    return 'informational';
  }

  private static detectDifficulty(lower: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const beginnerWords = ['basic', 'beginner', 'introduction', 'what is', 'simple', 'easy', 'getting started'];
    const advancedWords = ['advanced', 'expert', 'enterprise', 'deep dive', 'technical', 'architecture', 'implementation'];
    const expertWords = ['algorithm', 'optimization', 'scalability', 'infrastructure', 'synthesis', 'quantitative'];
    if (expertWords.some((w) => lower.includes(w))) return 'expert';
    if (advancedWords.some((w) => lower.includes(w))) return 'advanced';
    if (beginnerWords.some((w) => lower.includes(w))) return 'beginner';
    return 'intermediate';
  }

  private static extractRelatedConcepts(lower: string): string[] {
    const domainMap: Record<string, string[]> = {
      'customs': ['import duties', 'trade compliance', 'tariff classification', 'customs brokerage', 'Incoterms', 'freight forwarding'],
      'ai': ['machine learning', 'neural networks', 'prompt engineering', 'LLMs', 'automation', 'data science'],
      'marketing': ['content strategy', 'SEO', 'brand voice', 'lead generation', 'conversion rate', 'audience targeting'],
      'startup': ['venture capital', 'product-market fit', 'MVP', 'growth hacking', 'fundraising', 'SaaS metrics'],
      'social media': ['content calendar', 'engagement rate', 'reach', 'impressions', 'algorithm', 'influencer marketing'],
      'ecommerce': ['conversion rate', 'cart abandonment', 'product photography', 'customer retention', 'UX', 'checkout optimization'],
    };
    for (const [key, concepts] of Object.entries(domainMap)) {
      if (lower.includes(key)) return concepts;
    }
    return ['strategy', 'best practices', 'optimization', 'growth', 'innovation'];
  }

  private static extractPrimaryKeywords(raw: string, extra?: string[]): string[] {
    const words = raw
      .replace(/[^a-zA-Z0-9 ]/g, ' ')
      .split(' ')
      .filter((w) => w.length > 3)
      .map((w) => w.toLowerCase());
    const stopWords = new Set(['with', 'this', 'that', 'from', 'they', 'have', 'been', 'will', 'your', 'their', 'what', 'when', 'where', 'which', 'some']);
    const keywords = words.filter((w) => !stopWords.has(w)).slice(0, 5);
    return [...new Set([...keywords, ...(extra || [])])].slice(0, 7);
  }

  private static extractSecondaryKeywords(lower: string): string[] {
    const additions: Record<string, string[]> = {
      'customs': ['customs clearance process', 'import/export regulations', 'duty calculations'],
      'ai': ['artificial intelligence trends', 'AI implementation', 'machine learning models'],
      'marketing': ['digital marketing ROI', 'content performance', 'audience engagement'],
      'brand': ['brand identity', 'brand consistency', 'brand messaging'],
      'startup': ['startup funding', 'early-stage growth', 'product development'],
    };
    for (const [key, kws] of Object.entries(additions)) {
      if (lower.includes(key)) return kws;
    }
    return [];
  }

  private static extractLSIKeywords(lower: string): string[] {
    const lsiMap: Record<string, string[]> = {
      'customs': ['tariff schedule', 'HS code classification', 'customs declaration', 'port of entry'],
      'ai': ['generative AI', 'transformer models', 'AI ethics', 'responsible AI'],
      'social media': ['platform algorithm', 'organic reach', 'paid promotion', 'community building'],
      'finance': ['risk management', 'portfolio diversification', 'financial planning', 'asset allocation'],
    };
    for (const [key, kws] of Object.entries(lsiMap)) {
      if (lower.includes(key)) return kws;
    }
    return ['industry insights', 'professional development', 'strategic planning'];
  }

  private static extractEntities(lower: string): string[] {
    const entityMap: Record<string, string[]> = {
      'customs': ['World Customs Organization', 'WTO', 'Incoterms 2020', 'HS Code'],
      'ai': ['OpenAI', 'Google DeepMind', 'Gemini', 'GPT-4', 'Claude'],
      'amazon': ['AWS', 'Amazon Marketplace', 'FBA', 'Prime'],
      'marketing': ['Google Analytics', 'HubSpot', 'Meta Ads', 'LinkedIn Ads'],
    };
    for (const [key, entities] of Object.entries(entityMap)) {
      if (lower.includes(key)) return entities;
    }
    return [];
  }

  private static generateFAQs(raw: string): string[] {
    const clean = this.cleanTopic(raw);
    return [
      `What is ${clean}?`,
      `Why is ${clean} important?`,
      `How does ${clean} work?`,
      `What are the benefits of ${clean}?`,
      `What are the common challenges with ${clean}?`,
    ];
  }

  private static classifyContentType(lower: string, goal: string): ContentType {
    if (goal === 'Educational' || lower.includes('what is') || lower.includes('how to') || lower.includes('guide')) return 'Educational';
    if (goal === 'Thought Leadership' || lower.includes('strategy') || lower.includes('framework') || lower.includes('opinion')) return 'Thought Leadership';
    if (goal === 'Promote Product' || goal === 'Promote Service' || goal === 'Discount') return 'Promotional';
    if (goal === 'Testimonial') return 'Story';
    if (goal === 'Announcement' || goal === 'Event') return 'Announcement';
    if (goal === 'Quote') return 'Quote';
    if (goal === 'Blog Article') return 'Guide';
    if (lower.includes('tips') || lower.includes('tricks') || lower.includes('hack')) return 'Tips';
    if (lower.includes('checklist') || lower.includes('steps') || lower.includes('list')) return 'Checklist';
    if (lower.includes('compare') || lower.includes('vs') || lower.includes('versus')) return 'Comparison';
    if (lower.includes('case study') || lower.includes('success')) return 'Case Study';
    if (lower.includes('tutorial') || lower.includes('how to')) return 'Tutorial';
    if (lower.includes('news') || lower.includes('update') || lower.includes('launch')) return 'News';
    return 'Educational';
  }
}
