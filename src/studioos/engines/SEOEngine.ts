import { SEOOptimizer } from '@/lib/ai-text-editor/optimization/SEOOptimizer';

export class StudioSEOEngine {
  static optimize(text: string, keywords: string[]) {
    return SEOOptimizer.optimize(text, keywords);
  }
}
