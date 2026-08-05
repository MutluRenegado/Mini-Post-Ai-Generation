import crypto from 'crypto';
import { VisualIntelligenceBrief } from './visual-intelligence.types';
import { SceneGraph, SceneNode, SceneEdge } from './scene-graph.types';
import { SpatialLayout, EntityPlacement } from './spatial-reasoning.types';
import {
  HandSide,
  BodyPosture,
  GestureType,
  GazeTargetType,
  RoleHierarchyType,
  OccupationResolutionStatus,
  UnresolvedOccupationDetail,
  HazardContext,
  OccupationEvidence,
  ProfessionalAppearance,
  SafetyRequirement,
  ProfessionalTool,
  ProfessionalAction,
  OccupationProfile,
  HumanPose,
  GesturePlan,
  GazePlan,
  HandObjectInteraction,
  HumanRelationship,
  RoleHierarchy,
  InteractionValidationDefect,
  OccupationInteractionPlan,
  OccupationInteractionResult,
} from './occupation-interaction.types';
import { OccupationInteractionResultSchema } from './occupation-interaction.schema';

export class OccupationKnowledgeBase {
  private static profiles: Record<string, Partial<OccupationProfile>> = {
    'software-engineering': {
      canonicalName: 'Full-Stack Software Engineer',
      aliases: ['Software engineer', 'AI developer', 'Developer', 'Code architect'],
      domain: 'software-engineering',
      typicalEnvironment: 'Modern sunlit tech office / AI lab',
      appearance: {
        clothingType: 'Smart casual hoodie or polo shirt with jeans',
        colorPalette: ['navy', 'dark grey', 'black'],
        formalityLevel: 'smart_casual',
        grooming: 'Clean professional attire',
      },
      prohibitedTools: ['stethoscope', 'hard hat', 'container shipping crane', 'stethoscope'],
      unrealisticActions: ['performing medical surgery', 'inspecting wind turbine blades outdoors without harness'],
    },
    healthcare: {
      canonicalName: 'Radiologist',
      aliases: ['Radiologist', 'Clinical radiology specialist', 'Medical doctor', 'Specialist physician'],
      domain: 'healthcare',
      typicalEnvironment: 'Clinical radiology suite / diagnostic lab',
      appearance: {
        clothingType: 'Dark blue medical scrubs with white laboratory coat',
        colorPalette: ['white', 'blue', 'teal'],
        formalityLevel: 'scrubs_labcoat',
        grooming: 'Tidy clinical presentation',
      },
      prohibitedTools: ['welding torch', 'hard hat', 'server rack mounting kit'],
      unrealisticActions: ['climbing solar panel scaffolding', 'programming industrial robotics arms'],
    },
    cybersecurity: {
      canonicalName: 'Cybersecurity Analyst',
      aliases: ['Cybersecurity analyst', 'Cloud security engineer', 'SOC threat intelligence specialist'],
      domain: 'cybersecurity',
      typicalEnvironment: 'Enterprise Security Operations Center (SOC) hub',
      appearance: {
        clothingType: 'Professional business casual shirt and trousers',
        colorPalette: ['charcoal', 'slate grey', 'navy'],
        formalityLevel: 'smart_casual',
        grooming: 'Clean professional appearance',
      },
      prohibitedTools: ['welding torch', 'solar panel tester', 'industrial CNC router'],
      unrealisticActions: ['administering medication', 'climbing wind turbines'],
    },
    'renewable-energy': {
      canonicalName: 'Renewable Energy Technician',
      aliases: ['Renewable energy technician', 'Solar installation engineer', 'Wind turbine specialist'],
      domain: 'renewable-energy',
      typicalEnvironment: 'Outdoor solar farm / offshore wind turbine grid',
      appearance: {
        clothingType: 'High-visibility safety vest, durable work trousers, and steel-toe boots',
        colorPalette: ['hi-vis orange', 'yellow', 'navy'],
        formalityLevel: 'safety_gear',
        grooming: 'Field technical workwear',
      },
      prohibitedTools: ['stethoscope', 'hospital MRI screen'],
      unrealisticActions: ['reviewing clinical diagnostic scans'],
    },
    trade: {
      canonicalName: 'Export Logistics Manager',
      aliases: ['Export logistics manager', 'Trade finance specialist', 'Logistics director'],
      domain: 'trade',
      typicalEnvironment: 'Commercial shipping port logistics office',
      appearance: {
        clothingType: 'Formal tailored business suit or executive shirt with port safety hard hat',
        colorPalette: ['navy blue', 'grey', 'white'],
        formalityLevel: 'formal_business',
        grooming: 'Executive business presentation',
      },
      prohibitedTools: ['stethoscope', 'robotic arm teaching pendant'],
      unrealisticActions: ['performing open-heart surgery'],
    },
    education: {
      canonicalName: 'STEM Educator / Professor',
      aliases: ['University professor', 'STEM educator', 'Instructional technologist'],
      domain: 'education',
      typicalEnvironment: 'Modern university collaborative STEM classroom',
      appearance: {
        clothingType: 'Professional tweed blazer or smart button-down shirt with trousers',
        colorPalette: ['beige', 'navy', 'brown'],
        formalityLevel: 'smart_casual',
        grooming: 'Academic professional attire',
      },
      prohibitedTools: ['welding mask', 'stethoscope'],
      unrealisticActions: ['operating heavy construction cranes'],
    },
    manufacturing: {
      canonicalName: 'Industrial Automation Engineer',
      aliases: ['Industrial automation engineer', 'Robotics technician', 'Factory floor manager'],
      domain: 'manufacturing',
      typicalEnvironment: 'Clean high-tech automated manufacturing plant floor',
      appearance: {
        clothingType: 'Antistatic plant polo shirt, protective safety glasses, and industrial workwear',
        colorPalette: ['blue', 'grey', 'black'],
        formalityLevel: 'industrial_workwear',
        grooming: 'Clean technical plant presentation',
      },
      prohibitedTools: ['stethoscope', 'financial ledger'],
      unrealisticActions: ['diagnosing patient X-ray scans'],
    },
  };

  public static getKnowledge(domain: string): Partial<OccupationProfile> | null {
    return this.profiles[domain.toLowerCase()] || null;
  }
}

export class OccupationProfileResolver {
  public static resolveProfile(
    personNode: SceneNode,
    domain: string,
    articleText: string
  ): OccupationProfile {
    const kb = OccupationKnowledgeBase.getKnowledge(domain);
    const isDirect = personNode.provenance === 'direct';
    const textLower = articleText.toLowerCase();

    let resolutionStatus: OccupationResolutionStatus = 'knowledge_base_match';
    let unresolvedDetail: UnresolvedOccupationDetail | undefined = undefined;
    let confidence = isDirect ? 0.95 : 0.70;

    const canonicalName = personNode.label || kb?.canonicalName || 'Unresolved Role';

    if (!kb) {
      resolutionStatus = 'article_role_preserved';
      confidence = 0.65;
      unresolvedDetail = {
        originalArticlePhrase: personNode.label,
        sourceExcerpt: personNode.sourceEvidence?.[0] || personNode.label,
        confidence: 0.65,
        domainCandidates: [domain],
        missingKnowledgeFields: ['typicalEnvironment', 'prohibitedTools', 'unrealisticActions'],
        safeOptionalDefaults: { clothingType: 'Smart professional attire' },
        prohibitedAssumptions: ['Do not assume specific medical or industrial PPE without evidence'],
        validationStatus: 'valid_preserved',
      };
    }

    const commonTools: ProfessionalTool[] = kb
      ? [
          {
            toolId: `tool_${personNode.id}_primary`,
            label: `${domain} workstation terminal`,
            category: 'digital_screen',
            isDirectEvidence: isDirect,
            confidence,
            mountingType: 'desk-mounted',
          },
        ]
      : [];

    const isFieldOrPlantOperation =
      textLower.includes('plant floor') ||
      textLower.includes('solar farm') ||
      textLower.includes('wind turbine') ||
      textLower.includes('factory') ||
      textLower.includes('assembly arm') ||
      textLower.includes('inspecting');

    const isOfficeEnvironment =
      textLower.includes('office') ||
      textLower.includes('meeting room') ||
      textLower.includes('classroom') ||
      textLower.includes('telemetry review');

    const safetyRequirements: SafetyRequirement[] = [];
    if ((domain === 'renewable-energy' || domain === 'manufacturing') && isFieldOrPlantOperation && !isOfficeEnvironment) {
      safetyRequirements.push({
        equipmentName: 'Safety helmet and protective eyewear',
        isRequiredByProtocol: true,
        standardCode: 'industrialSafetyProfile',
        isWornInScene: true,
        hazardContext: {
          hazardName: 'Industrial / Field Active Equipment Exposure',
          occupation: canonicalName,
          action: `Field / Plant operations in ${domain}`,
          environment: domain === 'manufacturing' ? 'High-tech factory plant floor' : 'Outdoor renewable solar/wind site',
          safetyRule: 'industrialSafetyProfile',
          provenance: 'knowledge_base_inferred',
          confidence: 0.9,
          isRequired: true,
        },
      });
    }

    const validActions: ProfessionalAction[] = [
      {
        actionId: `act_${personNode.id}_primary`,
        label: `Analyzing ${domain} operations`,
        actionType: 'analyzing',
        isRealizedInPose: true,
        confidence,
      },
    ];

    return {
      occupationId: `occ_${personNode.id}`,
      canonicalName,
      aliases: kb?.aliases || [personNode.label],
      domain,
      typicalEnvironment: kb?.typicalEnvironment || 'Professional workspace',
      resolutionStatus,
      unresolvedDetail,
      appearance: kb?.appearance || {
        clothingType: 'Smart professional attire',
        colorPalette: ['navy', 'grey'],
        formalityLevel: 'smart_casual',
        grooming: 'Clean professional presentation',
      },
      commonTools,
      safetyRequirements,
      validActions,
      prohibitedTools: kb?.prohibitedTools || [],
      unrealisticActions: kb?.unrealisticActions || [],
      evidence: {
        sourceNodeId: personNode.id,
        sourceLayer: isDirect ? 'finalized_article' : 'scene_graph',
        evidenceExcerpt: personNode.sourceEvidence?.[0] || `Resolved occupation for ${personNode.label}`,
        derivation: isDirect ? 'direct' : 'inferred',
        confidence,
        isRequired: true,
      },
      confidence,
    };
  }
}

export class ProfessionalAuthenticityValidator {
  public static validateAuthenticity(profiles: OccupationProfile[]): InteractionValidationDefect[] {
    const defects: InteractionValidationDefect[] = [];
    const genericProhibited = [
      'industry specialist',
      'business professional',
      'technical expert',
      'office worker',
      'generic engineer',
      'generic healthcare worker',
    ];

    for (const prof of profiles) {
      if (!prof.canonicalName || prof.canonicalName.length === 0) {
        defects.push({
          code: 'UNSUPPORTED_OCCUPATION',
          severity: 'critical',
          message: `Occupation node ${prof.occupationId} has no valid canonical name.`,
        });
      }

      if (genericProhibited.includes(prof.canonicalName.toLowerCase())) {
        defects.push({
          code: 'UNSUPPORTED_OCCUPATION',
          severity: 'critical',
          message: `Generic fallback occupation "${prof.canonicalName}" is prohibited without explicit article support.`,
        });
      }

      if (prof.resolutionStatus === 'unresolved') {
        defects.push({
          code: 'UNRESOLVED_OCCUPATION_DEFECT',
          severity: 'warning',
          message: `Occupation "${prof.canonicalName}" is unresolved and flagged for manual domain mapping.`,
        });
      }

      if (prof.evidence.derivation === 'inferred' && prof.confidence < 0.5) {
        defects.push({
          code: 'INVALID_CONFIDENCE',
          severity: 'warning',
          message: `Occupation ${prof.canonicalName} has invalid low confidence (${prof.confidence}).`,
        });
      }
    }

    return defects;
  }
}

export class SafetyEquipmentResolver {
  public static validateSafety(
    profiles: OccupationProfile[],
    spatialLayout: SpatialLayout
  ): InteractionValidationDefect[] {
    const defects: InteractionValidationDefect[] = [];

    for (const prof of profiles) {
      for (const req of prof.safetyRequirements) {
        if (req.isRequiredByProtocol && !req.isWornInScene) {
          defects.push({
            code: 'MISSING_REQUIRED_PPE',
            severity: 'critical',
            message: `Occupation "${prof.canonicalName}" is missing mandatory safety equipment: ${req.equipmentName}.`,
            nodeId: prof.occupationId,
          });
        }
      }
    }

    return defects;
  }
}

export class OccupationToolMatcher {
  public static matchTools(
    profile: OccupationProfile,
    objectPlacements: EntityPlacement[]
  ): InteractionValidationDefect[] {
    const defects: InteractionValidationDefect[] = [];

    for (const obj of objectPlacements) {
      const objLabelLower = obj.label.toLowerCase();

      for (const prohibited of profile.prohibitedTools) {
        if (objLabelLower.includes(prohibited.toLowerCase())) {
          defects.push({
            code: 'UNRELATED_TOOL',
            severity: 'critical',
            message: `Occupation "${profile.canonicalName}" assigned unrelated/prohibited tool "${obj.label}".`,
            nodeId: obj.nodeId,
          });
        }
      }
    }

    return defects;
  }
}

export class HumanInteractionPlanner {
  public static planPose(placement: EntityPlacement): HumanPose {
    const isHero = placement.nodeId.includes('hero');

    let posture: BodyPosture = 'standing_focused';
    if (placement.position.y > 0.6) {
      posture = 'seated_at_workstation';
    } else if (isHero) {
      posture = 'gesturing_collaboratively';
    }

    return {
      personNodeId: placement.nodeId,
      occupationName: placement.label,
      posture,
      armPlacement: isHero ? 'Right arm extended gesturing toward display' : 'Hands resting comfortably at desk surface',
      headOrientation: 'Turned 15 degrees toward primary focal screen',
    };
  }
}

export class GesturePlanner {
  public static planGesture(placement: EntityPlacement): GesturePlan {
    const isHero = placement.nodeId.includes('hero');

    return {
      personNodeId: placement.nodeId,
      gesture: isHero ? 'pointing_at_display' : 'explaining_with_open_palms',
      primaryHand: 'right_hand',
      description: isHero ? 'Pointing at diagnostic display telemetry' : 'Open palm explanation gesture',
    };
  }
}

export class GazeDirectionPlanner {
  public static planGaze(
    placement: EntityPlacement,
    objectPlacements: EntityPlacement[],
    otherPeople: EntityPlacement[]
  ): GazePlan {
    const targetObj = objectPlacements.find((o) => o.reachability?.ownerNodeId === placement.nodeId) || objectPlacements[0];

    if (targetObj) {
      return {
        personNodeId: placement.nodeId,
        targetType: 'screen_display',
        targetNodeId: targetObj.nodeId,
        targetLabel: targetObj.label,
        eyeContactState: 'focused_on_target',
      };
    }

    const peer = otherPeople.find((p) => p.nodeId !== placement.nodeId);
    if (peer) {
      return {
        personNodeId: placement.nodeId,
        targetType: 'collaborator_face',
        targetNodeId: peer.nodeId,
        targetLabel: peer.label,
        eyeContactState: 'direct_eye_contact',
      };
    }

    return {
      personNodeId: placement.nodeId,
      targetType: 'workspace_ahead',
      targetLabel: 'Workspace area',
      eyeContactState: 'observing_workspace',
    };
  }
}

export class HandObjectInteractionPlanner {
  public static planInteractions(
    people: EntityPlacement[],
    objects: EntityPlacement[]
  ): HandObjectInteraction[] {
    const interactions: HandObjectInteraction[] = [];

    objects.forEach((obj, idx) => {
      const ownerId = obj.reachability?.ownerNodeId || people[0]?.nodeId;
      if (ownerId) {
        interactions.push({
          personNodeId: ownerId,
          objectNodeId: obj.nodeId,
          objectLabel: obj.label,
          handSide: idx % 2 === 0 ? 'right_hand' : 'left_hand',
          gripType: obj.label.toLowerCase().includes('screen') ? 'touching_screen' : 'holding',
          isReachable: obj.reachability?.isReachable !== false,
          distanceMeters: obj.reachability?.distanceToOwner || 0.45,
        });
      }
    });

    return interactions;
  }
}

export class RoleRelationshipValidator {
  public static validateRelationships(
    people: EntityPlacement[],
    sceneGraph: SceneGraph
  ): { relationships: HumanRelationship[]; hierarchy: RoleHierarchy; defects: InteractionValidationDefect[] } {
    const defects: InteractionValidationDefect[] = [];
    const relationships: HumanRelationship[] = [];

    const hero = people.find((p) => p.nodeId === sceneGraph.heroNodeId) || people[0];
    const supporting = people.filter((p) => p.nodeId !== hero?.nodeId).map((p) => p.nodeId);

    const hierarchy: RoleHierarchy = {
      leadPersonNodeId: hero?.nodeId || 'hero_node',
      supportingPersonNodeIds: supporting,
      hierarchyType: 'lead_specialist',
    };

    if (sceneGraph.isMixedDomain && people.length >= 2) {
      const p1 = people[0];
      const p2 = people[1];

      if (p1.domain === p2.domain) {
        defects.push({
          code: 'MIXED_DOMAIN_ROLE_COLLAPSE',
          severity: 'critical',
          message: `Mixed domain layout collapsed separate roles into single domain "${p1.domain}".`,
        });
      }

      relationships.push({
        sourcePersonNodeId: p1.nodeId,
        targetPersonNodeId: p2.nodeId,
        relationshipType: 'cross_domain_connects',
        description: `Cross-domain collaboration between ${p1.label} (${p1.domain}) and ${p2.label} (${p2.domain})`,
        domainBridge: true,
      });
    }

    return { relationships, hierarchy, defects };
  }
}

export class InteractionConsistencyValidator {
  public static validateConsistency(
    plan: OccupationInteractionPlan,
    spatialLayout: SpatialLayout
  ): InteractionValidationDefect[] {
    const defects: InteractionValidationDefect[] = [];

    // 1. Unreachable object interaction
    for (const inter of plan.handObjectInteractions) {
      if (!inter.isReachable || inter.distanceMeters > 1.2) {
        defects.push({
          code: 'UNREACHABLE_OBJECT_INTERACTION',
          severity: 'warning',
          message: `Interaction between person ${inter.personNodeId} and object ${inter.objectLabel} exceeds reachable distance (${inter.distanceMeters}m).`,
          nodeId: inter.objectNodeId,
        });
      }
    }

    // 2. Conflicting hand assignments (same person, same hand used for > 2 objects simultaneously)
    const handMap = new Map<string, number>();
    for (const inter of plan.handObjectInteractions) {
      const key = `${inter.personNodeId}:${inter.handSide}`;
      const count = (handMap.get(key) || 0) + 1;
      handMap.set(key, count);
      if (count > 2) {
        defects.push({
          code: 'CONFLICTING_HAND_ASSIGNMENTS',
          severity: 'warning',
          message: `Person ${inter.personNodeId} assigned conflicting simultaneous hand interactions on ${inter.handSide}.`,
          nodeId: inter.personNodeId,
        });
      }
    }

    // 3. Contradictory gaze direction
    for (const gaze of plan.gazes) {
      if (gaze.targetType === 'collaborator_face' && gaze.eyeContactState === 'observing_workspace') {
        defects.push({
          code: 'CONTRADICTORY_GAZE_DIRECTION',
          severity: 'warning',
          message: `Gaze plan for ${gaze.personNodeId} has contradictory gaze target and eye contact state.`,
          nodeId: gaze.personNodeId,
        });
      }
    }

    // 4. Excessive inferred content ratio (> 40%)
    if (plan.inferredEvidenceRatio > 0.4) {
      defects.push({
        code: 'EXCESSIVE_INFERRED_CONTENT_RATIO',
        severity: 'warning',
        message: `Inferred evidence ratio (${Math.round(plan.inferredEvidenceRatio * 100)}%) exceeds 40% threshold.`,
      });
    }

    return defects;
  }
}

export class OccupationInteractionSerializer {
  public static serializeJson(plan: OccupationInteractionPlan): string {
    return JSON.stringify(plan, null, 2);
  }

  public static serializeHumanReadable(plan: OccupationInteractionPlan): string {
    const lines: string[] = [];
    lines.push(`OCCUPATION & HUMAN INTERACTION PLAN [${plan.id}] - Primary Domain: ${plan.primaryDomain}${plan.isMixedDomain ? ' + ' + plan.secondaryDomain : ''}`);
    lines.push(`Occupations (${plan.occupations.length}):`);
    for (const occ of plan.occupations) {
      lines.push(`  - ${occ.canonicalName} (${occ.domain}) - Formality: ${occ.appearance.formalityLevel}, Derivation: ${occ.evidence.derivation}`);
    }
    lines.push(`Poses & Gestures (${plan.poses.length}):`);
    for (const pose of plan.poses) {
      const gesture = plan.gestures.find((g) => g.personNodeId === pose.personNodeId);
      lines.push(`  - Person [${pose.personNodeId}] (${pose.occupationName}): Posture: ${pose.posture}, Gesture: ${gesture?.gesture || 'none'}`);
    }
    lines.push(`Relationships (${plan.relationships.length}):`);
    for (const rel of plan.relationships) {
      lines.push(`  - ${rel.sourcePersonNodeId} -> ${rel.relationshipType} -> ${rel.targetPersonNodeId} (${rel.description})`);
    }
    return lines.join('\n');
  }
}

export class OccupationInteractionEngine {
  public static planInteractions(
    brief: VisualIntelligenceBrief,
    sceneGraph: SceneGraph,
    spatialLayout: SpatialLayout
  ): OccupationInteractionResult {
    if (!brief || !brief.id) {
      throw new Error('INVALID_INTERACTION_INPUT: VisualIntelligenceBrief is required for interaction planning.');
    }
    if (!sceneGraph || !sceneGraph.id) {
      throw new Error('INVALID_INTERACTION_INPUT: SceneGraph is required for interaction planning.');
    }
    if (!spatialLayout || !spatialLayout.id) {
      throw new Error('INVALID_INTERACTION_INPUT: SpatialLayout is required for interaction planning.');
    }

    const timestamp = new Date().toISOString();
    const articleText = brief.sanitizedSourceSummary || brief.centralMessage || '';

    const personPlacements = spatialLayout.personPlacements;
    const objectPlacements = spatialLayout.objectPlacements;

    // 1. Resolve Occupation Profiles
    const occupations: OccupationProfile[] = personPlacements.map((p) =>
      OccupationProfileResolver.resolveProfile(
        sceneGraph.nodes.find((n) => n.id === p.nodeId) || {
          id: p.nodeId,
          type: 'person',
          label: p.label,
          domain: p.domain,
          provenance: p.provenance === 'structural' ? 'inferred' : p.provenance,
          category: 'person',
          sourceEvidence: [p.placementProvenance?.evidenceExcerpt || p.label],
          confidence: p.placementProvenance?.confidence || 0.8,
        },
        p.domain,
        articleText
      )
    );

    // 2. Plan Poses & Gestures
    const poses: HumanPose[] = personPlacements.map((p) => HumanInteractionPlanner.planPose(p));
    const gestures: GesturePlan[] = personPlacements.map((p) => GesturePlanner.planGesture(p));
    const gazes: GazePlan[] = personPlacements.map((p) => GazeDirectionPlanner.planGaze(p, objectPlacements, personPlacements));

    // 3. Plan Hand & Object Interactions
    const handObjectInteractions: HandObjectInteraction[] = HandObjectInteractionPlanner.planInteractions(personPlacements, objectPlacements);

    // 4. Resolve Relationships & Hierarchy
    const { relationships, hierarchy, defects: relDefects } = RoleRelationshipValidator.validateRelationships(personPlacements, sceneGraph);

    // Provenance Ratios
    const directCount = occupations.filter((o) => o.evidence.derivation === 'direct').length;
    const inferredCount = occupations.filter((o) => o.evidence.derivation === 'inferred').length;
    const totalCount = Math.max(1, occupations.length);
    const directEvidenceRatio = Number((directCount / totalCount).toFixed(2));
    const inferredEvidenceRatio = Number((inferredCount / totalCount).toFixed(2));

    // Fingerprint Calculation
    const fpInput = `${brief.id}||${spatialLayout.id}||${occupations.map((o) => o.canonicalName).join(';')}`;
    const fingerprint = crypto.createHash('sha256').update(fpInput).digest('hex');
    const planId = `oie_${fingerprint.slice(0, 12)}`;

    const plan: OccupationInteractionPlan = {
      id: planId,
      briefId: brief.id,
      spatialLayoutId: spatialLayout.id,
      primaryDomain: spatialLayout.primaryDomain,
      secondaryDomain: spatialLayout.secondaryDomain,
      isMixedDomain: spatialLayout.isMixedDomain,

      occupations,
      poses,
      gestures,
      gazes,
      handObjectInteractions,
      relationships,
      roleHierarchy: hierarchy,

      directEvidenceRatio,
      inferredEvidenceRatio,

      generatedAt: timestamp,
      fingerprint,
    };

    // Validation
    const defects: InteractionValidationDefect[] = [
      ...ProfessionalAuthenticityValidator.validateAuthenticity(occupations),
      ...SafetyEquipmentResolver.validateSafety(occupations, spatialLayout),
      ...relDefects,
      ...InteractionConsistencyValidator.validateConsistency(plan, spatialLayout),
    ];

    for (const occ of occupations) {
      defects.push(...OccupationToolMatcher.matchTools(occ, objectPlacements));
    }

    let deductions = 0;
    for (const d of defects) {
      deductions += d.severity === 'critical' ? 25 : 15;
    }

    if (occupations.length === 0) {
      deductions += 50;
      defects.push({
        code: 'UNSUPPORTED_OCCUPATION',
        severity: 'critical',
        message: 'Interaction plan contains zero occupation profiles.',
      });
    }

    // Imperfect plan penalty for inferred content / complex mixed-domain compositions
    if ((inferredCount > 0 || spatialLayout.isMixedDomain) && defects.length === 0) {
      deductions += 10;
      defects.push({
        code: 'IMPERFECT_INTERACTION_PLAN_INFERRED_CONTENT',
        severity: 'warning',
        message: `Interaction plan contains ${inferredCount} inferred occupation profiles. Score normalized to 90/100.`,
      });
    }

    const validationScore = Math.max(0, Math.min(100, Math.round(100 - deductions)));
    const hasCritical = defects.some((d) => d.severity === 'critical');
    const isValid = validationScore >= 80 && !hasCritical;

    const serializedJson = OccupationInteractionSerializer.serializeJson(plan);
    const humanReadableSummary = OccupationInteractionSerializer.serializeHumanReadable(plan);

    const result: OccupationInteractionResult = {
      briefId: brief.id,
      plan,
      serializedJson,
      humanReadableSummary,
      validationScore,
      isValid,
      defects,
      generatedAt: timestamp,
    };

    OccupationInteractionResultSchema.parse(result);

    return result;
  }
}
