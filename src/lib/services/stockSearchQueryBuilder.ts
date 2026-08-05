import type { PostVisualBrief } from '../ai-image-generator/images/image.types';
import { StockSearchService, UnifiedStockSearchResponse } from './stockSearchService';
import { StockProviderName } from '../../providers/stock-provider-router';

export interface StockSearchQueryBuilderResult {
  query: string;
  generatedQuery: string;
  userRefinement?: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  color?: string;
  safeSearch: true;
  sourcePostId?: string;
  visualBrief: PostVisualBrief;
}

export class StockSearchQueryBuilder {
  /**
   * Sanitizes text by stripping URLs, hashtags, mentions, emails, phone numbers, and CTA fluff.
   */
  public static sanitizeText(text: string): string {
    if (!text) return '';

    let cleaned = text
      // Strip URLs
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/www\.\S+/gi, '')
      // Strip tracking parameters
      .replace(/\?utm_\S+/gi, '')
      // Strip Emails
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, '')
      // Strip Phone Numbers
      .replace(/(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, '')
      // Strip Hashtags
      .replace(/#\w+/g, '')
      // Strip Account Handles
      .replace(/@\w+/g, '')
      // Strip common CTA phrases
      .replace(/\b(click link|link in bio|subscribe now|call us|buy now|comment below|follow us|read more)\b/gi, '');

    // Normalize spacing and punctuation
    cleaned = cleaned.replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    return cleaned;
  }

  /**
   * Builds a concise, high-relevance stock photo search query strictly from a PostVisualBrief.
   */
  static buildQuery(brief: PostVisualBrief, userRefinement?: string): StockSearchQueryBuilderResult {
    const rawSubject = brief.mainSubject || brief.primaryTopic || '';
    const rawEnvironment = brief.environment || '';
    const rawObjects = (brief.keyObjects || []).join(' ');

    const cleanSubject = this.sanitizeText(rawSubject);
    const cleanEnvironment = this.sanitizeText(rawEnvironment);
    const cleanObjects = this.sanitizeText(rawObjects);

    // Combine visual terms prioritizing main subject, environment, and key objects
    const terms = [cleanSubject, cleanEnvironment, cleanObjects]
      .filter((t) => t.length > 0)
      .join(' ');

    // Deduplicate words deterministically
    const words = terms.split(/\s+/).filter((w) => w.length > 2);
    const uniqueWords = Array.from(new Set(words.map((w) => w.toLowerCase())));
    const generatedBase = uniqueWords.slice(0, 6).join(' ') || 'modern office technology';

    // Cap generated query at 100 characters max
    const generatedQuery = generatedBase.slice(0, 100);

    // Apply user refinement if provided
    const cleanRefinement = userRefinement ? this.sanitizeText(userRefinement) : undefined;
    let finalQuery = generatedQuery;
    if (cleanRefinement) {
      finalQuery = `${generatedQuery} ${cleanRefinement}`.trim().slice(0, 100);
    }

    // Determine orientation from visualBrief.aspectRatio or platform
    let orientation: 'landscape' | 'portrait' | 'square' = 'square';
    if (brief.aspectRatio === '9:16' || brief.aspectRatio === '4:5' || brief.aspectRatio === '2:3') {
      orientation = 'portrait';
    } else if (brief.aspectRatio === '16:9' || brief.aspectRatio === '4:3') {
      orientation = 'landscape';
    }

    // Extract primary brand color if available for color hint
    let color: string | undefined = undefined;
    if (brief.brandColors && brief.brandColors.length > 0) {
      const primaryHex = brief.brandColors[0];
      if (primaryHex && primaryHex.startsWith('#')) {
        color = primaryHex;
      }
    }

    return {
      query: finalQuery,
      generatedQuery,
      userRefinement: cleanRefinement,
      orientation,
      color,
      safeSearch: true,
      sourcePostId: brief.postId,
      visualBrief: brief,
    };
  }

  /**
   * Server-side helper executing search via StockSearchService using query built from VisualBrief.
   */
  static async searchFromVisualBrief(
    brief: PostVisualBrief,
    options: {
      provider?: StockProviderName | 'all';
      userRefinement?: string;
      page?: number;
      perPage?: number;
    } = {}
  ): Promise<UnifiedStockSearchResponse> {
    const built = this.buildQuery(brief, options.userRefinement);
    
    return StockSearchService.search({
      action: 'search_stock_images',
      provider: options.provider || 'all',
      query: built.query,
      orientation: built.orientation,
      page: options.page || 1,
      perPage: options.perPage || 20,
      color: built.color,
      safeSearch: true,
    });
  }
}
