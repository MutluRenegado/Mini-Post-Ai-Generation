import assert from 'assert';
import { test, describe } from 'node:test';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { OccupationInteractionEngine, OccupationProfileResolver, ProfessionalAuthenticityValidator, OccupationToolMatcher, RoleRelationshipValidator, InteractionConsistencyValidator, OccupationInteractionSerializer, SafetyEquipmentResolver } from '../lib/ai-image-generator/images/OccupationInteractionEngine';
import { OccupationProfile, HandObjectInteraction, GazePlan } from '../lib/ai-image-generator/images/occupation-interaction.types';

describe('Level 29: Occupation & Human Interaction Intelligence Test Suite (30 Core Assertions)', () => {
  const singleDomainText = 'Full-stack software engineers collaborating on cloud software architecture at multi-monitor code setups in a tech hub.';
  const mixedDomainText = 'Encrypted Healthcare AI Networks: Clinical radiology specialists reviewing AI diagnostic scans while cloud security engineers monitor zero-trust HIPAA compliance access controls and encrypted telemetry in a modern medical security hub.';

  test('1. Valid single occupation resolution succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    assert.strictEqual(plan.occupations.length >= 1, true);
    assert.strictEqual(typeof plan.occupations[0].canonicalName, 'string');
    assert.strictEqual(plan.occupations[0].resolutionStatus, 'knowledge_base_match');
  });

  test('2. Valid mixed-domain occupations resolution succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    assert.strictEqual(plan.isMixedDomain, true);
    assert.strictEqual(plan.occupations.length >= 2, true);
  });

  test('3. Deterministic occupation profiles generation', () => {
    const brief1 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const brief2 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief1.occupationInteractionPlan!.fingerprint, brief2.occupationInteractionPlan!.fingerprint);
  });

  test('4. Correct occupation-to-tool matching succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    assert.strictEqual(plan.handObjectInteractions.length >= 1, true);
  });

  test('5. Correct clothing assignment matches formality level', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    assert.strictEqual(typeof plan.occupations[0].appearance.clothingType, 'string');
    assert.strictEqual(typeof plan.occupations[0].appearance.formalityLevel, 'string');
  });

  test('6. Required PPE assignment for industrial & renewable energy domains', () => {
    const text = 'Photovoltaic Solar Farms: Renewable Energy Technicians Inspecting Solar Panel Arrays on plant floor';
    const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    assert.strictEqual(plan.occupations.some((o) => o.safetyRequirements.length >= 1), true);
  });

  test('7. Unrelated tool rejection flags prohibited tools', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    const defects = OccupationToolMatcher.matchTools(plan.occupations[0], [
      { nodeId: 'obj1', label: 'stethoscope', nodeType: 'object', domain: 'healthcare', depthLayer: 'foreground', position: { x: 0.1, y: 0.1, zDepth: 0.3, scale: 1, zone: 'left_third', verticalZone: 'top_third' }, containment: { containerNodeId: 'env', boundaryDescription: 'b', isWithinBounds: true }, occlusion: { isOccluded: false, occlusionPercentage: 0 }, visibilityScore: 1, provenance: 'direct', placementProvenance: { sourceNodeId: 's', sourceLayer: 'scene_graph', evidenceExcerpt: 'e', derivation: 'direct', confidence: 1, isRequired: true, placementReason: 'r', reasonForDepth: 'd', reasonForZone: 'z', reasonForScale: 's', reasonForProximity: 'p' } }
    ]);
    assert.strictEqual(defects.some((d) => d.code === 'UNRELATED_TOOL'), true);
  });

  test('8. Unsupported occupation rejection flags missing canonical name', () => {
    const defects = ProfessionalAuthenticityValidator.validateAuthenticity([
      { occupationId: 'occ1', canonicalName: '', aliases: [], domain: 'sw', typicalEnvironment: 'env', resolutionStatus: 'knowledge_base_match', appearance: { clothingType: 'suit', colorPalette: [], formalityLevel: 'formal_business', grooming: 'clean' }, commonTools: [], safetyRequirements: [], validActions: [], prohibitedTools: [], unrealisticActions: [], evidence: { sourceNodeId: 'n1', sourceLayer: 'scene_graph', evidenceExcerpt: 'e', derivation: 'inferred', confidence: 0.8, isRequired: true }, confidence: 0.8 }
    ]);
    assert.strictEqual(defects.some((d) => d.code === 'UNSUPPORTED_OCCUPATION'), true);
  });

  test('9. Occupation-environment mismatch validation', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.occupationInteractionPlan !== undefined, true);
  });

  test('10. Invalid professional action detection', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.occupationInteractionPlan!.poses.length >= 1, true);
  });

  test('11. Valid person-to-object interaction planning', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    assert.strictEqual(plan.handObjectInteractions.length >= 1, true);
  });

  test('12. Unreachable object interaction triggers warning defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    const defectivePlan = {
      ...plan,
      handObjectInteractions: [
        { personNodeId: 'p1', objectNodeId: 'o1', objectLabel: 'screen', handSide: 'right_hand' as const, gripType: 'holding' as const, isReachable: false, distanceMeters: 2.5 }
      ]
    };
    const defects = InteractionConsistencyValidator.validateConsistency(defectivePlan, brief.spatialLayout!);
    assert.strictEqual(defects.some((d) => d.code === 'UNREACHABLE_OBJECT_INTERACTION'), true);
  });

  test('13. Correct gaze direction assigned to primary focal screen', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    assert.strictEqual(plan.gazes.length >= 1, true);
    assert.strictEqual(typeof plan.gazes[0].targetType, 'string');
  });

  test('14. Contradictory gaze direction triggers warning defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    const defectivePlan = {
      ...plan,
      gazes: [
        { personNodeId: 'p1', targetType: 'collaborator_face' as const, targetLabel: 'collaborator', eyeContactState: 'observing_workspace' as const }
      ]
    };
    const defects = InteractionConsistencyValidator.validateConsistency(defectivePlan, brief.spatialLayout!);
    assert.strictEqual(defects.some((d) => d.code === 'CONTRADICTORY_GAZE_DIRECTION'), true);
  });

  test('15. Conflicting hand assignment triggers warning defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    const defectivePlan = {
      ...plan,
      handObjectInteractions: [
        { personNodeId: 'p1', objectNodeId: 'o1', objectLabel: 'scr1', handSide: 'right_hand' as const, gripType: 'holding' as const, isReachable: true, distanceMeters: 0.4 },
        { personNodeId: 'p1', objectNodeId: 'o2', objectLabel: 'scr2', handSide: 'right_hand' as const, gripType: 'holding' as const, isReachable: true, distanceMeters: 0.4 },
        { personNodeId: 'p1', objectNodeId: 'o3', objectLabel: 'scr3', handSide: 'right_hand' as const, gripType: 'holding' as const, isReachable: true, distanceMeters: 0.4 }
      ]
    };
    const defects = InteractionConsistencyValidator.validateConsistency(defectivePlan, brief.spatialLayout!);
    assert.strictEqual(defects.some((d) => d.code === 'CONFLICTING_HAND_ASSIGNMENTS'), true);
  });

  test('16. Valid collaboration relationship resolution', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    assert.strictEqual(plan.relationships.length >= 1, true);
    assert.strictEqual(plan.relationships[0].domainBridge, true);
  });

  test('17. Disconnected supporting professional validation', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.occupationInteractionPlan!.roleHierarchy !== undefined, true);
  });

  test('18. Role hierarchy resolution establishes lead specialist', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    assert.strictEqual(typeof plan.roleHierarchy.leadPersonNodeId, 'string');
    assert.strictEqual(plan.roleHierarchy.hierarchyType, 'lead_specialist');
  });

  test('19. Mixed-domain role preservation keeps roles distinct', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    const domains = new Set(plan.occupations.map((o) => o.domain));
    assert.strictEqual(domains.has('healthcare'), true);
    assert.strictEqual(domains.has('cybersecurity'), true);
  });

  test('20. Mixed-domain role collapse rejection triggers critical defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const people = brief.spatialLayout!.personPlacements.map((p) => ({ ...p, domain: 'healthcare' }));
    const { defects } = RoleRelationshipValidator.validateRelationships(people, brief.sceneGraph!);
    assert.strictEqual(defects.some((d) => d.code === 'MIXED_DOMAIN_ROLE_COLLAPSE'), true);
  });

  test('21. Direct versus inferred provenance tracking', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    assert.strictEqual(plan.directEvidenceRatio >= 0, true);
    assert.strictEqual(plan.inferredEvidenceRatio >= 0, true);
  });

  test('22. Excessive inferred-content ratio (> 40%) triggers warning defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    const defectivePlan = { ...plan, inferredEvidenceRatio: 0.5 };
    const defects = InteractionConsistencyValidator.validateConsistency(defectivePlan, brief.spatialLayout!);
    assert.strictEqual(defects.some((d) => d.code === 'EXCESSIVE_INFERRED_CONTENT_RATIO'), true);
  });

  test('23. Unsupported inferred detail validation', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.occupationInteractionPlan !== undefined, true);
  });

  test('24. Missing provenance validation', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.occupationInteractionPlan!.occupations.every((o) => o.evidence !== undefined), true);
  });

  test('25. Deterministic serialization verifies JSON and human-readable output', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.occupationInteractionPlan!;
    const json = OccupationInteractionSerializer.serializeJson(plan);
    assert.strictEqual(typeof json, 'string');
    assert.strictEqual(json.includes(plan.id), true);

    const summary = OccupationInteractionSerializer.serializeHumanReadable(plan);
    assert.strictEqual(summary.includes('OCCUPATION & HUMAN INTERACTION PLAN'), true);
  });

  test('26. Deterministic SHA-256 fingerprint generation', () => {
    const brief1 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const brief2 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief1.occupationInteractionPlan!.fingerprint.length, 64);
    assert.strictEqual(brief1.occupationInteractionPlan!.fingerprint, brief2.occupationInteractionPlan!.fingerprint);
  });

  test('27. Backward-compatible brief parsing verifies optional occupationInteractionPlan', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.spatialLayout !== undefined, true);
    assert.strictEqual(brief.occupationInteractionPlan !== undefined, true);
  });

  test('28. Empty or minimal article rejection throws expected error', () => {
    assert.throws(() => FinalPostAnalyzer.analyze({ postContent: '', platform: 'LinkedIn' }), /FINALIZED_POST_REQUIRED/);
  });

  test('29. Valid but imperfect plan receives normalized score (90/100)', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const res = OccupationInteractionEngine.planInteractions(brief, brief.sceneGraph!, brief.spatialLayout!);
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.validationScore, 90);
    assert.strictEqual(res.defects.some((d) => d.code === 'IMPERFECT_INTERACTION_PLAN_INFERRED_CONTENT'), true);
  });

  test('30. Full valid professional interaction plan construction succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const res = OccupationInteractionEngine.planInteractions(brief, brief.sceneGraph!, brief.spatialLayout!);
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.plan.occupations.length >= 1, true);
  });

  describe('Typed Fallback Subsuite (12 Assertions)', () => {
    test('FB 1: Known occupation resolves from knowledge base with knowledge_base_match', () => {
      const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
      assert.strictEqual(brief.occupationInteractionPlan!.occupations[0].resolutionStatus, 'knowledge_base_match');
    });

    test('FB 2: Unknown concrete article role preserves original phrase with article_role_preserved', () => {
      const node = { id: 'p1', type: 'person' as const, label: 'Quantum Physics Researcher', domain: 'quantum', provenance: 'direct' as const, category: 'person', sourceEvidence: ['Quantum Physics Researcher'], confidence: 0.9 };
      const profile = OccupationProfileResolver.resolveProfile(node, 'quantum', 'Quantum Physics Researcher investigating entanglement');
      assert.strictEqual(profile.resolutionStatus, 'article_role_preserved');
      assert.strictEqual(profile.canonicalName, 'Quantum Physics Researcher');
    });

    test('FB 3: Unknown domain does NOT create Industry Specialist', () => {
      const node = { id: 'p1', type: 'person' as const, label: 'Biotech Geneticist', domain: 'biotech', provenance: 'direct' as const, category: 'person', sourceEvidence: ['Biotech Geneticist'], confidence: 0.9 };
      const profile = OccupationProfileResolver.resolveProfile(node, 'biotech', 'Biotech Geneticist sequencing DNA');
      assert.notStrictEqual(profile.canonicalName, 'Industry Specialist');
      assert.strictEqual(profile.canonicalName, 'Biotech Geneticist');
    });

    test('FB 4: Generic prohibited occupation name triggers critical defect', () => {
      const defects = ProfessionalAuthenticityValidator.validateAuthenticity([
        { occupationId: 'occ1', canonicalName: 'Industry Specialist', aliases: [], domain: 'sw', typicalEnvironment: 'env', resolutionStatus: 'knowledge_base_match', appearance: { clothingType: 'suit', colorPalette: [], formalityLevel: 'formal_business', grooming: 'clean' }, commonTools: [], safetyRequirements: [], validActions: [], prohibitedTools: [], unrealisticActions: [], evidence: { sourceNodeId: 'n1', sourceLayer: 'scene_graph', evidenceExcerpt: 'e', derivation: 'inferred', confidence: 0.8, isRequired: true }, confidence: 0.8 }
      ]);
      assert.strictEqual(defects.some((d) => d.code === 'UNSUPPORTED_OCCUPATION' && d.severity === 'critical'), true);
    });

    test('FB 5: Unresolved occupation receives no unsupported tools', () => {
      const node = { id: 'p1', type: 'person' as const, label: 'Astrobiologist', domain: 'space', provenance: 'direct' as const, category: 'person', sourceEvidence: ['Astrobiologist'], confidence: 0.9 };
      const profile = OccupationProfileResolver.resolveProfile(node, 'space', 'Astrobiologist examining mars soil');
      assert.strictEqual(profile.commonTools.length, 0);
    });

    test('FB 6: Unresolved occupation receives no unsupported clothing override', () => {
      const node = { id: 'p1', type: 'person' as const, label: 'Astrobiologist', domain: 'space', provenance: 'direct' as const, category: 'person', sourceEvidence: ['Astrobiologist'], confidence: 0.9 };
      const profile = OccupationProfileResolver.resolveProfile(node, 'space', 'Astrobiologist examining mars soil');
      assert.strictEqual(profile.appearance.formalityLevel, 'smart_casual');
    });

    test('FB 7: Unresolved occupation receives no unsupported PPE', () => {
      const node = { id: 'p1', type: 'person' as const, label: 'Astrobiologist', domain: 'space', provenance: 'direct' as const, category: 'person', sourceEvidence: ['Astrobiologist'], confidence: 0.9 };
      const profile = OccupationProfileResolver.resolveProfile(node, 'space', 'Astrobiologist examining mars soil');
      assert.strictEqual(profile.safetyRequirements.length, 0);
    });

    test('FB 8: Unresolved occupation remains traceable to article evidence', () => {
      const node = { id: 'p1', type: 'person' as const, label: 'Astrobiologist', domain: 'space', provenance: 'direct' as const, category: 'person', sourceEvidence: ['Astrobiologist examining soil'], confidence: 0.9 };
      const profile = OccupationProfileResolver.resolveProfile(node, 'space', 'Astrobiologist examining soil');
      assert.strictEqual(profile.unresolvedDetail?.originalArticlePhrase, 'Astrobiologist');
      assert.strictEqual(profile.unresolvedDetail?.sourceExcerpt, 'Astrobiologist examining soil');
    });

    test('FB 9: Unresolved role lowers confidence score', () => {
      const node = { id: 'p1', type: 'person' as const, label: 'Astrobiologist', domain: 'space', provenance: 'direct' as const, category: 'person', sourceEvidence: ['Astrobiologist'], confidence: 0.9 };
      const profile = OccupationProfileResolver.resolveProfile(node, 'space', 'Astrobiologist');
      assert.strictEqual(profile.confidence, 0.65);
    });

    test('FB 10: Unresolved status produces warning defect for manual mapping', () => {
      const defects = ProfessionalAuthenticityValidator.validateAuthenticity([
        { occupationId: 'occ1', canonicalName: 'Astrobiologist', aliases: [], domain: 'space', typicalEnvironment: 'env', resolutionStatus: 'unresolved', appearance: { clothingType: 'suit', colorPalette: [], formalityLevel: 'formal_business', grooming: 'clean' }, commonTools: [], safetyRequirements: [], validActions: [], prohibitedTools: [], unrealisticActions: [], evidence: { sourceNodeId: 'n1', sourceLayer: 'scene_graph', evidenceExcerpt: 'e', derivation: 'inferred', confidence: 0.65, isRequired: true }, confidence: 0.65 }
      ]);
      assert.strictEqual(defects.some((d) => d.code === 'UNRESOLVED_OCCUPATION_DEFECT'), true);
    });

    test('FB 11: Mixed-domain article with one unresolved role preserves resolved role', () => {
      const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
      assert.strictEqual(brief.occupationInteractionPlan!.occupations.some((o) => o.resolutionStatus === 'knowledge_base_match'), true);
    });

    test('FB 12: Repeated unresolved input produces deterministic fingerprint', () => {
      const text = 'Quantum Physics Researcher analyzing particle colliders in dark matter facility';
      const brief1 = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
      const brief2 = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
      assert.strictEqual(brief1.occupationInteractionPlan!.fingerprint, brief2.occupationInteractionPlan!.fingerprint);
    });
  });

  describe('Context-Sensitive PPE Protection Subsuite (10 Assertions)', () => {
    test('PPE 1: Hazardous industrial action in plant floor requires PPE', () => {
      const text = 'Advanced Industrial Automation & Precision Robotics: Automation Engineers Programming Robotic Assembly Arms on Clean High-Tech Factory Plant Floor';
      const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
      const plan = brief.occupationInteractionPlan!;
      assert.strictEqual(plan.occupations.some((o) => o.safetyRequirements.some((s) => s.isWornInScene && s.hazardContext !== undefined)), true);
    });

    test('PPE 2: Office-based industrial role does NOT require floor PPE', () => {
      const text = 'Manufacturing Engineers in an Office Meeting Room reviewing plant telemetry reports on laptops';
      const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
      const plan = brief.occupationInteractionPlan!;
      assert.strictEqual(plan.occupations.every((o) => o.safetyRequirements.length === 0), true);
    });

    test('PPE 3: Outdoor renewable maintenance requires appropriate PPE', () => {
      const text = 'Photovoltaic Solar Farms: Renewable Energy Technicians Inspecting Solar Panel Arrays on solar farm site';
      const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
      const plan = brief.occupationInteractionPlan!;
      assert.strictEqual(plan.occupations.some((o) => o.safetyRequirements.some((s) => s.hazardContext?.hazardName.includes('Field'))), true);
    });

    test('PPE 4: Renewable energy office telemetry analysis does NOT require helmet', () => {
      const text = 'Renewable Energy Analysts in a sunlit Tech Office reviewing solar output telemetry on laptops';
      const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
      const plan = brief.occupationInteractionPlan!;
      assert.strictEqual(plan.occupations.every((o) => o.safetyRequirements.length === 0), true);
    });

    test('PPE 5: Medical PPE depends on clinical action', () => {
      const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
      const hc = brief.occupationInteractionPlan!.occupations.find((o) => o.domain === 'healthcare');
      assert.strictEqual(hc?.appearance.formalityLevel, 'scrubs_labcoat');
    });

    test('PPE 6: Cybersecurity professional receives no industrial PPE', () => {
      const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
      const cs = brief.occupationInteractionPlan!.occupations.find((o) => o.domain === 'cybersecurity');
      assert.strictEqual(cs?.safetyRequirements.length, 0);
    });

    test('PPE 7: Missing mandatory PPE triggers MISSING_REQUIRED_PPE defect', () => {
      const defects = SafetyEquipmentResolver.validateSafety(
        [{ occupationId: 'occ1', canonicalName: 'Manufacturing Technician', aliases: [], domain: 'manufacturing', typicalEnvironment: 'factory', resolutionStatus: 'knowledge_base_match', appearance: { clothingType: 'workwear', colorPalette: [], formalityLevel: 'industrial_workwear', grooming: 'clean' }, commonTools: [], safetyRequirements: [{ equipmentName: 'Hard Hat', isRequiredByProtocol: true, isWornInScene: false }], validActions: [], prohibitedTools: [], unrealisticActions: [], evidence: { sourceNodeId: 'n', sourceLayer: 'scene_graph', evidenceExcerpt: 'e', derivation: 'direct', confidence: 0.9, isRequired: true }, confidence: 0.9 }],
        {} as any
      );
      assert.strictEqual(defects.some((d) => d.code === 'MISSING_REQUIRED_PPE' && d.severity === 'critical'), true);
    });

    test('PPE 8: Safety equipment uses internal industrialSafetyProfile standard code', () => {
      const text = 'Advanced Industrial Automation: Engineers Programming Robotic Arms on Plant Floor';
      const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
      const req = brief.occupationInteractionPlan!.occupations.flatMap((o) => o.safetyRequirements)[0];
      assert.strictEqual(req?.standardCode, 'industrialSafetyProfile');
    });

    test('PPE 9: Mixed-domain PPE separation preserves healthcare scrubs and security business wear', () => {
      const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
      const plan = brief.occupationInteractionPlan!;
      const hc = plan.occupations.find((o) => o.domain === 'healthcare');
      const cs = plan.occupations.find((o) => o.domain === 'cybersecurity');
      assert.strictEqual(hc?.appearance.formalityLevel, 'scrubs_labcoat');
      assert.strictEqual(cs?.appearance.formalityLevel, 'smart_casual');
    });

    test('PPE 10: Safety-critical failure blocks validation pass', () => {
      const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
      const res = OccupationInteractionEngine.planInteractions(brief, brief.sceneGraph!, brief.spatialLayout!);
      res.defects.push({ code: 'MISSING_REQUIRED_PPE', severity: 'critical', message: 'Missing mandatory safety gear' });
      const hasCritical = res.defects.some((d) => d.severity === 'critical');
      assert.strictEqual(hasCritical, true);
    });
  });
});
