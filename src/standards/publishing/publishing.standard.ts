/**
 * Mini Post App - Publishing Engine Standard
 * Aligned with OWASP ASVS V8 (Data Protection) & ISO/IEC 25010 (Compatibility).
 */

export interface PublishingStandardSpec {
  supportedPlatforms: string[];
  maxPayloadSizeBytes: number;
  frameworkAlignment: {
    owaspAsvs: {
      tenantIsolation: string;
    };
    iso25010: {
      interoperability: string;
    };
  };
}

export const PublishingStandard: PublishingStandardSpec = {
  supportedPlatforms: [
    'facebook',
    'instagram',
    'linkedin',
    'x',
    'threads',
    'pinterest',
    'youtube',
    'tiktok',
    'google-business',
  ],
  maxPayloadSizeBytes: 10485760, // 10MB
  frameworkAlignment: {
    owaspAsvs: {
      tenantIsolation: 'Encrypted OAuth token dispatch enforcing multi-tenant workspace isolation',
    },
    iso25010: {
      interoperability: 'Standardized payload transformers for 9 target social REST & Graph APIs',
    },
  },
};
