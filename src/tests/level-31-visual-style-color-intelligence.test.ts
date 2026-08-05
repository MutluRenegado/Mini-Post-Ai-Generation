import assert from 'assert';
import { test, describe } from 'node:test';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualStyleColorEngine, EditorialStyleResolver, ColorPsychologyResolver, BrandPaletteAligner, AccessibilityContrastChecker, StyleValidationEngine } from '../lib/ai-image-generator/images/VisualStyleColorEngine';

describe('Level 31: Visual Style and Color Intelligence Test Suite (25 Assertions)', () => {
  const singleDomainText = 'Full-stack software engineers collaborating on cloud software architecture at multi-monitor code setups in a tech hub.';
  const mixedDomainText = 'Encrypted Healthcare AI Networks: Clinical radiology specialists reviewing AI diagnostic scans while cloud security engineers monitor zero-trust HIPAA compliance access controls and encrypted telemetry in a modern medical security hub.';

  test('1. Valid single-domain style and color resolution succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan !== undefined, true);
    assert.strictEqual(plan.styleType, 'high_tech_modern');
    assert.strictEqual(plan.renderingMedium, 'real_world_photography');
  });

  test('2. Valid healthcare domain style resolution succeeds', () => {
    const text = 'Clinical radiology specialists reviewing AI diagnostic imaging scans in a hospital imaging suite';
    const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan.styleType, 'editorial_photo');
    assert.strictEqual(typeof plan.palette.primary, 'string');
  });

  test('3. Valid cybersecurity domain style resolution succeeds', () => {
    const text = 'Cloud security engineers monitoring zero-trust threat alerts in a security operations center';
    const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan.styleType, 'high_tech_modern');
    assert.strictEqual(plan.colorPsychology.accentHue.includes('Green'), true);
  });

  test('4. Valid renewable-energy domain style resolution succeeds', () => {
    const text = 'Photovoltaic Solar Farms: Technicians Inspecting Solar Panel Arrays outdoors on solar farm site';
    const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan.styleType, 'industrial_documentary');
  });

  test('5. Valid manufacturing domain style resolution succeeds', () => {
    const text = 'Industrial Automation Engineers Programming Robotic Assembly Arms on Clean Factory Plant Floor';
    const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan.styleType, 'industrial_documentary');
  });

  test('6. Valid mixed-domain style resolution handles Healthcare AI + Cloud Security', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan.isMixedDomain, true);
    assert.strictEqual(typeof plan.fingerprint, 'string');
  });

  test('7. Brand palette alignment incorporates brand directions', () => {
    const brand = { personality: 'Sleek Neon Tech', palette: ['#00F0FF', '#0F172A', '#38BDF8'], visualRestrictions: [] };
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn', brandContext: brand });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan.brandAlignment.alignmentScore >= 90, true);
  });

  test('8. Color psychology assigns appropriate dominant and accent hues', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(typeof plan.colorPsychology.dominantHue, 'string');
    assert.strictEqual(typeof plan.colorPsychology.accentHue, 'string');
  });

  test('9. Accessibility contrast report verifies WCAG 2.1 compliance (> 4.5:1 ratio)', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan.accessibility.meetsWCAG21AA, true);
    assert.strictEqual(plan.accessibility.textVsBackgroundRatio >= 4.5, true);
  });

  test('10. Poor accessibility contrast triggers POOR_ACCESSIBILITY_CONTRAST defect', () => {
    const defectivePlan = {
      accessibility: { textVsBackgroundRatio: 2.1, meetsWCAG21AA: false },
      inferredEvidenceRatio: 0.1,
    } as any;
    const defects = StyleValidationEngine.validate(defectivePlan);
    assert.strictEqual(defects.some((d) => d.code === 'POOR_ACCESSIBILITY_CONTRAST' && d.severity === 'critical'), true);
  });

  test('11. Direct versus inferred evidence ratio tracking', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan.directEvidenceRatio >= 0, true);
    assert.strictEqual(plan.inferredEvidenceRatio >= 0, true);
  });

  test('12. Excessive inferred style ratio triggers warning defect', () => {
    const defectivePlan = {
      accessibility: { textVsBackgroundRatio: 7.0, meetsWCAG21AA: true },
      inferredEvidenceRatio: 0.5,
    } as any;
    const defects = StyleValidationEngine.validate(defectivePlan);
    assert.strictEqual(defects.some((d) => d.code === 'EXCESSIVE_INFERRED_STYLE' && d.severity === 'warning'), true);
  });

  test('13. Palette completeness contains all 5 mandatory color roles', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(typeof plan.palette.primary, 'string');
    assert.strictEqual(typeof plan.palette.secondary, 'string');
    assert.strictEqual(typeof plan.palette.accent, 'string');
    assert.strictEqual(typeof plan.palette.neutral, 'string');
    assert.strictEqual(typeof plan.palette.background, 'string');
  });

  test('14. Surface finish & lighting mood descriptions are assigned', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(typeof plan.styleProfile.surfaceFinish, 'string');
    assert.strictEqual(typeof plan.styleProfile.lightingMood, 'string');
  });

  test('15. Deterministic serialization verifies JSON and human-readable text output', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    const json = VisualStyleColorEngine.planStyle(brief, brief.sceneGraph!, brief.spatialLayout!, brief.occupationInteractionPlan!, brief.environmentAuthenticityPlan!).serializedJson;
    assert.strictEqual(typeof json, 'string');
    assert.strictEqual(json.includes(plan.id), true);
  });

  test('16. Deterministic SHA-256 fingerprint generation format (64 hex characters)', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const fp = brief.visualStyleColorPlan!.fingerprint;
    assert.strictEqual(fp.length, 64);
  });

  test('17. Deterministic output across repeated invocations', () => {
    const brief1 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const brief2 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief1.visualStyleColorPlan!.fingerprint, brief2.visualStyleColorPlan!.fingerprint);
  });

  test('18. Backward-compatible brief parsing with optional visualStyleColorPlan', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.environmentAuthenticityPlan !== undefined, true);
    assert.strictEqual(brief.visualStyleColorPlan !== undefined, true);
  });

  test('19. Empty or minimal article rejection throws expected error', () => {
    assert.throws(() => FinalPostAnalyzer.analyze({ postContent: '', platform: 'LinkedIn' }), /FINALIZED_POST_REQUIRED/);
  });

  test('20. Valid but imperfect style plan receives normalized score (90/100)', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const res = VisualStyleColorEngine.planStyle(brief, brief.sceneGraph!, brief.spatialLayout!, brief.occupationInteractionPlan!, brief.environmentAuthenticityPlan!);
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.validationScore, 90);
  });

  test('21. Complete valid style plan construction succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const res = VisualStyleColorEngine.planStyle(brief, brief.sceneGraph!, brief.spatialLayout!, brief.occupationInteractionPlan!, brief.environmentAuthenticityPlan!);
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(typeof res.serializedJson, 'string');
    assert.strictEqual(typeof res.humanReadableSummary, 'string');
  });

  test('22. Education domain style resolution assigns academic_scholarly style', () => {
    const text = 'STEM University Professors interacting with digital whiteboards and collaborative educational tablets in university learning lab';
    const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan.styleType, 'academic_scholarly');
  });

  test('23. Trade domain style resolution assigns documentary_corporate style', () => {
    const text = 'Export Logistics Managers verifying letters of credit and cargo shipping manifests at international port trade finance office';
    const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan.styleType, 'documentary_corporate');
  });

  test('24. Color harmony classification assigns valid harmony type', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(typeof plan.colorPsychology.colorHarmony, 'string');
  });

  test('25. Level 30 environment plan reference is preserved in visualStyleColorPlan', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.visualStyleColorPlan!;
    assert.strictEqual(plan.environmentPlanId, brief.environmentAuthenticityPlan!.id);
  });
});
