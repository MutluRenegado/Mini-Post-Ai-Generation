import crypto from 'crypto';
import { MasterImagePrompt } from '../types/master-image-prompt.types';
import { PromptFinding, PromptValidationReport, PromptRepairResult } from '../types/prompt-repair.types';

export class PromptRepairEngine {
  public static validatePrompt(prompt: MasterImagePrompt): PromptValidationReport {
    const findings: PromptFinding[] = [];

    if (!prompt.promptText || prompt.promptText.trim().length === 0) {
      findings.push({
        id: 'f_empty_text',
        code: 'PROMPT_TEXT_EMPTY',
        severity: 'blocking',
        message: 'Prompt text cannot be empty.',
        field: 'promptText',
        repairable: true,
      });
    }

    if (!prompt.subject || prompt.subject.trim().length === 0) {
      findings.push({
        id: 'f_empty_subject',
        code: 'PROMPT_SUBJECT_EMPTY',
        severity: 'error',
        message: 'Prompt subject specification is missing.',
        field: 'subject',
        repairable: true,
      });
    }

    if (!prompt.constraints || prompt.constraints.length === 0) {
      findings.push({
        id: 'f_no_constraints',
        code: 'PROMPT_CONSTRAINTS_MISSING',
        severity: 'warning',
        message: 'Negative constraints are missing.',
        field: 'constraints',
        repairable: true,
      });
    }

    if (prompt.promptText.length > 2000) {
      findings.push({
        id: 'f_excessive_length',
        code: 'PROMPT_LENGTH_EXCESSIVE',
        severity: 'warning',
        message: 'Prompt text exceeds 2000 characters and may be truncated by AI providers.',
        field: 'promptText',
        repairable: true,
      });
    }

    const hasBlocking = findings.some((f) => f.severity === 'blocking');
    const hasError = findings.some((f) => f.severity === 'error');
    const valid = !hasBlocking && !hasError;
    const score = valid ? Math.max(70, 100 - findings.length * 10) : 40;

    return {
      promptId: prompt.id,
      valid,
      score,
      findings,
      auditedAt: new Date().toISOString(),
    };
  }

  public static repairPrompt(prompt: MasterImagePrompt): PromptRepairResult {
    const reportBefore = this.validatePrompt(prompt);
    const appliedRepairs: string[] = [];
    let repaired = false;

    let repairedText = prompt.promptText;
    let repairedSubject = prompt.subject;
    let repairedConstraints = [...prompt.constraints];

    for (const finding of reportBefore.findings) {
      if (finding.code === 'PROMPT_TEXT_EMPTY') {
        repairedText = '8k resolution photographic masterpiece of modern business innovation in a sleek studio environment.';
        appliedRepairs.push('Populated empty promptText with fallback photographic prompt.');
        repaired = true;
      }
      if (finding.code === 'PROMPT_SUBJECT_EMPTY') {
        repairedSubject = 'Modern business innovation and visual narrative';
        appliedRepairs.push('Set default subject for empty subject field.');
        repaired = true;
      }
      if (finding.code === 'PROMPT_CONSTRAINTS_MISSING') {
        repairedConstraints = ['no watermarks', 'no blurry artifacts', 'no malformed hands'];
        appliedRepairs.push('Added default negative constraints.');
        repaired = true;
      }
      if (finding.code === 'PROMPT_LENGTH_EXCESSIVE') {
        repairedText = repairedText.slice(0, 1800) + '...';
        appliedRepairs.push('Truncated excessive prompt length to 1800 characters.');
        repaired = true;
      }
    }

    let repairedPrompt: MasterImagePrompt = { ...prompt };

    if (repaired) {
      const fingerprint = crypto.createHash('sha256').update(repairedText).digest('hex');
      repairedPrompt = {
        ...prompt,
        promptText: repairedText,
        subject: repairedSubject,
        constraints: repairedConstraints,
        version: prompt.version + 1,
        fingerprint,
        providerReady: true,
      };
    }

    const reportAfter = this.validatePrompt(repairedPrompt);

    return {
      repaired,
      originalPrompt: prompt,
      repairedPrompt,
      appliedRepairs,
      findingsBefore: reportBefore.findings,
      findingsAfter: reportAfter.findings,
    };
  }
}
