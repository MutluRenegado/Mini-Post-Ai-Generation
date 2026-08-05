/**
 * Mini Post App - Content Policy Standard
 * Informed by NIST AI RMF (Safety & Harm Reduction) & OWASP ASVS V5 (Input Validation).
 */

export interface ContentPolicyStandardSpec {
  prohibitedCategories: string[];
  aiSafetyFilterLevel: string;
  frameworkAlignment: {
    nistAiRmf: {
      harmReduction: string;
    };
    owaspAsvs: {
      inputValidation: string;
    };
  };
}

export const ContentPolicyStandard: ContentPolicyStandardSpec = {
  prohibitedCategories: [
    'Hate Speech & Harassment',
    'Explicit Adult & Nudity',
    'Deceptive Misinformation & Spam',
    'Copyright & Trademark Infringement',
    'Unlawful Product Promotion',
  ],
  aiSafetyFilterLevel: 'BLOCK_MEDIUM_AND_ABOVE',
  frameworkAlignment: {
    nistAiRmf: {
      harmReduction: 'Automated safety filters prevent generation of harmful, toxic, or abusive content',
    },
    owaspAsvs: {
      inputValidation: 'Sanitizes and validates all prompt input content against injection patterns',
    },
  },
};
