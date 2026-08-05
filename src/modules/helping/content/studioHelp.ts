import { HelpItem } from '../types/explain-item.types';

export const STUDIO_HELP_ITEMS: HelpItem[] = [
  {
    id: 'studio-prompt-input',
    title: 'Creator Studio Prompt Input',
    shortDescription: 'Enter the core topic, message, or prompt for AI text and visual post generation.',
    purpose: 'Provides the context needed by Google Gemini AI to draft platform-optimized copy.',
    instructions: [
      'Type your desired topic or key takeaways.',
      'Specify target audience or tone if needed.',
      'Click Generate Fast Post or Generate AI Text.',
    ],
    expectedResult: 'Produces customized post copy and visual prompts tailored for social networks.',
    commonMistakes: ['Entering overly brief prompts without key details or context.'],
    limitations: ['Generates raw copy that must be reviewed for brand alignment.'],
    category: 'STUDIO',
    route: '/studio',
    placement: 'BELOW',
    version: 'v1.0.0',
    reviewed: true,
  },
  {
    id: 'studio-platform-selector',
    title: 'Social Platform Selector',
    shortDescription: 'Select target social channels (Facebook, Instagram, LinkedIn, X, TikTok, YouTube, Pinterest).',
    purpose: 'Applies platform-specific character limits, image sizing, and hashtag rules.',
    instructions: ['Toggle platform checkboxes to enable or disable channel output.'],
    expectedResult: 'Adapts post format to conform to platform specifications.',
    category: 'STUDIO',
    route: '/studio',
    placement: 'BELOW',
    version: 'v1.0.0',
    reviewed: true,
  },
];
