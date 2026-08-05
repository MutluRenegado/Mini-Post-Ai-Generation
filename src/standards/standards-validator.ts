/**
 * Mini Post App - Comprehensive Standards Runtime Validator
 * Enforces runtime evaluation across all 27 international standards in StudioOS.
 */

import {
  AIWritingStandard,
  AccessibilityStandard,
  ColorStandard,
  ContentPolicyStandard,
  FacebookPostStandard,
  GoogleBusinessPostStandard,
  HashtagStandard,
  ImageStandard,
  InstagramPostStandard,
  LayoutStandard,
  LinkedInPostStandard,
  PinterestPostStandard,
  PromptStandard,
  PublishingStandard,
  ReelsStandard,
  SEOStandard,
  SchedulingStandard,
  ShortsStandard,
  SizingStandard,
  ThreadsPostStandard,
  TikTokPostStandard,
  TypographyStandard,
  UIStandard,
  VideoProductionStandard,
  XPostStandard,
  YouTubePostStandard,
  YouTubeVideoStandard,
} from './index';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

export class StandardsValidator {
  /**
   * 1. Validate AI Writing Rules (Prohibited Words)
   */
  public static validateAIWriting(text: string): ValidationResult {
    const lowerText = text.toLowerCase();
    for (const phrase of AIWritingStandard.prohibitedWords) {
      const regex = new RegExp(`\\b${phrase.toLowerCase()}\\b`, 'i');
      if (regex.test(lowerText)) {
        return {
          valid: false,
          error: `AI Writing violation: Prohibited cliché phrase "${phrase}" detected.`,
          code: 'PROHIBITED_AI_PHRASE',
        };
      }
    }
    return { valid: true };
  }

  /**
   * 2. Validate Prompt Rules
   */
  public static validatePromptInput(promptText: string): ValidationResult {
    if (promptText.length > PromptStandard.maxPromptLength) {
      return {
        valid: false,
        error: `Prompt length ${promptText.length} exceeds maximum limit ${PromptStandard.maxPromptLength}`,
        code: 'PROMPT_TOO_LONG',
      };
    }
    return { valid: true };
  }

  /**
   * 3. Validate Platform Post Character & Formatting Limits across all 9 Platforms
   */
  public static validatePostLength(platform: string, text: string): ValidationResult {
    const length = text.length;

    switch (platform.toLowerCase()) {
      case 'x':
      case 'twitter':
        if (length > XPostStandard.maxCharacterLimit) {
          return {
            valid: false,
            error: `X Post character limit exceeded: ${length} > ${XPostStandard.maxCharacterLimit}`,
            code: 'X_CHAR_LIMIT_EXCEEDED',
          };
        }
        break;
      case 'facebook':
        if (length > FacebookPostStandard.maxCharacterLimit) {
          return {
            valid: false,
            error: `Facebook character limit exceeded: ${length} > ${FacebookPostStandard.maxCharacterLimit}`,
            code: 'FB_CHAR_LIMIT_EXCEEDED',
          };
        }
        break;
      case 'instagram':
        if (length > InstagramPostStandard.maxCharacterLimit) {
          return {
            valid: false,
            error: `Instagram character limit exceeded: ${length} > ${InstagramPostStandard.maxCharacterLimit}`,
            code: 'IG_CHAR_LIMIT_EXCEEDED',
          };
        }
        break;
      case 'linkedin':
        if (length > LinkedInPostStandard.maxCharacterLimit) {
          return {
            valid: false,
            error: `LinkedIn character limit exceeded: ${length} > ${LinkedInPostStandard.maxCharacterLimit}`,
            code: 'LINKEDIN_CHAR_LIMIT_EXCEEDED',
          };
        }
        break;
      case 'threads':
        if (length > ThreadsPostStandard.maxCharacterLimit) {
          return {
            valid: false,
            error: `Threads character limit exceeded: ${length} > ${ThreadsPostStandard.maxCharacterLimit}`,
            code: 'THREADS_CHAR_LIMIT_EXCEEDED',
          };
        }
        break;
      case 'pinterest':
        if (length > PinterestPostStandard.maxDescriptionLimit) {
          return {
            valid: false,
            error: `Pinterest description limit exceeded: ${length} > ${PinterestPostStandard.maxDescriptionLimit}`,
            code: 'PINTEREST_CHAR_LIMIT_EXCEEDED',
          };
        }
        break;
      case 'tiktok':
        if (length > TikTokPostStandard.maxCaptionLimit) {
          return {
            valid: false,
            error: `TikTok caption limit exceeded: ${length} > ${TikTokPostStandard.maxCaptionLimit}`,
            code: 'TIKTOK_CHAR_LIMIT_EXCEEDED',
          };
        }
        break;
      case 'google-business':
        if (length > GoogleBusinessPostStandard.maxCharacterLimit) {
          return {
            valid: false,
            error: `Google Business character limit exceeded: ${length} > ${GoogleBusinessPostStandard.maxCharacterLimit}`,
            code: 'GGB_CHAR_LIMIT_EXCEEDED',
          };
        }
        break;
      case 'youtube-community':
        if (length > YouTubePostStandard.maxCharacterLimit) {
          return {
            valid: false,
            error: `YouTube Community post limit exceeded: ${length} > ${YouTubePostStandard.maxCharacterLimit}`,
            code: 'YOUTUBE_CHAR_LIMIT_EXCEEDED',
          };
        }
        break;
      default:
        break;
    }

    return { valid: true };
  }

  /**
   * 4. Validate Image Semantic Score
   */
  public static validateImageSemanticScore(score: number): ValidationResult {
    if (score < ImageStandard.minimumOverallSemanticScore) {
      return {
        valid: false,
        error: `Overall semantic score ${score}% is below required ${ImageStandard.minimumOverallSemanticScore}% threshold.`,
        code: 'IMAGE_SEMANTIC_SCORE_BELOW_THRESHOLD',
      };
    }
    return { valid: true };
  }

  /**
   * 5. Validate Aspect Ratio
   */
  public static validateAspectRatio(ratio: string): ValidationResult {
    const validRatios = Object.values(SizingStandard).map((s) => s.ratio);
    if (!validRatios.includes(ratio)) {
      return {
        valid: false,
        error: `Invalid aspect ratio "${ratio}". Supported ratios: ${validRatios.join(', ')}`,
        code: 'INVALID_ASPECT_RATIO',
      };
    }
    return { valid: true };
  }

  /**
   * 6. Validate Video Specifications (Shorts, Reels, YouTube Long-Form, Audio LUFS)
   */
  public static validateVideoSpecs(
    format: 'shorts' | 'reels' | 'youtube' | 'production',
    durationSeconds: number,
    aspectRatio: string,
    lufs?: number
  ): ValidationResult {
    if (format === 'shorts') {
      if (durationSeconds > ShortsStandard.maxDurationSeconds) {
        return {
          valid: false,
          error: `Shorts duration ${durationSeconds}s exceeds maximum limit ${ShortsStandard.maxDurationSeconds}s`,
          code: 'SHORTS_DURATION_EXCEEDED',
        };
      }
      if (aspectRatio !== ShortsStandard.aspectRatio) {
        return {
          valid: false,
          error: `Shorts aspect ratio "${aspectRatio}" must be ${ShortsStandard.aspectRatio}`,
          code: 'INVALID_SHORTS_ASPECT_RATIO',
        };
      }
    } else if (format === 'reels') {
      if (durationSeconds > ReelsStandard.maxDurationSeconds) {
        return {
          valid: false,
          error: `Reels duration ${durationSeconds}s exceeds maximum limit ${ReelsStandard.maxDurationSeconds}s`,
          code: 'REELS_DURATION_EXCEEDED',
        };
      }
      if (aspectRatio !== ReelsStandard.aspectRatio) {
        return {
          valid: false,
          error: `Reels aspect ratio "${aspectRatio}" must be ${ReelsStandard.aspectRatio}`,
          code: 'INVALID_REELS_ASPECT_RATIO',
        };
      }
    } else if (format === 'youtube') {
      if (aspectRatio !== YouTubeVideoStandard.aspectRatio) {
        return {
          valid: false,
          error: `YouTube Long-Form aspect ratio "${aspectRatio}" must be ${YouTubeVideoStandard.aspectRatio}`,
          code: 'INVALID_YOUTUBE_ASPECT_RATIO',
        };
      }
    }

    if (lufs !== undefined && lufs < VideoProductionStandard.targetLufs - 3) {
      return {
        valid: false,
        error: `Audio loudness ${lufs} LUFS fails target loudness ${VideoProductionStandard.targetLufs} LUFS`,
        code: 'AUDIO_LUFS_MISMATCH',
      };
    }

    return { valid: true };
  }

  /**
   * 7. Validate SEO Title & Description Limits
   */
  public static validateSEO(title: string, description: string): ValidationResult {
    if (title.length > SEOStandard.maxTitleLength) {
      return {
        valid: false,
        error: `SEO title length ${title.length} exceeds maximum ${SEOStandard.maxTitleLength}`,
        code: 'SEO_TITLE_TOO_LONG',
      };
    }
    if (description.length > SEOStandard.maxMetaDescriptionLength) {
      return {
        valid: false,
        error: `SEO description length ${description.length} exceeds maximum ${SEOStandard.maxMetaDescriptionLength}`,
        code: 'SEO_DESCRIPTION_TOO_LONG',
      };
    }
    return { valid: true };
  }

  /**
   * 8. Validate Content Safety Policy
   */
  public static validateContentPolicy(text: string): ValidationResult {
    const lowerText = text.toLowerCase();
    const bannedPatterns = ['hate speech', 'explicit adult', 'fake news', 'unlawful content'];
    for (const pattern of bannedPatterns) {
      if (lowerText.includes(pattern)) {
        return {
          valid: false,
          error: `Content policy violation: Prohibited category "${pattern}" detected.`,
          code: 'CONTENT_POLICY_VIOLATION',
        };
      }
    }
    return { valid: true };
  }

  /**
   * 9. Validate Hashtag Anti-Spam Rules
   */
  public static validateHashtags(tags: string[]): ValidationResult {
    for (const tag of tags) {
      const cleanTag = tag.replace(/^#/, '').toLowerCase();
      if (HashtagStandard.prohibitedHashtags.includes(cleanTag)) {
        return {
          valid: false,
          error: `Prohibited anti-spam hashtag detected: "#${cleanTag}"`,
          code: 'PROHIBITED_HASHTAG',
        };
      }
      if (cleanTag.length > HashtagStandard.maxHashtagLength) {
        return {
          valid: false,
          error: `Hashtag length ${cleanTag.length} exceeds limit ${HashtagStandard.maxHashtagLength}`,
          code: 'HASHTAG_TOO_LONG',
        };
      }
    }
    return { valid: true };
  }

  /**
   * 10. Validate Scheduling Advance Time
   */
  public static validateScheduling(minutesInAdvance: number): ValidationResult {
    if (minutesInAdvance < SchedulingStandard.minAdvanceScheduleMinutes) {
      return {
        valid: false,
        error: `Schedule time ${minutesInAdvance} minutes in advance is less than required minimum ${SchedulingStandard.minAdvanceScheduleMinutes} minutes`,
        code: 'SCHEDULE_TOO_SOON',
      };
    }
    const maxMinutes = SchedulingStandard.maxAdvanceScheduleDays * 24 * 60;
    if (minutesInAdvance > maxMinutes) {
      return {
        valid: false,
        error: `Schedule time exceeds maximum allowed ${SchedulingStandard.maxAdvanceScheduleDays} days`,
        code: 'SCHEDULE_TOO_FAR',
      };
    }
    return { valid: true };
  }

  /**
   * 11. Validate Publishing Payload Size
   */
  public static validatePublishingPayload(sizeBytes: number): ValidationResult {
    if (sizeBytes > PublishingStandard.maxPayloadSizeBytes) {
      return {
        valid: false,
        error: `Publishing payload size ${sizeBytes} bytes exceeds maximum limit ${PublishingStandard.maxPayloadSizeBytes} bytes (10MB)`,
        code: 'PAYLOAD_TOO_LARGE',
      };
    }
    return { valid: true };
  }

  /**
   * 12. Validate Accessibility Text Contrast Ratio
   */
  public static validateAccessibilityContrast(contrastRatio: number, isLargeText = false): ValidationResult {
    const required = isLargeText
      ? AccessibilityStandard.minContrastRatioLargeText
      : AccessibilityStandard.minContrastRatioText;
    if (contrastRatio < required) {
      return {
        valid: false,
        error: `Contrast ratio ${contrastRatio}:1 fails WCAG 2.2 AA requirement (${required}:1 minimum)`,
        code: 'WCAG_CONTRAST_FAIL',
      };
    }
    return { valid: true };
  }

  /**
   * 13. Validate Safe Zone / Margin
   */
  public static validateLayoutSafeZone(paddingPx: number): ValidationResult {
    if (paddingPx < LayoutStandard.safeMarginPx) {
      return {
        valid: false,
        error: `Layout padding ${paddingPx}px is below required safe zone margin ${LayoutStandard.safeMarginPx}px`,
        code: 'SAFE_ZONE_VIOLATION',
      };
    }
    return { valid: true };
  }
}
