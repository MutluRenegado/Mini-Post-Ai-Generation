/**
 * Mini Post App - AI Writing Standard
 * Informed by NIST AI RMF (Reliability & Bias Mitigation) and Google Search Essentials (People-First Content).
 */

export interface AIWritingStandardSpec {
  model: string;
  maxOutputTokens: number;
  temperature: number;
  readabilityLevel: string;
  prohibitedWords: string[];
  formattingRules: {
    maxParagraphLength: number;
    bulletStyle: string;
    emojiUsage: string;
    hookRequired: boolean;
    ctaRequired: boolean;
  };
  frameworkAlignment: {
    googleSearchEssentials: {
      peopleFirstContent: string;
      originality: string;
      clarity: string;
    };
    nistAiRmf: {
      biasMitigation: string;
      transparency: string;
    };
  };
}

export const AIWritingStandard: AIWritingStandardSpec = {
  model: 'gemini-1.5-flash',
  maxOutputTokens: 2048,
  temperature: 0.7,
  readabilityLevel: '8th Grade / Conversational Professional',
  prohibitedWords: [
    'delve',
    'testament',
    'tapestry',
    'beacon',
    'game-changer',
    'revolutionary',
    'synergy',
    'paramount',
  ],
  formattingRules: {
    maxParagraphLength: 3, // lines
    bulletStyle: '•',
    emojiUsage: 'Contextual, maximum 3 per post',
    hookRequired: true,
    ctaRequired: true,
  },
  frameworkAlignment: {
    googleSearchEssentials: {
      peopleFirstContent: 'Prioritizes reader value, actionable insights, and human readability',
      originality: 'Avoids generic AI cliches, buzzwords, and repetitive sentence structures',
      clarity: 'Concise paragraph structures with bold key concepts and clear call-to-action',
    },
    nistAiRmf: {
      biasMitigation: 'Inclusive language guidelines preventing stereotyping or offensive phrasing',
      transparency: 'Full traceability of prompt parameters and tone settings',
    },
  },
};
