/**
 * Mini Post App - Unified Standards System Master Index
 * Centralized runtime registry & exports for AI, Post, Video, Template, Branding, Publishing, Compliance, Governance, and Validation.
 */

import { standardsRegistry } from './core/standard-registry';
import { AI_GOVERNANCE_STANDARD } from './governance/ai-governance.standard';

// Register core governance standards
standardsRegistry.register(AI_GOVERNANCE_STANDARD);

export * from './core/standard-definition';
export * from './core/standard-registry';
export * from './core/standard-categories';
export * from './governance/adopted-standards.registry';
export * from './governance/ai-governance.standard';
export * from './adapters/public-standards.adapter';
export * from './adapters/studioos.adapter';
export * from './validation/StandardsValidator';

// Legacy compat exports
export * from './ai/ai-writing.standard';
export * from './ai/prompt.standard';
export * from './ai/image.standard';
export * from './ai/quality.standard';
export * from './posts/facebook.standard';
export * from './posts/instagram.standard';
export * from './posts/linkedin.standard';
export * from './posts/x.standard';
export * from './posts/threads.standard';
export * from './posts/pinterest.standard';
export * from './posts/youtube.standard';
export * from './posts/tiktok.standard';
export * from './posts/google-business.standard';
export * from './video/shorts.standard';
export * from './video/reels.standard';
export * from './video/youtube.standard';
export * from './video/video-production.standard';
export * from './templates/template.standard';
export * from './templates/sizing.standard';
export * from './templates/layout.standard';
export * from './branding/typography.standard';
export * from './branding/color.standard';
export * from './branding/hierarchy.standard';
export * from './branding/spacing.standard';
export * from './branding/ui.standard';
export * from './publishing/seo.standard';
export * from './publishing/hashtag.standard';
export * from './publishing/scheduling.standard';
export * from './publishing/publishing.standard';
export * from './compliance/accessibility.standard';
export * from './compliance/content-policy.standard';
export * from './compliance/platform-rules.standard';
export * from './standards-validator';
