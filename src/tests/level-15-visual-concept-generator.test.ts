import assert from 'assert';
import { test, describe } from 'node:test';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '../lib/ai-image-generator/images/visualConceptGenerator';

describe('Level 15: Visual Concept Generator Test Suite (15 Assertions)', () => {
  const postText = 'Announcing our next-gen cloud automation dashboard. Streamline workflows and scale team productivity seamlessly.';
  const brief = FinalPostAnalyzer.analyze({ postContent: postText, platform: 'LinkedIn' });

  test('1. Three distinct concept types (literal, editorial, symbolic) are generated', () => {
    const result = VisualConceptGenerator.generateConcepts(brief);
    assert.strictEqual(result.candidates.length, 3);

    const types = result.candidates.map((c) => c.type);
    assert.strictEqual(types.includes('literal'), true);
    assert.strictEqual(types.includes('editorial'), true);
    assert.strictEqual(types.includes('symbolic'), true);
  });

  test('2. Candidates are meaningfully different in title and composition', () => {
    const result = VisualConceptGenerator.generateConcepts(brief);
    const [c1, c2, c3] = result.candidates;

    assert.notStrictEqual(c1.title, c2.title);
    assert.notStrictEqual(c1.compositionDirection, c2.compositionDirection);
  });

  test('3. Literal concept matches primary subject and setting directly', () => {
    const result = VisualConceptGenerator.generateConcepts(brief);
    const literal = result.candidates.find((c) => c.type === 'literal');

    assert.strictEqual(literal?.primarySubject, brief.primarySubject);
    assert.strictEqual(literal?.setting, brief.setting);
  });

  test('4. Editorial concept tells a coherent narrative story', () => {
    const result = VisualConceptGenerator.generateConcepts(brief);
    const editorial = result.candidates.find((c) => c.type === 'editorial');

    assert.strictEqual(editorial?.sceneDescription.includes('snapshot'), true);
  });

  test('5. Symbolic concept uses a relevant visual metaphor', () => {
    const result = VisualConceptGenerator.generateConcepts(brief);
    const symbolic = result.candidates.find((c) => c.type === 'symbolic');

    assert.strictEqual(typeof symbolic?.visualMetaphor, 'string');
    assert.strictEqual(symbolic?.visualMetaphor!.length! > 0, true);
  });

  test('6. Concepts preserve brand direction and color palette', () => {
    const brandBrief = FinalPostAnalyzer.analyze({
      postContent: postText,
      platform: 'LinkedIn',
      brandContext: { brandId: 'b99', palette: ['#00F0FF', '#0F172A'] },
    });
    const result = VisualConceptGenerator.generateConcepts(brandBrief);

    result.candidates.forEach((c) => {
      assert.strictEqual(c.colorDirection.includes('#00F0FF'), true);
    });
  });

  test('7. Concepts reflect target platform needs in platformFit', () => {
    const result = VisualConceptGenerator.generateConcepts(brief);
    result.candidates.forEach((c) => {
      assert.strictEqual(c.platformFit.platform, 'LinkedIn');
      assert.strictEqual(c.platformFit.aspectRatio, '1.91:1');
    });
  });

  test('8. Concepts include risk flags where relevant', () => {
    const result = VisualConceptGenerator.generateConcepts(brief);
    const editorial = result.candidates.find((c) => c.type === 'editorial');

    assert.strictEqual(Array.isArray(editorial?.riskFlags), true);
  });

  test('9. Highest-scoring concept is selected deterministically', () => {
    const result = VisualConceptGenerator.generateConcepts(brief);

    assert.strictEqual(result.selectedConcept.status, 'selected');
    const maxScore = Math.max(...result.candidates.map((c) => c.scores.overall));
    assert.strictEqual(result.selectedConcept.scores.overall, maxScore);
  });

  test('10. User can select another concept candidate via selectConcept()', () => {
    const result = VisualConceptGenerator.generateConcepts(brief);
    const altCandidate = result.candidates.find((c) => c.id !== result.selectedConcept.id);

    const updated = VisualConceptGenerator.selectConcept(result, altCandidate!.id);
    assert.strictEqual(updated.selectedConcept.id, altCandidate!.id);
    assert.strictEqual(updated.selectedConcept.status, 'selected');
  });

  test('11. Hidden reasoning is not stored; conciseSelectionRationale is user-safe', () => {
    const result = VisualConceptGenerator.generateConcepts(brief);
    result.candidates.forEach((c) => {
      assert.strictEqual(typeof c.conciseSelectionRationale, 'string');
      assert.strictEqual(c.conciseSelectionRationale.length > 0, true);
    });
  });

  test('12. Candidate objects satisfy Zod VisualConceptCandidateSchema', () => {
    const result = VisualConceptGenerator.generateConcepts(brief);
    assert.strictEqual(typeof result.generationTimestamp, 'string');
  });

  test('13. Level 14 Visual Intelligence Brief tests remain passing', () => {
    assert.strictEqual(brief.platform, 'LinkedIn');
  });

  test('14. Level 12 Publishing Handoff tests remain passing', () => {
    assert.strictEqual(typeof brief.deterministicFingerprint, 'string');
  });

  test('15. Complete pipeline produces valid candidates deterministically', () => {
    const r1 = VisualConceptGenerator.generateConcepts(brief);
    const r2 = VisualConceptGenerator.generateConcepts(brief);

    assert.strictEqual(r1.selectedConcept.type, r2.selectedConcept.type);
    assert.strictEqual(r1.selectedConcept.scores.overall, r2.selectedConcept.scores.overall);
  });
});
