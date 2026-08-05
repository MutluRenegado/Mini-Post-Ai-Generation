export type QAValidationSeverity = 'info' | 'warning' | 'error';
export type QARepairability = 'auto_repairable' | 'requires_regeneration' | 'fatal';

export interface QAFinding {
  ruleId: string;
  sourceStandard: string;
  severity: QAValidationSeverity;
  affectedField: string;
  evidence: string;
  repairability: QARepairability;
  repairAction?: string;
  disposition: 'PASS' | 'REPAIRED' | 'REJECTED';
}

export interface ImageQualityAssuranceReport {
  overallDisposition: 'PASS' | 'WARNING' | 'FAIL';
  findings: QAFinding[];
  totalRuleCount: number;
  passedCount: number;
  repairedCount: number;
  failedCount: number;
  provenanceComplete: boolean;
  deterministicFingerprint: string;
}
