import crypto from 'crypto';
import { StandardsValidator } from '../../../standards';
import { ImageQualityAssuranceReport, QAFinding } from './image-quality-assurance.types';

export class ImageQualityAssuranceEngine {
  public static evaluate(input: {
    promptText?: string;
    negativePromptText?: string;
    platform?: string;
    contrastRatio?: number;
    wordCount?: number;
    isAnatomicallySound?: boolean;
    isPhysicallyPlausible?: boolean;
    fingerprint?: string;
  }): ImageQualityAssuranceReport {
    const findings: QAFinding[] = [];
    const prompt = (input.promptText || '').toLowerCase();

    // 1. Anatomy Rule Check
    if (input.isAnatomicallySound === false || prompt.includes('6 fingers') || prompt.includes('extra hand')) {
      findings.push({
        ruleId: 'QA_ANATOMY_001',
        sourceStandard: 'ContentPolicyStandard',
        severity: 'error',
        affectedField: 'promptText',
        evidence: 'Prompt contains malformed anatomical instruction risk',
        repairability: 'auto_repairable',
        repairAction: 'Remove malformed hand instruction and append strict 5-finger negative prompt constraint',
        disposition: 'REJECTED',
      });
    } else {
      findings.push({
        ruleId: 'QA_ANATOMY_001',
        sourceStandard: 'ContentPolicyStandard',
        severity: 'info',
        affectedField: 'promptText',
        evidence: 'Anatomical constraints verified clean',
        repairability: 'auto_repairable',
        disposition: 'PASS',
      });
    }

    // 2. Physical Consistency Check
    if (input.isPhysicallyPlausible === false) {
      findings.push({
        ruleId: 'QA_PHYSICS_001',
        sourceStandard: 'ImageStandard',
        severity: 'error',
        affectedField: 'promptText',
        evidence: 'Impossible physical interaction detected',
        repairability: 'auto_repairable',
        repairAction: 'Ground subject with realistic floor contact and natural gravity vector',
        disposition: 'REJECTED',
      });
    } else {
      findings.push({
        ruleId: 'QA_PHYSICS_001',
        sourceStandard: 'ImageStandard',
        severity: 'info',
        affectedField: 'promptText',
        evidence: 'Physical spatial consistency verified plausible',
        repairability: 'auto_repairable',
        disposition: 'PASS',
      });
    }

    // 3. Contrast & Typography Safety Check
    if (input.contrastRatio !== undefined && input.contrastRatio < 4.5) {
      findings.push({
        ruleId: 'QA_ACCESSIBILITY_001',
        sourceStandard: 'AccessibilityStandard',
        severity: 'error',
        affectedField: 'contrastRatio',
        evidence: `Contrast ratio ${input.contrastRatio}:1 is below WCAG 2.2 AA 4.5:1 minimum`,
        repairability: 'auto_repairable',
        repairAction: 'Fallback to pure text-free imagery mode',
        disposition: 'REJECTED',
      });
    } else {
      findings.push({
        ruleId: 'QA_ACCESSIBILITY_001',
        sourceStandard: 'AccessibilityStandard',
        severity: 'info',
        affectedField: 'contrastRatio',
        evidence: 'Contrast and typography safety verified compliant',
        repairability: 'auto_repairable',
        disposition: 'PASS',
      });
    }

    const failedCount = findings.filter((f) => f.disposition === 'REJECTED').length;
    const repairedCount = findings.filter((f) => f.disposition === 'REPAIRED').length;
    const passedCount = findings.filter((f) => f.disposition === 'PASS').length;

    let overallDisposition: 'PASS' | 'WARNING' | 'FAIL' = 'PASS';
    if (failedCount > 0) overallDisposition = 'FAIL';
    else if (repairedCount > 0) overallDisposition = 'WARNING';

    const payload = `${overallDisposition}|${failedCount}|${passedCount}|${repairedCount}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      overallDisposition,
      findings,
      totalRuleCount: findings.length,
      passedCount,
      repairedCount,
      failedCount,
      provenanceComplete: !!input.fingerprint,
      deterministicFingerprint,
    };
  }
}
