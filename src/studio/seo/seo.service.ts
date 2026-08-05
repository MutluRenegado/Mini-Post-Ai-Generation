import { SEOOptimizer } from '@/lib/ai-text-editor/optimization/SEOOptimizer';
import { StudioClientService } from '@/lib/services/studioClientService';

export interface SEOAnalysisResult {
  score: number;
  keywordDensity: number;
  readabilityIndex: string;
  searchIntentMatch: string;
  metaTitle: string;
  metaDescription: string;
}

export class SEOEngineService {
  static optimize(text: string, keywords: string[]): string {
    return SEOOptimizer.optimize(text, keywords);
  }

  static async generateSeoContent(topic: string, keywords: string[] = []): Promise<{
    text: string;
    analysis: SEOAnalysisResult;
  }> {
    const response = await StudioClientService.generate({
      action: 'generate_text',
      textAction: 'full_article',
      topic: `SEO Optimized Article for: ${topic}`,
      keywords,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'SEO AI content generation failed.');
    }

    const text = response.data.content || '';
    const analysis = this.analyzeContent(text, keywords[0] || topic);

    return { text, analysis };
  }

  static analyzeContent(text: string, primaryKeyword: string = 'AI'): SEOAnalysisResult {
    const optimized = this.optimize(text, [primaryKeyword]);
    const wordCount = optimized.split(/\s+/).filter(Boolean).length;
    const matches = (optimized.match(new RegExp(primaryKeyword, 'gi')) || []).length;
    const density = wordCount > 0 ? (matches / wordCount) * 100 : 0;

    return {
      score: density > 0.5 ? 95 : 82,
      keywordDensity: Number(density.toFixed(2)),
      readabilityIndex: 'College Graduate (Optimal)',
      searchIntentMatch: 'Informational & Commercial',
      metaTitle: `${primaryKeyword} Strategy & Execution Guide | MiniPostStudio`,
      metaDescription: optimized.slice(0, 150) + '...',
    };
  }
}
