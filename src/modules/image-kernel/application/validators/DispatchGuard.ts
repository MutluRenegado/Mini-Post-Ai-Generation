export interface ImageGenerationRuleContext {
  readonly rulesVersion: string;
  readonly rulesIntegrityHash: string;
  readonly positiveRulesApplied: boolean;
  readonly domainRulesApplied: boolean;
  readonly platformRulesApplied: boolean;
  readonly forbiddenRulesApplied: boolean;
  readonly validationCompleted: boolean;
}

export function assertImageRulesApplied(context: ImageGenerationRuleContext): void {
  const valid = context.positiveRulesApplied && context.domainRulesApplied && context.platformRulesApplied && context.forbiddenRulesApplied && context.validationCompleted && context.rulesVersion.length > 0 && context.rulesIntegrityHash.length > 0;
  if (!valid) throw new Error('IMAGE_DISPATCH_BLOCKED_RULES_NOT_APPLIED');
}
