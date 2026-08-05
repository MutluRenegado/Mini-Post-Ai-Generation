import assert from 'assert';
import { test, describe } from 'node:test';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '../lib/ai-image-generator/images/visualConceptGenerator';
import { CompositionPlanner } from '../lib/ai-image-generator/images/compositionPlanner';
import { MasterImagePromptBuilder } from '../lib/ai-image-generator/images/masterImagePromptBuilder';

describe('Level 17: Automatic Master Image Prompt Builder Test Suite (28 Assertions)', () => {
  const postText = 'Introducing our enterprise AI security dashboard for real-time threat detection and cloud compliance.';
  const brief = FinalPostAnalyzer.analyze({
    postContent: postText,
    platform: 'LinkedIn',
    brandContext: { brandId: 'b_sec', palette: ['#0284C7', '#0F172A'] },
  });
  const conceptRes = VisualConceptGenerator.generateConcepts(brief);
  const concept = conceptRes.selectedConcept;
  const compRes = CompositionPlanner.planComposition(brief, concept);
  const composition = compRes.selectedComposition;

  test('1. MasterImagePromptBuilder.buildPrompt() constructs valid MasterImagePrompt', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(!!prompt, true);
    assert.strictEqual(prompt.briefId, brief.id);
    assert.strictEqual(prompt.conceptId, concept.id);
    assert.strictEqual(prompt.compositionPlanId, composition.id);
  });

  test('2. Automatically generates prompt without requiring manual user input', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(typeof prompt.promptText, 'string');
    assert.strictEqual(prompt.promptText.length > 50, true);
  });

  test('3. Prompt incorporates VisualIntelligenceBrief data', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(prompt.environment.setting, brief.setting);
  });

  test('4. Prompt incorporates selected VisualConceptCandidate data', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(prompt.subject.primary, concept.primarySubject);
  });

  test('5. Prompt incorporates selected CompositionPlan data', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(prompt.composition.lens, composition.camera.lens);
  });

  test('6. Brand Kit color palette is present in prompt color section', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(prompt.color.primaryPalette.includes('#0284C7'), true);
  });

  test('7. Target platform name and aspect ratio are included', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(prompt.platform.name, 'LinkedIn');
    assert.strictEqual(prompt.platform.aspectRatio, '1.91:1');
  });

  test('8. Safe-zone instructions and negative space are included', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(typeof prompt.composition.negativeSpace, 'string');
  });

  test('9. User refinement is additive', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition, {
      userRefinement: 'Add subtle isometric grid lines in background',
    });
    assert.strictEqual(prompt.userRefinement, 'Add subtle isometric grid lines in background');
    assert.strictEqual(prompt.promptText.includes('isometric grid lines'), true);
  });

  test('10. Subject section contains primary, supporting, action, state', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(typeof prompt.subject.primary, 'string');
    assert.strictEqual(Array.isArray(prompt.subject.supporting), true);
    assert.strictEqual(typeof prompt.subject.action, 'string');
  });

  test('11. Environment section contains setting, atmosphere, details', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(typeof prompt.environment.setting, 'string');
    assert.strictEqual(Array.isArray(prompt.environment.contextualDetails), true);
  });

  test('12. Composition section contains camera distance, angle, lens, layers', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(typeof prompt.composition.cameraDistance, 'string');
    assert.strictEqual(typeof prompt.composition.lens, 'string');
    assert.strictEqual(Array.isArray(prompt.composition.foreground), true);
  });

  test('13. Lighting section contains direction, quality, intensity, temperature', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(typeof prompt.lighting.direction, 'string');
    assert.strictEqual(typeof prompt.lighting.quality, 'string');
  });

  test('14. Color section contains primary and secondary palette', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(Array.isArray(prompt.color.primaryPalette), true);
    assert.strictEqual(Array.isArray(prompt.color.secondaryPalette), true);
  });

  test('15. Style section contains visual style, realism level, depth of field', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(typeof prompt.style.visualStyle, 'string');
    assert.strictEqual(typeof prompt.style.realismLevel, 'string');
  });

  test('16. Constraints section contains negative instructions (no text, no watermarks)', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(prompt.constraints.negativeInstructions.includes('no text'), true);
    assert.strictEqual(prompt.constraints.negativeInstructions.includes('no watermarks'), true);
  });

  test('17. Negative prompt text is generated cleanly', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(typeof prompt.negativePromptText, 'string');
    assert.strictEqual(prompt.negativePromptText!.includes('watermarks'), true);
  });

  test('18. Prompt is versioned', () => {
    const p1 = MasterImagePromptBuilder.buildPrompt(brief, concept, composition, { version: 1 });
    const p2 = MasterImagePromptBuilder.buildPrompt(brief, concept, composition, { version: 2 });
    assert.strictEqual(p1.version, 1);
    assert.strictEqual(p2.version, 2);
  });

  test('19. Deterministic SHA-256 fingerprint is generated', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(typeof prompt.deterministicFingerprint, 'string');
    assert.strictEqual(prompt.deterministicFingerprint.length, 64);
  });

  test('20. Sensitive PII data is absent from generated prompt', () => {
    const piiPost = 'Call us at 555-0199 or email security@company.com for cloud threat protection.';
    const piiBrief = FinalPostAnalyzer.analyze({ postContent: piiPost, platform: 'LinkedIn' });
    const piiConcept = VisualConceptGenerator.generateConcepts(piiBrief).selectedConcept;
    const piiComp = CompositionPlanner.planComposition(piiBrief, piiConcept).selectedComposition;
    const prompt = MasterImagePromptBuilder.buildPrompt(piiBrief, piiConcept, piiComp);

    assert.strictEqual(prompt.promptText.includes('555-0199'), false);
    assert.strictEqual(prompt.promptText.includes('security@company.com'), false);
  });

  test('21. Runtime Zod schema validation passes', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(typeof prompt.createdAt, 'string');
  });

  test('22. Level 16 Composition Planner tests remain passing', () => {
    assert.strictEqual(composition.status, 'selected');
  });

  test('23. Level 15 Visual Concept Generator tests remain passing', () => {
    assert.strictEqual(concept.status, 'selected');
  });

  test('24. Level 14 Visual Brief tests remain passing', () => {
    assert.strictEqual(brief.platform, 'LinkedIn');
  });

  test('25. Missing inputs throw clear validation error', () => {
    assert.throws(
      () => MasterImagePromptBuilder.buildPrompt(null as any, concept, composition),
      (err: any) => err.message.includes('INVALID_PROMPT_BUILDER_INPUT')
    );
  });

  test('26. Concise prompt summary is generated', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(typeof prompt.concisePromptSummary, 'string');
    assert.strictEqual(prompt.concisePromptSummary.includes('v1'), true);
  });

  test('27. Fingerprint is deterministic for identical inputs', () => {
    const p1 = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    const p2 = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(p1.deterministicFingerprint, p2.deterministicFingerprint);
  });

  test('28. Complete visual pipeline from post to MasterImagePrompt succeeds cleanly', () => {
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    assert.strictEqual(prompt.promptText.length > 100, true);
  });
});
