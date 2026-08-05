export interface PromptRepairAction {
  iteration: number;
  triggerRule: string;
  issueDescription: string;
  beforeSnippet: string;
  afterSnippet: string;
  standardsReference: string;
}

export interface PromptSelfHealingResult {
  repairedPromptText: string;
  repairedNegativePromptText: string;
  iterationCount: number;
  maxAllowedIterations: number;
  actionsApplied: PromptRepairAction[];
  repairSucceeded: boolean;
  unresolvedDefects?: string[];
  deterministicFingerprint: string;
}
