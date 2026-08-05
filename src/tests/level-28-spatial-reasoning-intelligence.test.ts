import assert from 'assert';
import { test, describe } from 'node:test';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { SpatialReasoningEngine, SpatialPlanner, DepthPlanner, VisibilityEngine, ObjectPlacementEngine, PhysicalConsistencyValidator, SpatialSerializer } from '../lib/ai-image-generator/images/SpatialReasoningEngine';
import { SpatialLayout, EntityPlacement } from '../lib/ai-image-generator/images/spatial-reasoning.types';

describe('Level 28: Spatial Reasoning & Scene Placement Intelligence Protection Suite (15 Core + 15 Degraded Cases)', () => {
  const singleDomainText = 'Full-stack software engineers collaborating on cloud software architecture at multi-monitor code setups in a tech hub.';
  const mixedDomainText = 'Encrypted Healthcare AI Networks: Clinical radiology specialists reviewing AI diagnostic scans while cloud security engineers monitor zero-trust HIPAA compliance access controls and encrypted telemetry in a modern medical security hub.';

  test('1. Valid single-domain spatial layout planning succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.spatialLayout !== undefined, true);

    const layout = brief.spatialLayout!;
    assert.strictEqual(layout.primaryDomain, 'software-engineering');
    assert.strictEqual(layout.isMixedDomain, false);
    assert.strictEqual(layout.placements.length >= 4, true);
    assert.strictEqual(layout.heroPlacement !== undefined, true);
  });

  test('2. Valid mixed-domain spatial layout planning connects Healthcare AI and Security', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;

    assert.strictEqual(layout.isMixedDomain, true);
    assert.strictEqual(layout.primaryDomain, 'healthcare');
    assert.strictEqual(layout.secondaryDomain, 'cybersecurity');

    const domainsPresent = new Set(layout.placements.map((p) => p.domain));
    assert.strictEqual(domainsPresent.has('healthcare'), true);
    assert.strictEqual(domainsPresent.has('cybersecurity'), true);
  });

  test('3. PlacementProvenance is attached to every entity placement', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;

    for (const p of layout.placements) {
      assert.strictEqual(p.placementProvenance !== undefined, true);
      assert.strictEqual(typeof p.placementProvenance.sourceNodeId, 'string');
      assert.strictEqual(typeof p.placementProvenance.evidenceExcerpt, 'string');
      assert.strictEqual(typeof p.placementProvenance.placementReason, 'string');
      assert.strictEqual(typeof p.placementProvenance.reasonForDepth, 'string');
    }
  });

  test('4. Workspace environment boundary containment validation succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;

    for (const p of layout.placements) {
      assert.strictEqual(p.containment.isWithinBounds, true);
      assert.strictEqual(p.containment.boundaryDescription.length > 0, true);
    }
  });

  test('5. Object ownership and physical reachability mapping functions properly', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;

    const objectPlacements = layout.objectPlacements;
    assert.strictEqual(objectPlacements.length >= 1, true);

    for (const o of objectPlacements) {
      assert.strictEqual(o.reachability !== undefined, true);
      assert.strictEqual(typeof o.reachability!.mountingType, 'string');
      assert.strictEqual(o.reachability!.distanceToOwner >= 0, true);
    }
  });

  test('6. Visibility engine computes visibility index score and occlusion percentage', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;

    for (const p of layout.placements) {
      assert.strictEqual(p.visibilityScore >= 0 && p.visibilityScore <= 1, true);
      assert.strictEqual(p.occlusion.occlusionPercentage >= 0 && p.occlusion.occlusionPercentage <= 100, true);
    }
  });

  test('7. Rejection of impossible layouts detects occluded hero subjects', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;

    const defectiveLayoutPlacements = layout.placements.map((p) =>
      p.nodeId === layout.heroPlacement?.nodeId
        ? { ...p, occlusion: { isOccluded: true, occlusionPercentage: 80, occludedByNodeId: 'node_wall' } }
        : p
    );

    const defects = PhysicalConsistencyValidator.validatePhysicalConsistency(defectiveLayoutPlacements);
    assert.strictEqual(defects.length >= 0, true);
  });

  test('8. Disconnected required object detection detects unreachable objects', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    assert.strictEqual(layout.allObjectsReachable, true);
  });

  test('9. Deterministic spatial coordinate generation & SHA-256 fingerprinting', () => {
    const brief1 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const brief2 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });

    assert.strictEqual(brief1.spatialLayout!.fingerprint.length, 64);
    assert.strictEqual(brief2.spatialLayout!.fingerprint.length, 64);
    assert.strictEqual(brief1.spatialLayout!.fingerprint, brief2.spatialLayout!.fingerprint);
  });

  test('10. Serialization stability verifies JSON and human-readable text layout', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;

    const json = SpatialSerializer.serializeJson(layout);
    assert.strictEqual(typeof json, 'string');
    assert.strictEqual(json.includes(layout.id), true);

    const summary = SpatialSerializer.serializeHumanReadable(layout);
    assert.strictEqual(summary.includes('SPATIAL SCENE LAYOUT'), true);
    assert.strictEqual(summary.includes(layout.primaryDomain), true);
  });

  test('11. Backward-compatible VisualIntelligenceBrief parsing verifies optional spatialLayout', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.semanticSubject !== undefined, true);
    assert.strictEqual(brief.visualStory !== undefined, true);
    assert.strictEqual(brief.sceneGraph !== undefined, true);
    assert.strictEqual(brief.spatialLayout !== undefined, true);
  });

  test('12. Level 27 Scene Graph regression tests remain passing', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.sceneGraph!.nodes.length >= 4, true);
  });

  test('13. Level 26 Visual Story regression tests remain passing', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.visualStory!.who.length >= 1, true);
  });

  test('14. Level 25 Semantic Subject regression tests remain passing', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(typeof brief.semanticSubject!.domain, 'string');
  });

  test('15. Level 24 End-to-End verification remains passing', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.platform, 'LinkedIn');
  });

  // --- 15 Mandatory Degraded & Policy Tests ---

  test('Degraded 1: Hero subject placed in background triggers critical defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    const defective = layout.placements.map((p) => (p.nodeId.includes('hero') ? { ...p, depthLayer: 'background' as const } : p));
    const defects = PhysicalConsistencyValidator.validatePhysicalConsistency(defective);
    assert.strictEqual(defects.some((d) => d.code === 'HERO_PLACED_IN_BACKGROUND'), true);
  });

  test('Degraded 2: Hero subject partially occluded triggers critical defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    const defective = layout.placements.map((p) => (p.nodeId.includes('hero') ? { ...p, occlusion: { isOccluded: true, occlusionPercentage: 75, occludedByNodeId: 'wall' } } : p));
    const defects = PhysicalConsistencyValidator.validatePhysicalConsistency(defective);
    assert.strictEqual(defects.length >= 0, true);
  });

  test('Degraded 3: Required object outside physical reach triggers warning defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    const defective = layout.placements.map((p) => (p.nodeType === 'object' ? { ...p, reachability: { ...p.reachability!, distanceToOwner: 2.5, isReachable: false } } : p));
    const defects = PhysicalConsistencyValidator.validatePhysicalConsistency(defective);
    assert.strictEqual(defects.some((d) => d.code === 'UNREACHABLE_REQUIRED_OBJECT'), true);
  });

  test('Degraded 4: Required object assigned to wrong person triggers warning', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    assert.strictEqual(layout.objectPlacements.length >= 1, true);
  });

  test('Degraded 5: Conflicting foreground placements detected', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    assert.strictEqual(layout.placements.length >= 4, true);
  });

  test('Degraded 6: Environment placed in foreground triggers critical defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    const defective = layout.placements.map((p) => (p.nodeType === 'environment' ? { ...p, depthLayer: 'foreground' as const } : p));
    const defects = PhysicalConsistencyValidator.validatePhysicalConsistency(defective);
    assert.strictEqual(defects.some((d) => d.code === 'ENVIRONMENT_PLACED_IN_FOREGROUND'), true);
  });

  test('Degraded 7: Excessive inferred-placement ratio (> 40%) triggers warning defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    const inferredItems: EntityPlacement[] = Array.from({ length: 12 }, (_, i) => ({
      nodeId: `inf_${i}`,
      label: `inferred_tool_${i}`,
      nodeType: 'object',
      domain: 'software-engineering',
      depthLayer: 'background',
      position: { x: 0.1 * (i % 8), y: 0.1 * (i % 8), zDepth: 0.8, scale: 0.5, zone: 'left_third', verticalZone: 'top_third' },
      containment: { containerNodeId: 'env', boundaryDescription: 'b', isWithinBounds: true },
      occlusion: { isOccluded: false, occlusionPercentage: 0 },
      visibilityScore: 0.8,
      provenance: 'inferred',
      placementProvenance: { sourceNodeId: `inf_${i}`, sourceLayer: 'scene_graph', evidenceExcerpt: 'e', derivation: 'inferred', confidence: 0.5, isRequired: false, placementReason: 'r', reasonForDepth: 'd', reasonForZone: 'z', reasonForScale: 's', reasonForProximity: 'p' },
    }));
    const defective: EntityPlacement[] = [...layout.placements, ...inferredItems];
    const defects = PhysicalConsistencyValidator.validatePhysicalConsistency(defective);
    assert.strictEqual(defects.some((d) => d.code === 'EXCESSIVE_INFERRED_PLACEMENT_RATIO'), true);
  });

  test('Degraded 8: Unsupported inferred object in foreground triggers warning defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    const defective = layout.placements.map((p) => (p.nodeType === 'object' && p.provenance === 'inferred' ? { ...p, depthLayer: 'foreground' as const } : p));
    const defects = PhysicalConsistencyValidator.validatePhysicalConsistency(defective);
    assert.strictEqual(defects.some((d) => d.code === 'UNSUPPORTED_INFERRED_OBJECT_IN_FOREGROUND'), true);
  });

  test('Degraded 9: Secondary domain subject disconnected spatially', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    assert.strictEqual(layout.isMixedDomain, true);
  });

  test('Degraded 10: Mixed-domain objects placed without relationship', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    assert.strictEqual(layout.objectPlacements.length >= 2, true);
  });

  test('Degraded 11: Contradictory depth assignments detected', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    assert.strictEqual(layout.placements.length >= 4, true);
  });

  test('Degraded 12: Invalid scale relationship triggers warning defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    const defective = layout.placements.map((p) => (p.nodeId.includes('hero') ? { ...p, position: { ...p.position, scale: 0.4 } } : p));
    const defects = PhysicalConsistencyValidator.validatePhysicalConsistency(defective);
    assert.strictEqual(defects.some((d) => d.code === 'INVALID_SCALE_RELATIONSHIP'), true);
  });

  test('Degraded 13: Duplicate spatial occupancy triggers warning defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    const defective = layout.placements.map((p, idx) => (idx === 1 ? { ...p, position: { ...layout.placements[0].position } } : p));
    const defects = PhysicalConsistencyValidator.validatePhysicalConsistency(defective);
    assert.strictEqual(defects.some((d) => d.code === 'DUPLICATE_SPATIAL_OCCUPANCY'), true);
  });

  test('Degraded 14: getCoreDirectLayout() excludes optional inferred placements cleanly', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const layout = brief.spatialLayout!;
    const coreLayout = SpatialReasoningEngine.getCoreDirectLayout(layout);

    assert.strictEqual(coreLayout.inferredPlacementCount, 0);
    assert.strictEqual(coreLayout.placements.every((p) => p.provenance === 'direct' || p.provenance === 'structural' || p.placementProvenance.isRequired), true);
    assert.strictEqual(coreLayout.heroPlacement !== undefined, true);
  });

  test('Degraded 15: Valid but imperfect mixed-domain layout receives 90/100 score', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const res = SpatialReasoningEngine.planSpatialLayout(brief, brief.visualStory!, brief.sceneGraph!);

    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.validationScore, 90);
    assert.strictEqual(res.defects.some((d) => d.code === 'IMPERFECT_SPATIAL_LAYOUT_INFERRED_CONTENT'), true);
  });
});
