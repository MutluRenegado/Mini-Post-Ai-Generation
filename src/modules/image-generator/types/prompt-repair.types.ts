import { MasterImagePrompt } from './master-image-prompt.types';

export type PromptFindingSeverity = 'blocking' | 'error' | 'warning' | 'info';

export interface PromptFinding {
  id: string;
  code: string;
  severity: PromptFindingSeverity;
  message: string;
  field?: string;
  repairable: boolean;
}

export interface PromptValidationReport {
  promptId: string;
  valid: boolean;
  score: number;
  findings: PromptFinding[];
  auditedAt: string;
}

export interface PromptRepairResult {
  repaired: boolean;
  originalPrompt: MasterImagePrompt;
  repairedPrompt: MasterImagePrompt;
  appliedRepairs: string[];
  findingsBefore: PromptFinding[];
  findingsAfter: PromptFinding[];
}
