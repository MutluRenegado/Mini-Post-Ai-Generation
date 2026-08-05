/**
 * Mini Post App - Quality Standard
 * Aligned with ISO/IEC 25010:2023 (Software Quality Model) and NIST AI RMF.
 */

export interface QualityFrameworkAlignment {
  iso25010: {
    functionalSuitability: string;
    performanceEfficiency: string;
    compatibility: string;
    usability: string;
    reliability: string;
    security: string;
    maintainability: string;
    flexibility: string;
  };
  nistAiRmf: {
    validAndReliable: string;
    safe: string;
    secureAndResilient: string;
    accountableAndTransparent: string;
  };
}

export interface QualityStandardSpec {
  minQualityScore: number;
  grammarCheckRequired: boolean;
  brandComplianceCheckRequired: boolean;
  factCheckingRequired: boolean;
  maxAllowedViolations: number;
  frameworkAlignment: QualityFrameworkAlignment;
}

export const QualityStandard: QualityStandardSpec = {
  minQualityScore: 95,
  grammarCheckRequired: true,
  brandComplianceCheckRequired: true,
  factCheckingRequired: true,
  maxAllowedViolations: 0,
  frameworkAlignment: {
    iso25010: {
      functionalSuitability: 'Complete, correct, and appropriate post generation across all platforms',
      performanceEfficiency: 'Sub-second AI response time and optimized asset sizing',
      compatibility: 'Co-existence and interoperability with 9 target social APIs',
      usability: 'Accessible, consistent UI with clear feedback and error handling',
      reliability: '99.9% uptime, fault tolerance, and graceful fallback handling',
      security: 'AES-256 data protection, multi-tenant isolation, and OWASP compliance',
      maintainability: 'Modular architecture, 100% TypeScript typing, and decoupled design',
      flexibility: 'Adaptable multi-platform templates and dynamic aspect ratio sizing',
    },
    nistAiRmf: {
      validAndReliable: 'Strict 95% semantic score validation before provider execution',
      safe: 'Automated safety filters blocking harmful, deceptive, or policy-violating content',
      secureAndResilient: 'Input sanitization and prompt injection defense',
      accountableAndTransparent: 'Clear provenance logs and step-by-step pipeline telemetry',
    },
  },
};
