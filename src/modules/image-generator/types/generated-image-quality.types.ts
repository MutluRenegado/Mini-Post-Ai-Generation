export type QualityFindingSeverity = 'blocking' | 'error' | 'warning' | 'info';

export interface GeneratedImageFinding {
  id: string;
  code: string;
  severity: QualityFindingSeverity;
  message: string;
  category: 'payload' | 'format' | 'dimension' | 'composition' | 'safeArea' | 'semantic';
  repairable: boolean;
}

export interface GeneratedImageQualityResult {
  assetId: string;
  passed: boolean;
  score: number;
  findings: GeneratedImageFinding[];
  auditedAt: string;
  recommendations: string[];
  unavailableChecks: string[];
}

export interface GeneratedImageAuditInput {
  assetId: string;
  imageData: Buffer;
  mimeType: string;
  width: number;
  height: number;
  expectedAspectRatio: string;
  promptText: string;
}
