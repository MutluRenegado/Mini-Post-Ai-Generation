export const STANDARD_CATEGORIES = [
  'AI Governance',
  'AI Text Generation',
  'AI Image Generation',
  'AI Video Generation',
  'AI Audio Generation',
  'Multimodal',
  'Quality & Validation',
  'Design System',
  'Templates',
  'Social Platforms',
  'Publishing',
  'Compliance & Accessibility',
] as const;

export type StandardCategoryType = (typeof STANDARD_CATEGORIES)[number];
