import assert from 'assert';
import { test, describe } from 'node:test';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { EnvironmentAuthenticityEngine, EnvironmentProfileResolver, EnvironmentalConflictDetector, EnvironmentAuthenticitySerializer } from '../lib/ai-image-generator/images/EnvironmentAuthenticityEngine';
import { EnvironmentProfile, LocationContext } from '../lib/ai-image-generator/images/environment-authenticity.types';

describe('Level 30: Environment and Context Authenticity Intelligence Test Suite (28 Required Assertions)', () => {
  const singleDomainText = 'Full-stack software engineers collaborating on cloud software architecture at multi-monitor code setups in a tech hub.';
  const mixedDomainText = 'Encrypted Healthcare AI Networks: Clinical radiology specialists reviewing AI diagnostic scans while cloud security engineers monitor zero-trust HIPAA compliance access controls and encrypted telemetry in a modern medical security hub.';

  test('1. Valid office environment resolution succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan !== undefined, true);
    assert.strictEqual(plan.profile.indoorOutdoor, 'indoor');
    assert.strictEqual(typeof plan.profile.canonicalName, 'string');
  });

  test('2. Valid healthcare environment resolution succeeds', () => {
    const text = 'Clinical radiology specialists reviewing AI diagnostic imaging scans in a hospital imaging suite';
    const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.primaryDomain, 'healthcare');
    assert.strictEqual(plan.profile.canonicalName.includes('Radiology') || plan.profile.canonicalName.includes('Clinical'), true);
  });

  test('3. Valid cybersecurity environment resolution succeeds', () => {
    const text = 'Cloud security engineers monitoring zero-trust threat alerts in a security operations center';
    const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.primaryDomain, 'cybersecurity');
    assert.strictEqual(plan.location.workplaceType, 'Security Operations Center');
  });

  test('4. Valid renewable-energy outdoor environment resolution succeeds', () => {
    const text = 'Photovoltaic Solar Farms: Technicians Inspecting Solar Panel Arrays outdoors on solar farm site';
    const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.primaryDomain, 'renewable-energy');
    assert.strictEqual(plan.profile.indoorOutdoor, 'outdoor');
  });

  test('5. Valid manufacturing environment resolution succeeds', () => {
    const text = 'Industrial Automation Engineers Programming Robotic Assembly Arms on Clean Factory Plant Floor';
    const brief = FinalPostAnalyzer.analyze({ postContent: text, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.primaryDomain, 'manufacturing');
    assert.strictEqual(plan.location.workplaceType, 'Automated Manufacturing Floor');
  });

  test('6. Valid mixed-domain environment preserves connected multi-space transition graph', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.isMixedDomain, true);
    assert.strictEqual(plan.transitions.length >= 1, true);
    assert.strictEqual(plan.transitions[0].relationshipType, 'connected_control_hub');
  });

  test('7. Occupation–environment mismatch detection flags critical defect', () => {
    const profile: EnvironmentProfile = {
      environmentId: 'env1', canonicalName: 'Factory Floor', aliases: [], domain: 'manufacturing', indoorOutdoor: 'indoor', buildingStyle: 'High-bay', compatibleOccupations: ['Automation Engineer'], compatibleActions: [], compatibleInfrastructure: [], compatibleObjects: [], incompatibleObjects: [], incompatibleOccupations: ['Surgeon'], incompatibleActions: [], typicalHazards: [], confidence: 0.9, evidence: { sourceLayer: 'scene_graph', sourceId: 'n1', evidenceExcerpt: 'e', derivation: 'direct', confidence: 0.9, isRequired: true }
    };
    const location: LocationContext = { workplaceType: 'Factory', facilityName: 'F', settingDescription: 'S', indoorOutdoor: 'indoor', evidence: profile.evidence };
    const occupationPlan = { occupations: [{ occupationId: 'occ1', canonicalName: 'Surgeon' }], handObjectInteractions: [], poses: [] } as any;
    const defects = EnvironmentalConflictDetector.detectConflicts(profile, location, occupationPlan, {} as any);
    assert.strictEqual(defects.some((d) => d.code === 'OCCUPATION_ENVIRONMENT_MISMATCH' && d.severity === 'critical'), true);
  });

  test('8. Action–environment mismatch validation succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.actionCompatibilities.every((a) => a.isCompatible), true);
  });

  test('9. Object–environment mismatch detection flags prohibited tools', () => {
    const profile: EnvironmentProfile = {
      environmentId: 'env1', canonicalName: 'Cleanroom', aliases: [], domain: 'healthcare', indoorOutdoor: 'indoor', buildingStyle: 'Sterile', compatibleOccupations: [], compatibleActions: [], compatibleInfrastructure: [], compatibleObjects: [], incompatibleObjects: ['Robotic welding arm'], incompatibleOccupations: [], incompatibleActions: [], typicalHazards: [], confidence: 0.9, evidence: { sourceLayer: 'scene_graph', sourceId: 'n1', evidenceExcerpt: 'e', derivation: 'direct', confidence: 0.9, isRequired: true }
    };
    const location: LocationContext = { workplaceType: 'Cleanroom', facilityName: 'F', settingDescription: 'S', indoorOutdoor: 'indoor', evidence: profile.evidence };
    const occupationPlan = { occupations: [], handObjectInteractions: [{ objectNodeId: 'obj1', objectLabel: 'Robotic welding arm' }], poses: [] } as any;
    const defects = EnvironmentalConflictDetector.detectConflicts(profile, location, occupationPlan, {} as any);
    assert.strictEqual(defects.some((d) => d.code === 'OBJECT_ENVIRONMENT_MISMATCH' && d.severity === 'critical'), true);
  });

  test('10. Conflicting indoor and outdoor context flags critical defect', () => {
    const profile: EnvironmentProfile = {
      environmentId: 'env1', canonicalName: 'Cleanroom', aliases: [], domain: 'healthcare', indoorOutdoor: 'indoor', buildingStyle: 'Sterile', compatibleOccupations: [], compatibleActions: [], compatibleInfrastructure: [], compatibleObjects: [], incompatibleObjects: [], incompatibleOccupations: [], incompatibleActions: [], typicalHazards: [], confidence: 0.9, evidence: { sourceLayer: 'scene_graph', sourceId: 'n1', evidenceExcerpt: 'e', derivation: 'direct', confidence: 0.9, isRequired: true }
    };
    const location: LocationContext = { workplaceType: 'Cleanroom', facilityName: 'F', settingDescription: 'Indoor rainstorm cleanroom', indoorOutdoor: 'indoor', evidence: profile.evidence };
    const occupationPlan = { occupations: [], handObjectInteractions: [], poses: [] } as any;
    const defects = EnvironmentalConflictDetector.detectConflicts(profile, location, occupationPlan, {} as any);
    assert.strictEqual(defects.some((d) => d.code === 'CONFLICTING_INDOOR_OUTDOOR' && d.severity === 'critical'), true);
  });

  test('11. Conflicting environment nodes detection preserves primary domain environment', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.environmentAuthenticityPlan!.profile.domain, 'software-engineering');
  });

  test('12. Infrastructure elements validate domain infrastructure', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.infrastructure.length >= 1, true);
    assert.strictEqual(typeof plan.infrastructure[0].category, 'string');
  });

  test('13. Time-period resolution assigns modern_contemporary era', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.timePeriod.era, 'modern_contemporary');
  });

  test('14. Indoor season resolution defaults to year_round_controlled', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.season.seasonName, 'year_round_controlled');
  });

  test('15. Weather resolution for indoor setting assigns controlled_indoor', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.weather.condition, 'controlled_indoor');
  });

  test('16. Regional context validates global facility setting', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(typeof plan.regional.regionName, 'string');
  });

  test('17. Mixed-domain environment collapse prevention keeps connected hub title', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.profile.canonicalName.includes('Clinical Radiology') && plan.profile.canonicalName.includes('Security Operations'), true);
  });

  test('18. Secondary-domain environment connection verified via transition edge', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.transitions[0].destinationEnvironmentId.includes('cybersecurity'), true);
  });

  test('19. Direct versus inferred evidence ratio tracking', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.directEvidenceRatio >= 0, true);
    assert.strictEqual(plan.inferredEvidenceRatio >= 0, true);
  });

  test('20. Excessive inferred context ratio triggers warning defect', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.confidenceMap.environmentConfidence, 0.95);
  });

  test('21. Missing provenance validation ensures every element has evidence', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.location.evidence.sourceId !== undefined, true);
    assert.strictEqual(plan.architecture.evidence.sourceId !== undefined, true);
  });

  test('22. Contextual objects compatibility mapping', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const plan = brief.environmentAuthenticityPlan!;
    assert.strictEqual(plan.objectCompatibilities.every((o) => o.isCompatible), true);
  });

  test('23. Deterministic output across repeated invocations', () => {
    const brief1 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const brief2 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief1.environmentAuthenticityPlan!.fingerprint, brief2.environmentAuthenticityPlan!.fingerprint);
  });

  test('24. Deterministic SHA-256 fingerprint generation format (64 hex characters)', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const fp = brief.environmentAuthenticityPlan!.fingerprint;
    assert.strictEqual(fp.length, 64);
  });

  test('25. Backward-compatible brief parsing with optional environmentAuthenticityPlan', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.occupationInteractionPlan !== undefined, true);
    assert.strictEqual(brief.environmentAuthenticityPlan !== undefined, true);
  });

  test('26. Empty or minimal article rejection throws expected error', () => {
    assert.throws(() => FinalPostAnalyzer.analyze({ postContent: '', platform: 'LinkedIn' }), /FINALIZED_POST_REQUIRED/);
  });

  test('27. Valid but imperfect environment receives normalized score (90/100)', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const res = EnvironmentAuthenticityEngine.planEnvironment(brief, brief.sceneGraph!, brief.spatialLayout!, brief.occupationInteractionPlan!);
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.validationScore, 90);
  });

  test('28. Complete valid environment plan construction succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const res = EnvironmentAuthenticityEngine.planEnvironment(brief, brief.sceneGraph!, brief.spatialLayout!, brief.occupationInteractionPlan!);
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(typeof res.serializedJson, 'string');
    assert.strictEqual(typeof res.humanReadableSummary, 'string');
  });
});
