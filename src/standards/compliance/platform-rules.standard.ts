/**
 * Mini Post App - Platform Rules Standard
 * Informed by Developer API Policies (Meta, Google, X, LinkedIn, TikTok, Pinterest).
 */

export interface PlatformRulesStandardSpec {
  apiVersion: string;
  dataRetentionDays: number;
  frameworkAlignment: {
    platformPolicies: {
      developerTerms: string;
    };
  };
}

export const PlatformRulesStandard: PlatformRulesStandardSpec = {
  apiVersion: '2026-v1',
  dataRetentionDays: 90,
  frameworkAlignment: {
    platformPolicies: {
      developerTerms: 'Strict compliance with developer API terms, user token scopes, and data privacy policies',
    },
  },
};
