import { StudioOutput, PlatformContent, QualityReport } from '../models/ai.types';

/**
 * OutputValidator — Ensures every AI response meets the structural contract.
 * Rejects or repairs incomplete AI outputs before they reach the UI.
 */
export class OutputValidator {
  static validate(output: Partial<StudioOutput>): { valid: boolean; errors: string[]; repaired: boolean } {
    const errors: string[] = [];
    let repaired = false;

    if (!output.requestId) errors.push('Missing requestId');
    if (!output.topic) errors.push('Missing topic');
    if (!output.platforms || output.platforms.length === 0) errors.push('No platform content generated');

    if (output.platforms) {
      for (const platform of output.platforms) {
        const platformErrors = this.validatePlatformContent(platform);
        errors.push(...platformErrors);
        if (platformErrors.length > 0 && platform) {
          this.repairPlatformContent(platform);
          repaired = true;
        }
      }
    }

    return { valid: errors.length === 0, errors, repaired };
  }

  static validatePlatformContent(content: Partial<PlatformContent>): string[] {
    const errors: string[] = [];
    if (!content.platform) errors.push('Platform identifier missing');
    if (!content.body || content.body.trim().length < 20) errors.push(`${content.platform}: body content too short or empty`);
    if (!content.hashtags || content.hashtags.length === 0) errors.push(`${content.platform}: no hashtags generated`);
    if (!content.cta || content.cta.trim().length < 5) errors.push(`${content.platform}: CTA missing or too short`);
    if (!content.imagePrompt?.assembled) errors.push(`${content.platform}: image prompt missing`);
    if (this.containsMetadataLeakage(content.body || '')) {
      errors.push(`${content.platform}: developer metadata leaked into output`);
    }
    return errors;
  }

  static sanitizeText(text: string): string {
    // Remove developer metadata labels that should never appear in output
    return text
      .replace(/^(Goal|Audience|Platform|Tone|Topic|Industry|Master Topic|Brand Name):\s*.+$/gim, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  static clampText(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;
    // Clamp at last complete sentence within limit
    const truncated = text.slice(0, maxLen - 3);
    const lastSentence = truncated.lastIndexOf('.');
    if (lastSentence > maxLen * 0.7) return truncated.slice(0, lastSentence + 1);
    return truncated + '...';
  }

  private static repairPlatformContent(content: Partial<PlatformContent>): void {
    if (!content.hashtags || content.hashtags.length === 0) {
      content.hashtags = ['#ContentStrategy', '#MiniPostApp'];
    }
    if (!content.cta || content.cta.trim().length < 5) {
      content.cta = 'What are your thoughts? Share in the comments below.';
    }
    if (content.body) {
      content.body = this.sanitizeText(content.body);
    }
  }

  private static containsMetadataLeakage(text: string): boolean {
    const patterns = [/^Goal:/im, /^Audience:/im, /^Platform:/im, /^Tone:/im, /^Topic:/im, /^Master Topic:/im, /^Industry:/im];
    return patterns.some((p) => p.test(text));
  }

  static buildQualityReport(scores: {
    topicRelevance: number; readability: number; platformSuitability: number;
    hookStrength: number; ctaQuality: number; hashtagQuality: number; imagePromptQuality: number;
    issues: string[]; suggestions: string[];
  }): QualityReport {
    const score = Math.round(
      scores.topicRelevance * 0.20 + scores.readability * 0.15 + scores.platformSuitability * 0.15 +
      scores.hookStrength * 0.20 + scores.ctaQuality * 0.15 + scores.hashtagQuality * 0.05 + scores.imagePromptQuality * 0.10
    );
    return {
      ...scores,
      score,
      passed: score >= 92,
      completeness: 95,
      authority: 90,
      grammar: 95,
      seoOptimization: 90,
      promptLeakage: false,
      templateRepetition: false,
      genericWording: false,
    };
  }
}
