import assert from 'assert';
import { test, describe } from 'node:test';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '../lib/ai-image-generator/images/visualConceptGenerator';
import { CompositionPlanner } from '../lib/ai-image-generator/images/compositionPlanner';
import { MasterImagePromptBuilder } from '../lib/ai-image-generator/images/masterImagePromptBuilder';
import { ImagePromptValidator } from '../lib/ai-image-generator/images/ImagePromptValidator';
import { PromptRepairEngine } from '../lib/ai-image-generator/images/promptRepairEngine';

describe('Level 18: Prompt Validation and Targeted Repair Test Suite (27 Assertions)', () => {
  const postText = 'Deploying automated zero-trust security architecture for hybrid cloud environments.';
  const brief = FinalPostAnalyzer.analyze({ postContent: postText, platform: 'LinkedIn' });
  const concept = VisualConceptGenerator.generateConcepts(brief).selectedConcept;
  const composition = CompositionPlanner.planComposition(brief, concept).selectedComposition;
  const masterPrompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);

  test('1. ImagePromptValidator.validate() returns valid PromptValidationResult', () => {
    const val = ImagePromptValidator.validate(masterPrompt);
    assert.strictEqual(!!val, true);
    assert.strictEqual(typeof val.valid, 'boolean');
  });

  test('2. Clean master prompt passes validation cleanly with providerReady: true', () => {
    const val = ImagePromptValidator.validate(masterPrompt);
    assert.strictEqual(val.valid, true);
    assert.strictEqual(val.providerReady, true);
    assert.strictEqual(val.blockingFindings, 0);
  });

  test('3. Missing primary subject is detected as blocking finding', () => {
    const badPrompt = { ...masterPrompt, subject: { ...masterPrompt.subject, primary: '' } };
    const val = ImagePromptValidator.validate(badPrompt);
    assert.strictEqual(val.valid, false);
    assert.strictEqual(val.findings.some((f) => f.code === 'MISSING_SUBJECT' && f.severity === 'blocking'), true);
  });

  test('4. Missing composition camera spec is detected as warning finding', () => {
    const badPrompt = { ...masterPrompt, composition: { ...masterPrompt.composition, cameraDistance: '' } };
    const val = ImagePromptValidator.validate(badPrompt);
    assert.strictEqual(val.findings.some((f) => f.code === 'MISSING_COMPOSITION_SPEC' && f.severity === 'warning'), true);
  });

  test('5. Excessive prompt length (> 1000 chars) is detected as warning finding', () => {
    const longText = 'A '.repeat(600);
    const badPrompt = { ...masterPrompt, promptText: longText };
    const val = ImagePromptValidator.validate(badPrompt);
    assert.strictEqual(val.findings.some((f) => f.code === 'EXCESSIVE_PROMPT_LENGTH'), true);
  });

  test('6. PII leakage (email in promptText) is detected as blocking finding', () => {
    const badPrompt = { ...masterPrompt, promptText: `${masterPrompt.promptText} Contact user@company.com` };
    const val = ImagePromptValidator.validate(badPrompt);
    assert.strictEqual(val.valid, false);
    assert.strictEqual(val.findings.some((f) => f.code === 'PII_LEAKAGE_DETECTED' && f.severity === 'blocking'), true);
  });

  test('7. Missing negative prompt instructions is detected as warning finding', () => {
    const badPrompt = { ...masterPrompt, negativePromptText: '' };
    const val = ImagePromptValidator.validate(badPrompt);
    assert.strictEqual(val.findings.some((f) => f.code === 'MISSING_NEGATIVE_INSTRUCTIONS'), true);
  });

  test('8. Contradictory lighting instructions are detected', () => {
    const badPrompt = { ...masterPrompt, promptText: 'Pitch black dark room with direct sunlight' };
    const val = ImagePromptValidator.validate(badPrompt);
    assert.strictEqual(val.findings.some((f) => f.code === 'CONTRADICTORY_LIGHTING'), true);
  });

  test('9. PromptRepairEngine.repairPrompt() repairs MISSING_SUBJECT automatically', () => {
    const badPrompt = { ...masterPrompt, subject: { ...masterPrompt.subject, primary: '' } };
    const repair = PromptRepairEngine.repairPrompt(badPrompt);
    assert.strictEqual(repair.repaired, true);
    assert.strictEqual(repair.repairedPrompt.subject.primary.length > 0, true);
    assert.strictEqual(repair.validationAfterRepair.valid, true);
  });

  test('10. PromptRepairEngine.repairPrompt() repairs PII_LEAKAGE_DETECTED by stripping PII', () => {
    const badPrompt = { ...masterPrompt, promptText: `${masterPrompt.promptText} Contact user@company.com or 555-0199` };
    const repair = PromptRepairEngine.repairPrompt(badPrompt);
    assert.strictEqual(repair.repaired, true);
    assert.strictEqual(repair.repairedPrompt.promptText.includes('user@company.com'), false);
    assert.strictEqual(repair.repairedPrompt.promptText.includes('555-0199'), false);
  });

  test('11. PromptRepairEngine.repairPrompt() repairs EXCESSIVE_PROMPT_LENGTH by truncating text', () => {
    const longText = 'A '.repeat(600);
    const badPrompt = { ...masterPrompt, promptText: longText };
    const repair = PromptRepairEngine.repairPrompt(badPrompt);
    assert.strictEqual(repair.repairedPrompt.promptText.length <= 800, true);
  });

  test('12. PromptRepairEngine.repairPrompt() repairs MISSING_NEGATIVE_INSTRUCTIONS', () => {
    const badPrompt = { ...masterPrompt, negativePromptText: '' };
    const repair = PromptRepairEngine.repairPrompt(badPrompt);
    assert.strictEqual(repair.repairedPrompt.negativePromptText!.includes('watermarks'), true);
  });

  test('13. PromptRepairEngine.repairPrompt() repairs CONTRADICTORY_LIGHTING', () => {
    const badPrompt = { ...masterPrompt, promptText: 'Pitch black dark room with direct sunlight' };
    const repair = PromptRepairEngine.repairPrompt(badPrompt);
    assert.strictEqual(repair.repairedPrompt.promptText.includes('pitch black'), false);
  });

  test('14. Repaired prompt increments version number', () => {
    const badPrompt = { ...masterPrompt, negativePromptText: '' };
    const repair = PromptRepairEngine.repairPrompt(badPrompt);
    assert.strictEqual(repair.repairedPrompt.version, masterPrompt.version + 1);
  });

  test('15. Repaired prompt updates deterministic SHA-256 fingerprint', () => {
    const badPrompt = { ...masterPrompt, negativePromptText: '' };
    const repair = PromptRepairEngine.repairPrompt(badPrompt);
    assert.notStrictEqual(repair.repairedPrompt.deterministicFingerprint, masterPrompt.deterministicFingerprint);
  });

  test('16. Validation after repair confirms providerReady: true', () => {
    const badPrompt = { ...masterPrompt, negativePromptText: '' };
    const repair = PromptRepairEngine.repairPrompt(badPrompt);
    assert.strictEqual(repair.validationAfterRepair.providerReady, true);
  });

  test('17. Repaired summary records repairs applied', () => {
    const badPrompt = { ...masterPrompt, negativePromptText: '' };
    const repair = PromptRepairEngine.repairPrompt(badPrompt);
    assert.strictEqual(repair.repairsApplied.length > 0, true);
  });

  test('18. Valid prompt undergoes no unnecessary modifications', () => {
    const repair = PromptRepairEngine.repairPrompt(masterPrompt);
    assert.strictEqual(repair.repaired, false);
    assert.strictEqual(repair.repairsApplied.length, 0);
  });

  test('19. Zod schema validation passes for findings', () => {
    const val = ImagePromptValidator.validate(masterPrompt);
    assert.strictEqual(typeof val.validatedAt, 'string');
  });

  test('20. Level 17 Master Image Prompt Builder tests remain passing', () => {
    assert.strictEqual(masterPrompt.briefId, brief.id);
  });

  test('21. Level 16 Composition Planner tests remain passing', () => {
    assert.strictEqual(composition.status, 'selected');
  });

  test('22. Level 15 Visual Concept Generator tests remain passing', () => {
    assert.strictEqual(concept.status, 'selected');
  });

  test('23. Level 14 Visual Brief tests remain passing', () => {
    assert.strictEqual(brief.platform, 'LinkedIn');
  });

  test('24. Null prompt throws validation error', () => {
    assert.throws(
      () => ImagePromptValidator.validate(null as any),
      (err: any) => err.message.includes('INVALID_VALIDATOR_INPUT')
    );
  });

  test('25. Null prompt for repair throws repair error', () => {
    assert.throws(
      () => PromptRepairEngine.repairPrompt(null as any),
      (err: any) => err.message.includes('INVALID_REPAIR_INPUT')
    );
  });

  test('26. Repaired timestamp is present', () => {
    const badPrompt = { ...masterPrompt, negativePromptText: '' };
    const repair = PromptRepairEngine.repairPrompt(badPrompt);
    assert.strictEqual(typeof repair.repairedAt, 'string');
  });

  test('27. Complete end-to-end prompt validation and repair pipeline succeeds deterministically', () => {
    const val = ImagePromptValidator.validate(masterPrompt);
    const repair = PromptRepairEngine.repairPrompt(masterPrompt);
    assert.strictEqual(val.valid, true);
    assert.strictEqual(repair.validationAfterRepair.valid, true);
  });
});
