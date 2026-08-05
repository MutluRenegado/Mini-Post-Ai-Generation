export interface ValidationContext {
  workflow: string;
  platform?: string;
  inputPrompt?: string;
  generatedContent?: string;
  mediaUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface ValidationIssue {
  standardId: string;
  ruleName: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  remediation?: string;
}

export interface StandardsValidationResult {
  passed: boolean;
  score: number;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'NOT_EVALUATED' | 'HUMAN_REVIEW_REQUIRED';
  issues: ValidationIssue[];
  warnings: ValidationIssue[];
  retryRequired: boolean;
  humanReviewRequired: boolean;
  publishingBlocked: boolean;
  evaluatedAt: string;
}

export class UnifiedStandardsValidator {
  public validate(context: ValidationContext): StandardsValidationResult {
    const issues: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    if (!context.generatedContent && !context.inputPrompt) {
      issues.push({
        standardId: 'text-quality-acceptance',
        ruleName: 'Content Presence Check',
        severity: 'ERROR',
        message: 'No prompt or content provided for validation.',
        remediation: 'Provide valid prompt or generated copy before running quality gate.',
      });
    }

    const passed = issues.length === 0;

    return {
      passed,
      score: passed ? 100 : 50,
      status: passed ? 'PASS' : 'FAIL',
      issues,
      warnings,
      retryRequired: !passed,
      humanReviewRequired: true,
      publishingBlocked: !passed,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

export const unifiedStandardsValidator = new UnifiedStandardsValidator();
