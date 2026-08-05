import { PlatformContent } from '../models/ai.types';
import { SEOOptimizer } from './SEOOptimizer';
import { ReadabilityOptimizer } from './ReadabilityOptimizer';
import { HashtagOptimizer } from './HashtagOptimizer';

export class ContentOptimizer {
  static optimize(content: PlatformContent): PlatformContent {
    const cleanedBody = ReadabilityOptimizer.optimize(content.body);
    const seoBody = SEOOptimizer.optimize(cleanedBody, content.seoKeywords);
    const optimizedHashtags = HashtagOptimizer.optimize(content.hashtags, content.platform);

    return {
      ...content,
      body: seoBody,
      hashtags: optimizedHashtags,
      charCount: seoBody.length,
    };
  }
}
