import crypto from 'crypto';
import { VisualIntelligenceBrief } from '../types/visual-intelligence.types';
import { VisualIntelligenceBriefSchema } from '../schemas/visual-intelligence.schema';

export interface FinalPostAnalysisInput {
  postId?: string;
  postTopic?: string;
  postContent: string;
  platform?: string;
  brandColors?: string[];
}

export class FinalPostAnalyzer {
  /**
   * Sanitizes post text by removing PII (emails, phone numbers), tracking parameters, and raw links.
   */
  public static sanitizePostText(rawText: string): string {
    if (!rawText) return '';

    let clean = rawText
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
      .replace(/(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3,4}[\s-]?\d{4}/g, '')
      .replace(/\b\d{3}[-.\s]\d{4}\b/g, '')
      .replace(/(\?|&)(utm_[a-z]+|fbclid|gclid)=[^&\s]+/gi, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return clean;
  }

  /**
   * Generates a deterministic SHA-256 fingerprint of sanitized content and platform.
   */
  public static generateFingerprint(sanitizedText: string, platform: string): string {
    const input = `${sanitizedText.toLowerCase()}||${platform.toLowerCase()}`;
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Analyzes the full finalized post content and constructs a canonical VisualIntelligenceBrief.
   */
  public static analyze(input: FinalPostAnalysisInput): VisualIntelligenceBrief {
    const { postId, postTopic, postContent, platform = 'LinkedIn', brandColors } = input;

    if (!postContent || postContent.trim().length === 0) {
      throw new Error('FINALIZED_POST_REQUIRED: Post content is required to generate a VisualIntelligenceBrief.');
    }

    const sanitizedText = this.sanitizePostText(postContent || postTopic || 'Modern update');
    if (sanitizedText.length === 0) {
      throw new Error('SANITIZATION_EMPTY_POST: Post content contains no usable text after removing sensitive data.');
    }

    const fingerprint = this.generateFingerprint(sanitizedText, platform);
    const briefId = `vib_${fingerprint.slice(0, 12)}`;

    let aspectRatio = '1:1';
    let safeAreas = { top: 20, right: 20, bottom: 20, left: 20 };

    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('story') || lowerPlatform.includes('reel') || lowerPlatform.includes('tiktok')) {
      aspectRatio = '9:16';
      safeAreas = { top: 80, right: 20, bottom: 120, left: 20 };
    } else if (lowerPlatform.includes('portrait') || lowerPlatform.includes('instagram')) {
      aspectRatio = '4:5';
      safeAreas = { top: 30, right: 20, bottom: 30, left: 20 };
    } else if (lowerPlatform.includes('facebook') || lowerPlatform.includes('linkedin')) {
      aspectRatio = '1.91:1';
      safeAreas = { top: 20, right: 30, bottom: 20, left: 30 };
    } else if (lowerPlatform.includes('x') || lowerPlatform.includes('twitter') || lowerPlatform.includes('youtube')) {
      aspectRatio = '16:9';
      safeAreas = { top: 20, right: 40, bottom: 20, left: 40 };
    } else if (lowerPlatform.includes('pinterest')) {
      aspectRatio = '2:3';
      safeAreas = { top: 40, right: 20, bottom: 40, left: 20 };
    }

    const words = sanitizedText.split(/\s+/);
    const topicSummary = postTopic || words.slice(0, 5).join(' ') || 'Professional Solution';

    const brief: VisualIntelligenceBrief = {
      id: briefId,
      postId,
      platform,
      sanitizedContent: sanitizedText,
      fingerprint,
      primarySubject: `Professional representation of ${topicSummary}`,
      setting: 'Modern studio workspace environment with natural lighting',
      actionOrState: 'Demonstrating innovation and professional excellence',
      visualMeaning: `Visual story illustrating ${topicSummary}`,
      keywords: [topicSummary, 'technology', 'business', 'innovation'],
      brandPalette: brandColors || ['#00F0FF', '#0F172A', '#38BDF8'],
      aspectRatio,
      safeAreas,
      createdAt: new Date().toISOString(),
    };

    VisualIntelligenceBriefSchema.parse(brief);
    return brief;
  }
}
