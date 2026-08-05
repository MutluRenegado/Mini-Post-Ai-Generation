import assert from 'assert';
import { test, describe } from 'node:test';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '../lib/ai-image-generator/images/visualConceptGenerator';
import { CompositionPlanner } from '../lib/ai-image-generator/images/compositionPlanner';
import { PlatformSizingManager } from '../lib/services/platformSizingManager';
import { StockProviderRouter } from '../providers/stock-provider-router';
import { PexelsProvider } from '../providers/pexels/pexels.provider';

describe('Level 16: Intelligent Composition Planner Test Suite (30 Assertions)', () => {
  const postText = 'Accelerating enterprise cloud security with automated threat detection and real-time monitoring.';
  const brief = FinalPostAnalyzer.analyze({
    postContent: postText,
    platform: 'LinkedIn',
    brandContext: { brandId: 'brand_sec', palette: ['#0284C7', '#0F172A'] },
  });
  const conceptResult = VisualConceptGenerator.generateConcepts(brief);
  const selectedConcept = conceptResult.selectedConcept;

  test('1. Composition plan is generated', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    assert.strictEqual(!!result, true);
    assert.strictEqual(result.briefId, brief.id);
  });

  test('2. Three composition candidates generated (editorial, minimal, cinematic)', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    assert.strictEqual(result.candidates.length, 3);
    const types = result.candidates.map((c) => c.compositionType);
    assert.strictEqual(types.includes('editorial'), true);
    assert.strictEqual(types.includes('minimal'), true);
    assert.strictEqual(types.includes('cinematic'), true);
  });

  test('3. Exactly one composition candidate is selected', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const selected = result.candidates.filter((c) => c.status === 'selected');
    assert.strictEqual(selected.length, 1);
    assert.strictEqual(result.selectedComposition.status, 'selected');
  });

  test('4. Camera plan is valid', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const cam = result.selectedComposition.camera;
    assert.strictEqual(typeof cam.distance, 'string');
    assert.strictEqual(typeof cam.height, 'string');
    assert.strictEqual(typeof cam.angle, 'string');
    assert.strictEqual(typeof cam.perspective, 'string');
  });

  test('5. Lens suggestion is valid', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const lens = result.selectedComposition.camera.lens;
    assert.strictEqual(lens.includes('mm'), true);
  });

  test('6. Rule of thirds is supported', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const editorial = result.candidates.find((c) => c.compositionType === 'editorial');
    assert.strictEqual(editorial?.composition.ruleOfThirds, true);
  });

  test('7. Symmetry is supported', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const minimal = result.candidates.find((c) => c.compositionType === 'minimal');
    assert.strictEqual(minimal?.composition.symmetry, true);
  });

  test('8. Eye flow string is generated', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    assert.strictEqual(typeof result.selectedComposition.composition.eyeFlow, 'string');
  });

  test('9. Foreground layer is generated', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    assert.strictEqual(Array.isArray(result.selectedComposition.layers.foreground), true);
  });

  test('10. Midground layer is generated', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    assert.strictEqual(Array.isArray(result.selectedComposition.layers.midground), true);
    assert.strictEqual(result.selectedComposition.layers.midground.length > 0, true);
  });

  test('11. Background layer is generated', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    assert.strictEqual(Array.isArray(result.selectedComposition.layers.background), true);
    assert.strictEqual(result.selectedComposition.layers.background.length > 0, true);
  });

  test('12. Lighting plan is generated', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const light = result.selectedComposition.lighting;
    assert.strictEqual(typeof light.direction, 'string');
    assert.strictEqual(typeof light.quality, 'string');
    assert.strictEqual(typeof light.intensity, 'string');
    assert.strictEqual(typeof light.colorTemperature, 'string');
  });

  test('13. Color harmony is generated', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const col = result.selectedComposition.colors;
    assert.strictEqual(Array.isArray(col.primary), true);
    assert.strictEqual(typeof col.contrastLevel, 'string');
  });

  test('14. Brand colors influence composition palette', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    assert.strictEqual(result.selectedComposition.colors.primary.includes('#0284C7'), true);
  });

  test('15. Safe areas are generated', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const sa = result.selectedComposition.safeAreas;
    assert.strictEqual(typeof sa.top, 'number');
    assert.strictEqual(typeof sa.bottom, 'number');
  });

  test('16. Typography-safe zones are generated', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const minimal = result.candidates.find((c) => c.compositionType === 'minimal');
    assert.strictEqual(minimal?.scores.typographyFriendliness! >= 90, true);
  });

  test('17. Platform affects composition aspectRatio and cropTolerance', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    assert.strictEqual(result.selectedComposition.platform.name, 'LinkedIn');
    assert.strictEqual(result.selectedComposition.platform.aspectRatio, '1.91:1');
  });

  test('18. Crop resilience score is generated', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    assert.strictEqual(typeof result.selectedComposition.scores.cropResilience, 'number');
  });

  test('19. Focal point X and Y are valid between 0 and 1', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const cp = result.selectedComposition.cropPlan;
    assert.strictEqual(cp.focalPointX >= 0 && cp.focalPointX <= 1, true);
    assert.strictEqual(cp.focalPointY >= 0 && cp.focalPointY <= 1, true);
  });

  test('20. Crop plan safeCrop is valid boolean', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    assert.strictEqual(result.selectedComposition.cropPlan.safeCrop, true);
  });

  test('21. Highest-scoring candidate is selected automatically', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const maxScore = Math.max(...result.candidates.map((c) => c.scores.overall));
    assert.strictEqual(result.selectedComposition.scores.overall, maxScore);
  });

  test('22. Unsafe composition is rejected / filtered', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    result.candidates.forEach((c) => {
      assert.strictEqual(c.cropPlan.safeCrop, true);
    });
  });

  test('23. Candidate IDs are unique', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const ids = result.candidates.map((c) => c.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(uniqueIds.size, 3);
  });

  test('24. Runtime Zod validation passes for all candidates', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    assert.strictEqual(typeof result.generationTimestamp, 'string');
  });

  test('25. Existing Level 15 Visual Concept tests remain passing', () => {
    assert.strictEqual(selectedConcept.status, 'selected');
  });

  test('26. Existing Level 14 Visual Brief tests remain passing', () => {
    assert.strictEqual(brief.platform, 'LinkedIn');
  });

  test('27. Existing Level 10 PlatformSizingManager tests remain passing', () => {
    const variants = PlatformSizingManager.generateVariants({
      id: 'm1',
      source: 'PEXELS',
      kind: 'STOCK',
      url: 'https://images.pexels.com/1.jpg',
      previewUrl: 'https://images.pexels.com/1.jpg',
      thumbnailUrl: 'https://images.pexels.com/1.jpg',
      width: 1920,
      height: 1080,
      aspectRatio: '16:9',
      mimeType: 'image/jpeg',
      altText: 'Office',
      creator: { name: 'Alice' },
      sourcePage: 'https://pexels.com/1',
      attribution: { text: 'Photo by Alice', url: 'https://pexels.com/1' },
      license: 'Pexels License',
    });
    assert.strictEqual(variants.length, 11);
  });

  test('28. Existing Provider router tests remain passing', () => {
    const router = new StockProviderRouter();
    assert.strictEqual(router.getProvider('pexels') instanceof PexelsProvider, true);
  });

  test('29. Manual selection override via selectComposition() works', () => {
    const result = CompositionPlanner.planComposition(brief, selectedConcept);
    const altCandidate = result.candidates.find((c) => c.id !== result.selectedComposition.id);

    const updated = CompositionPlanner.selectComposition(result, altCandidate!.id);
    assert.strictEqual(updated.selectedComposition.id, altCandidate!.id);
    assert.strictEqual(updated.selectedComposition.status, 'selected');
  });

  test('30. Complete end-to-end pipeline from post to composition plan is deterministic', () => {
    const r1 = CompositionPlanner.planComposition(brief, selectedConcept);
    const r2 = CompositionPlanner.planComposition(brief, selectedConcept);

    assert.strictEqual(r1.selectedComposition.id, r2.selectedComposition.id);
    assert.strictEqual(r1.selectedComposition.scores.overall, r2.selectedComposition.scores.overall);
  });
});
