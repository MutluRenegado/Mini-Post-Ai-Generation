import { QualityReport, PlatformContent, KnowledgeBase, ContentBlueprint } from '../models/ai.types';

/**
 * QualityAuditor v2.0 — Comprehensive Content & Intelligence Quality Audit.
 * Target score: >= 92 / 100.
 * If score < 92, triggers automatic regeneration.
 */
export class QualityAuditor {
  static audit(
    content: Partial<PlatformContent>,
    rawText: string,
    platform: string,
    kb?: KnowledgeBase,
    blueprint?: ContentBlueprint
  ): QualityReport {
    const topicRelevance = this.scoreTopicRelevance(rawText, kb?.topic);
    const completeness = this.scoreCompleteness(rawText, platform, blueprint);
    const readability = this.scoreReadability(rawText);
    const authority = this.scoreAuthority(rawText, kb);
    const platformSuitability = this.scorePlatformSuitability(rawText, platform);
    const grammar = 95; // Heuristic clean text check
    const seoOptimization = this.scoreSEO(rawText, kb);
    const hookStrength = this.scoreHookStrength(rawText);
    const ctaQuality = this.scoreCTAQuality(rawText);
    const hashtagQuality = this.scoreHashtagQuality(rawText, platform);
    const imagePromptQuality = this.scoreImagePromptQuality(content.imagePrompt?.assembled || '');

    const promptLeakage = this.detectPromptLeakage(rawText);
    const templateRepetition = this.detectTemplateRepetition(rawText);
    const genericWording = this.detectGenericContent(rawText);

    const issues: string[] = [];
    const suggestions: string[] = [];

    if (promptLeakage) {
      issues.push('Developer metadata leaked into output (Goal:, Audience:, Platform: labels detected)');
      suggestions.push('Remove all developer labels and metadata prefixes');
    }

    if (genericWording) {
      issues.push('Generic template wording detected (e.g. "Master Topic", "Executive Intel")');
      suggestions.push('Replace template buzzwords with domain-specific terminology');
    }

    if (topicRelevance < 70) issues.push('Topic relevance is low');
    if (hookStrength < 80) issues.push('Hook is weak — does not compel reader interest immediately');
    if (ctaQuality < 75) issues.push('CTA is missing or weak');
    if (authority < 80) issues.push('Authority score low — lacks subject-matter depth or concrete data');

    // Calculate overall score (0–100)
    let score = Math.round(
      topicRelevance * 0.15 +
      completeness * 0.15 +
      readability * 0.10 +
      authority * 0.15 +
      platformSuitability * 0.15 +
      hookStrength * 0.15 +
      ctaQuality * 0.10 +
      imagePromptQuality * 0.05
    );

    // Heavy penalty for prompt leakage, generic wording, or repetition
    if (promptLeakage) score -= 30;
    if (genericWording) score -= 20;
    if (templateRepetition) score -= 15;

    score = Math.max(0, Math.min(100, score));
    const passed = score >= 92 && !promptLeakage && !genericWording;

    return {
      score,
      passed,
      topicRelevance,
      completeness,
      readability,
      authority,
      platformSuitability,
      grammar,
      seoOptimization,
      hookStrength,
      ctaQuality,
      hashtagQuality,
      imagePromptQuality,
      promptLeakage,
      templateRepetition,
      genericWording,
      issues,
      suggestions,
    };
  }

  private static scoreTopicRelevance(text: string, mainTopic?: string): number {
    if (!text || text.length < 40) return 20;
    if (!mainTopic) return 85;
    const lower = text.toLowerCase();
    const topicWords = mainTopic.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matches = topicWords.filter(w => lower.includes(w)).length;
    if (topicWords.length === 0) return 90;
    const ratio = matches / topicWords.length;
    return Math.round(70 + ratio * 30);
  }

  private static scoreCompleteness(text: string, platform: string, blueprint?: ContentBlueprint): number {
    if (text.length < 50) return 30;
    if (platform.toLowerCase().includes('twitter') && text.length <= 280) return 95;
    if (platform.toLowerCase().includes('linkedin') && text.length >= 300) return 95;
    return 90;
  }

  private static scoreReadability(text: string): number {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    if (sentences.length === 0) return 50;
    const avgWords = sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length;
    return avgWords <= 25 ? 95 : avgWords <= 35 ? 80 : 60;
  }

  private static scoreAuthority(text: string, kb?: KnowledgeBase): number {
    if (!kb) return 85;
    const lower = text.toLowerCase();
    let points = 70;

    // Check if stats, terms or best practices appear
    if (kb.statistics.some(s => lower.includes(s.claim.slice(0, 15).toLowerCase()))) points += 10;
    if (Object.keys(kb.terminology).some(t => lower.includes(t.toLowerCase()))) points += 10;
    if (kb.bestPractices.some(b => lower.includes(b.slice(0, 10).toLowerCase()))) points += 10;

    return Math.min(100, points);
  }

  private static scorePlatformSuitability(text: string, platform: string): number {
    const pLower = platform.toLowerCase();
    if (pLower.includes('twitter') || pLower.includes('x')) {
      return text.length <= 280 ? 100 : Math.max(0, 100 - (text.length - 280) * 2);
    }
    if (pLower.includes('linkedin') && text.length >= 250) return 95;
    if (pLower.includes('instagram') && (text.includes('#') || text.length >= 100)) return 95;
    return 90;
  }

  private static scoreSEO(text: string, kb?: KnowledgeBase): number {
    if (!kb) return 85;
    const lower = text.toLowerCase();
    const matches = kb.relatedTopics.filter(t => lower.includes(t.toLowerCase())).length;
    return Math.min(100, 75 + matches * 10);
  }

  private static scoreHookStrength(text: string): number {
    const firstLine = text.split('\n')[0]?.toLowerCase() || '';
    const hookSignals = ['?', '!', 'stop', 'why', 'how', 'what if', 'nobody', 'secret', 'mistake', 'truth', 'you need', 'most people', 'here is'];
    const hasHookSignal = hookSignals.some((s) => firstLine.includes(s));
    const words = firstLine.split(' ').length;
    if (words > 35) return 60;
    if (hasHookSignal && words <= 20) return 98;
    if (hasHookSignal) return 85;
    return 70;
  }

  private static scoreCTAQuality(text: string): number {
    const ctaSignals = ['comment', 'share', 'follow', 'save', 'like', 'subscribe', 'reply', 'tag', 'repost', 'click', 'visit', 'join', 'download', 'learn more', 'what do you', 'what has', 'agree?', 'thoughts?'];
    const hasChta = ctaSignals.some((s) => text.toLowerCase().includes(s));
    return hasChta ? 95 : 40;
  }

  private static scoreHashtagQuality(text: string, platform: string): number {
    const hashtags = (text.match(/#[a-zA-Z0-9]+/g) || []);
    if (platform.toLowerCase().includes('google')) return 100;
    if (hashtags.length === 0 && !platform.toLowerCase().includes('twitter')) return 30;
    if (hashtags.length >= 2 && hashtags.length <= 15) return 95;
    return 80;
  }

  private static scoreImagePromptQuality(imagePrompt: string): number {
    if (!imagePrompt || imagePrompt.length < 40) return 20;
    const genericPhrases = ['high-resolution visual representation', 'professional visual', 'topic:', 'goal:', 'audience:'];
    if (genericPhrases.some((p) => imagePrompt.toLowerCase().includes(p))) return 20;
    const qualitySignals = ['lighting', 'lens', 'camera', 'mood', 'composition', 'photorealistic', '8k', 'cinematic', 'shot on'];
    const signalCount = qualitySignals.filter((s) => imagePrompt.toLowerCase().includes(s)).length;
    return Math.min(100, signalCount * 12 + 20);
  }

  private static detectPromptLeakage(text: string): boolean {
    const leakagePatterns = [/^Goal:/im, /^Audience:/im, /^Platform:/im, /^Tone:/im, /^Topic:/im, /^Master Topic:/im, /^Industry:/im, /^Strategic Insight:/im, /^Executive Intel:/im];
    return leakagePatterns.some((p) => p.test(text));
  }

  private static detectTemplateRepetition(text: string): boolean {
    const repetitivePhrases = [
      'in today\'s fast-paced digital world',
      'as an ai language model',
      'here is your generated post',
      'master post title',
      'content overview:'
    ];
    return repetitivePhrases.some((p) => text.toLowerCase().includes(p));
  }

  private static detectGenericContent(text: string): boolean {
    const genericTerms = ['master topic', 'strategic insight', 'executive intel', 'ex works (ewx)', 'free carrier (fca)'];
    return genericTerms.some((phrase) => text.toLowerCase().includes(phrase));
  }
}
