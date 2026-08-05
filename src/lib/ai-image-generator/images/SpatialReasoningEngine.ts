import crypto from 'crypto';
import { VisualIntelligenceBrief } from './visual-intelligence.types';
import { SceneGraph, SceneNode, SceneEdge } from './scene-graph.types';
import { VisualStoryNarrative } from './visual-story.types';
import {
  DepthLayer,
  SpatialZone,
  VerticalZone,
  SpatialPosition,
  SpatialContainment,
  SpatialReachability,
  SpatialOcclusion,
  PlacementProvenance,
  EntityPlacement,
  SpatialLayout,
  SpatialValidationDefect,
  SpatialReasoningResult,
} from './spatial-reasoning.types';
import { SpatialReasoningResultSchema } from './spatial-reasoning.schema';

export class SpatialPlanner {
  /**
   * Assigns 2D grid coordinates (x, y) and spatial third zones to nodes.
   */
  public static calculate2DPosition(
    node: SceneNode,
    index: number,
    totalNodes: number,
    isHero: boolean
  ): SpatialPosition {
    let x = 0.5;
    let y = 0.5;
    let zDepth = 0.5;
    let scale = 1.0;
    let zone: SpatialZone = 'center_third';
    let verticalZone: VerticalZone = 'middle_third';

    if (node.type === 'environment') {
      x = 0.5;
      y = 0.5;
      zDepth = 0.95;
      scale = 0.5;
      zone = 'center_third';
      verticalZone = 'middle_third';
    } else if (isHero) {
      // Hero subject positioned prominently in rule-of-thirds center-left
      x = 0.35;
      y = 0.5;
      zDepth = 0.35;
      scale = 1.15;
      zone = 'left_third';
      verticalZone = 'middle_third';
    } else if (node.type === 'person') {
      // Supporting characters positioned in right third
      x = 0.65 + (index % 3) * 0.12;
      y = 0.52;
      zDepth = 0.45 + (index % 2) * 0.05;
      scale = 0.95;
      zone = 'right_third';
      verticalZone = 'middle_third';
    } else if (node.type === 'object') {
      const isDirect = node.provenance === 'direct';
      // Direct objects in midground/foreground; inferred objects pushed to midground/background
      x = 0.20 + (index % 5) * 0.16;
      y = 0.65 + Math.floor(index / 5) * 0.08;
      zDepth = isDirect ? 0.30 + (index % 4) * 0.06 : 0.55 + (index % 3) * 0.10;
      scale = isDirect ? 0.90 : 0.75;
      zone = x < 0.33 ? 'left_third' : x < 0.66 ? 'center_third' : 'right_third';
      verticalZone = y > 0.66 ? 'bottom_third' : 'middle_third';
    } else if (node.type === 'action') {
      x = 0.40 + (index % 3) * 0.10;
      y = 0.45;
      zDepth = 0.40 + (index % 2) * 0.05;
      scale = 1.0;
      zone = 'center_third';
      verticalZone = 'middle_third';
    } else {
      x = 0.15 + (index % 6) * 0.14;
      y = 0.75;
      zDepth = 0.25 + (index % 4) * 0.05;
      scale = 0.75;
      zone = x < 0.33 ? 'left_third' : x < 0.66 ? 'center_third' : 'right_third';
      verticalZone = 'bottom_third';
    }

    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      zDepth: Number(zDepth.toFixed(2)),
      scale: Number(scale.toFixed(2)),
      zone,
      verticalZone,
    };
  }
}

export class DepthPlanner {
  /**
   * Assigns 3D depth layers (foreground, midground, background).
   */
  public static assignDepthLayer(node: SceneNode, isHero: boolean, position: SpatialPosition): DepthLayer {
    if (node.type === 'environment') {
      return 'background';
    }
    if (position.zDepth >= 0.7) {
      return 'background';
    }
    if (position.zDepth <= 0.35) {
      return 'foreground';
    }
    return 'midground';
  }
}

export class VisibilityEngine {
  /**
   * Computes visibility index score and occlusion percentage.
   */
  public static calculateVisibility(
    node: SceneNode,
    isHero: boolean,
    depthLayer: DepthLayer,
    occludedByNodeId?: string
  ): { visibilityScore: number; occlusion: SpatialOcclusion } {
    let visibilityScore = 1.0;
    let occlusionPercentage = 0;
    let isOccluded = false;

    if (occludedByNodeId) {
      isOccluded = true;
      occlusionPercentage = isHero ? 75 : 40;
      visibilityScore = isHero ? 0.25 : 0.60;
    } else if (depthLayer === 'background' && node.type !== 'environment') {
      occlusionPercentage = 20;
      visibilityScore = 0.80;
    } else if (isHero) {
      visibilityScore = 1.0;
      occlusionPercentage = 0;
    } else {
      visibilityScore = 0.92;
      occlusionPercentage = 5;
    }

    return {
      visibilityScore: Number(visibilityScore.toFixed(2)),
      occlusion: {
        isOccluded,
        occlusionPercentage,
        occludedByNodeId,
      },
    };
  }
}

export class ObjectPlacementEngine {
  /**
   * Assigns physical tools/objects to operating users and workstations.
   */
  public static assignObjectReachability(
    objNode: SceneNode,
    peopleNodes: SceneNode[],
    edges: SceneEdge[],
    envContainerNodeId: string
  ): SpatialReachability {
    const opEdge = edges.find(
      (e) => (e.sourceNodeId === objNode.id || e.targetNodeId === objNode.id) && e.relationshipType === 'operates'
    );

    let ownerNodeId: string | undefined = undefined;
    if (opEdge) {
      ownerNodeId = opEdge.sourceNodeId === objNode.id ? opEdge.targetNodeId : opEdge.sourceNodeId;
    } else if (peopleNodes.length > 0) {
      ownerNodeId = peopleNodes[0].id;
    }

    const distanceToOwner = ownerNodeId ? 0.45 : 1.8;
    const isReachable = distanceToOwner <= 1.2;

    let mountingType = 'desk-mounted';
    const labelLower = objNode.label.toLowerCase();
    if (labelLower.includes('tablet') || labelLower.includes('stethoscope') || labelLower.includes('mobile')) {
      mountingType = 'handheld';
    } else if (labelLower.includes('screen') || labelLower.includes('monitor') || labelLower.includes('wall')) {
      mountingType = 'workstation-mounted';
    }

    return {
      ownerNodeId,
      distanceToOwner: Number(distanceToOwner.toFixed(2)),
      isReachable,
      mountingType,
    };
  }
}

export class OcclusionValidator {
  /**
   * Audits occlusion state for defects.
   */
  public static validateOcclusion(placements: EntityPlacement[]): SpatialValidationDefect[] {
    const defects: SpatialValidationDefect[] = [];

    const heroPlacement = placements.find((p) => p.nodeId.includes('hero'));
    if (heroPlacement && heroPlacement.occlusion.isOccluded && heroPlacement.occlusion.occlusionPercentage > 50) {
      defects.push({
        code: 'HERO_SUBJECT_OCCLUDED',
        severity: 'critical',
        message: `Hero subject "${heroPlacement.label}" is occluded by ${heroPlacement.occlusion.occlusionPercentage}% in spatial layout.`,
        nodeId: heroPlacement.nodeId,
      });
    }

    return defects;
  }
}

export class PhysicalConsistencyValidator {
  /**
   * Rejects physically impossible layouts.
   */
  public static validatePhysicalConsistency(placements: EntityPlacement[]): SpatialValidationDefect[] {
    const defects: SpatialValidationDefect[] = [];

    for (const p of placements) {
      // 1. Hero placed in background
      if (p.nodeId.includes('hero') && p.depthLayer === 'background') {
        defects.push({
          code: 'HERO_PLACED_IN_BACKGROUND',
          severity: 'critical',
          message: `Hero subject "${p.label}" is incorrectly placed in the background depth layer.`,
          nodeId: p.nodeId,
        });
      }

      // 2. Environment placed in foreground
      if (p.nodeType === 'environment' && p.depthLayer === 'foreground') {
        defects.push({
          code: 'ENVIRONMENT_PLACED_IN_FOREGROUND',
          severity: 'critical',
          message: `Environment backdrop "${p.label}" is incorrectly placed in the foreground.`,
          nodeId: p.nodeId,
        });
      }

      // 3. Unreachable required object
      if (p.nodeType === 'object' && p.reachability && !p.reachability.isReachable) {
        defects.push({
          code: 'UNREACHABLE_REQUIRED_OBJECT',
          severity: 'warning',
          message: `Object "${p.label}" is placed ${p.reachability.distanceToOwner}m away from operating user and is unreachable.`,
          nodeId: p.nodeId,
        });
      }

      // 4. Out of bounds placement
      if (p.position.x < 0 || p.position.x > 1 || p.position.y < 0 || p.position.y > 1) {
        defects.push({
          code: 'OUT_OF_BOUNDS_PLACEMENT',
          severity: 'critical',
          message: `Entity "${p.label}" is placed outside workspace boundaries at (${p.position.x}, ${p.position.y}).`,
          nodeId: p.nodeId,
        });
      }

      // 5. Background person operating foreground tool
      if (p.nodeType === 'person' && p.depthLayer === 'background') {
        const ownedObj = placements.find((o) => o.reachability?.ownerNodeId === p.nodeId && o.depthLayer === 'foreground');
        if (ownedObj) {
          defects.push({
            code: 'BACKGROUND_PERSON_OPERATING_FOREGROUND_TOOL',
            severity: 'critical',
            message: `Background person "${p.label}" cannot operate foreground tool "${ownedObj.label}".`,
            nodeId: p.nodeId,
          });
        }
      }

      // 6. Low-confidence inferred object occupying foreground
      if (p.nodeType === 'object' && p.provenance === 'inferred' && p.depthLayer === 'foreground') {
        defects.push({
          code: 'UNSUPPORTED_INFERRED_OBJECT_IN_FOREGROUND',
          severity: 'warning',
          message: `Inferred object "${p.label}" incorrectly occupies foreground priority.`,
          nodeId: p.nodeId,
        });
      }

      // 7. Invalid scale relationship (Hero scale smaller than supporting person)
      if (p.nodeId.includes('hero')) {
        const supportingPerson = placements.find((other) => other.nodeType === 'person' && !other.nodeId.includes('hero'));
        if (supportingPerson && p.position.scale < supportingPerson.position.scale) {
          defects.push({
            code: 'INVALID_SCALE_RELATIONSHIP',
            severity: 'warning',
            message: `Hero subject "${p.label}" scale (${p.position.scale}) is smaller than supporting subject (${supportingPerson.position.scale}).`,
            nodeId: p.nodeId,
          });
        }
      }
    }

    // 8. Excessive inferred placement ratio (> 40%)
    const inferredCount = placements.filter((p) => p.provenance === 'inferred').length;
    if (placements.length > 0 && inferredCount / placements.length > 0.4) {
      defects.push({
        code: 'EXCESSIVE_INFERRED_PLACEMENT_RATIO',
        severity: 'warning',
        message: `Inferred placement ratio (${Math.round((inferredCount / placements.length) * 100)}%) exceeds maximum threshold (40%).`,
      });
    }

    // 9. Duplicate spatial occupancy check (identical x, y, zDepth)
    const posSet = new Set<string>();
    for (const p of placements) {
      const posKey = `${p.position.x},${p.position.y},${p.position.zDepth}`;
      if (posSet.has(posKey)) {
        defects.push({
          code: 'DUPLICATE_SPATIAL_OCCUPANCY',
          severity: 'warning',
          message: `Multiple entities share identical 3D spatial coordinates (${posKey}).`,
          nodeId: p.nodeId,
        });
      }
      posSet.add(posKey);
    }

    return defects;
  }
}

export class SpatialSerializer {
  /**
   * Serializes SpatialLayout to normalized JSON.
   */
  public static serializeJson(layout: SpatialLayout): string {
    return JSON.stringify(layout, null, 2);
  }

  /**
   * Serializes SpatialLayout to human-readable summary.
   */
  public static serializeHumanReadable(layout: SpatialLayout): string {
    const lines: string[] = [];
    lines.push(`SPATIAL SCENE LAYOUT [${layout.id}] - Domain: ${layout.primaryDomain}${layout.isMixedDomain ? ' + ' + layout.secondaryDomain : ''}`);
    lines.push(`Depth Map (FG: ${layout.foregroundCount}, MG: ${layout.midgroundCount}, BG: ${layout.backgroundCount}):`);
    for (const p of layout.placements) {
      lines.push(`  - [${p.depthLayer.toUpperCase()}] (${p.position.zone}) ${p.label} (x:${p.position.x}, y:${p.position.y}, z:${p.position.zDepth}, Vis:${p.visibilityScore}, Prov:${p.provenance})`);
    }
    lines.push(`Provenance: Direct=${layout.directPlacementCount}, Inferred=${layout.inferredPlacementCount}`);
    lines.push(`Status: HeroProminent=${layout.isHeroProminent}, AllObjectsReachable=${layout.allObjectsReachable}`);
    return lines.join('\n');
  }
}

export class SpatialReasoningEngine {
  /**
   * Filters a SpatialLayout to return ONLY direct & structural placements, excluding optional inferred content.
   */
  public static getCoreDirectLayout(layout: SpatialLayout): SpatialLayout {
    const directPlacements = layout.placements.filter((p) => p.provenance === 'direct' || p.provenance === 'structural' || p.placementProvenance.isRequired);
    const foregroundCount = directPlacements.filter((p) => p.depthLayer === 'foreground').length;
    const midgroundCount = directPlacements.filter((p) => p.depthLayer === 'midground').length;
    const backgroundCount = directPlacements.filter((p) => p.depthLayer === 'background').length;

    return {
      ...layout,
      id: `${layout.id}_core_direct`,
      placements: directPlacements,
      objectPlacements: directPlacements.filter((p) => p.nodeType === 'object'),
      personPlacements: directPlacements.filter((p) => p.nodeType === 'person'),
      foregroundCount,
      midgroundCount,
      backgroundCount,
      directPlacementCount: directPlacements.length,
      inferredPlacementCount: 0,
    };
  }

  /**
   * Facade orchestrator: Converts SceneGraph into physically coherent 3D spatial layout.
   */
  public static planSpatialLayout(
    brief: VisualIntelligenceBrief,
    story: VisualStoryNarrative,
    sceneGraph: SceneGraph
  ): SpatialReasoningResult {
    if (!brief || !brief.id) {
      throw new Error('INVALID_SPATIAL_INPUT: VisualIntelligenceBrief is required for spatial reasoning.');
    }
    if (!sceneGraph || !sceneGraph.id) {
      throw new Error('INVALID_SPATIAL_INPUT: SceneGraph is required for spatial reasoning.');
    }

    const timestamp = new Date().toISOString();
    const envNode = sceneGraph.nodes.find((n) => n.type === 'environment');
    const containerNodeId = envNode ? envNode.id : 'node_env_workspace';
    const boundaryDesc = envNode ? envNode.label : 'Inside workplace environment';

    const peopleNodes = sceneGraph.nodes.filter((n) => n.type === 'person');
    const placements: EntityPlacement[] = [];

    sceneGraph.nodes.forEach((node, index) => {
      const isHero = node.id === sceneGraph.heroNodeId;
      const position = SpatialPlanner.calculate2DPosition(node, index, sceneGraph.nodes.length, isHero);
      const depthLayer = DepthPlanner.assignDepthLayer(node, isHero, position);
      const vis = VisibilityEngine.calculateVisibility(node, isHero, depthLayer);

      const containment: SpatialContainment = {
        containerNodeId,
        boundaryDescription: boundaryDesc,
        isWithinBounds: position.x >= 0 && position.x <= 1 && position.y >= 0 && position.y <= 1,
      };

      let reachability: SpatialReachability | undefined = undefined;
      if (node.type === 'object') {
        reachability = ObjectPlacementEngine.assignObjectReachability(node, peopleNodes, sceneGraph.edges, containerNodeId);
      }

      const derivation: 'direct' | 'inferred' | 'structural' = node.provenance === 'direct' ? 'direct' : node.type === 'environment' ? 'structural' : 'inferred';
      const isRequired = derivation === 'direct' || isHero;
      const evidenceExcerpt = node.sourceEvidence && node.sourceEvidence.length > 0 ? node.sourceEvidence[0] : `Derived entity for ${node.label}`;

      const placementProvenance: PlacementProvenance = {
        sourceNodeId: node.id,
        sourceLayer: node.provenance === 'direct' ? 'finalized_article' : 'scene_graph',
        evidenceExcerpt,
        derivation,
        confidence: node.confidence,
        isRequired,
        placementReason: `Positioned in ${position.zone} at (${position.x}, ${position.y})`,
        reasonForDepth: `Assigned to ${depthLayer} based on zDepth ${position.zDepth}`,
        reasonForZone: `Mapped to horizontal ${position.zone} and vertical ${position.verticalZone}`,
        reasonForScale: `Scaled to ${position.scale} based on entity type ${node.type} and hero priority`,
        reasonForProximity: reachability ? `Placed ${reachability.distanceToOwner}m from owner ${reachability.ownerNodeId}` : 'Environment boundary placement',
      };

      placements.push({
        nodeId: node.id,
        label: node.label,
        nodeType: node.type,
        domain: node.domain,
        depthLayer,
        position,
        containment,
        reachability,
        occlusion: vis.occlusion,
        visibilityScore: vis.visibilityScore,
        provenance: derivation,
        placementProvenance,
      });
    });

    const heroPlacement = placements.find((p) => p.nodeId === sceneGraph.heroNodeId);
    const environmentPlacement = placements.find((p) => p.nodeType === 'environment');
    const objectPlacements = placements.filter((p) => p.nodeType === 'object');
    const personPlacements = placements.filter((p) => p.nodeType === 'person');

    const foregroundCount = placements.filter((p) => p.depthLayer === 'foreground').length;
    const midgroundCount = placements.filter((p) => p.depthLayer === 'midground').length;
    const backgroundCount = placements.filter((p) => p.depthLayer === 'background').length;

    const directPlacementCount = placements.filter((p) => p.provenance === 'direct').length;
    const inferredPlacementCount = placements.filter((p) => p.provenance === 'inferred').length;

    const allObjectsReachable = objectPlacements.every((o) => o.reachability?.isReachable !== false);
    const isHeroProminent = heroPlacement ? heroPlacement.visibilityScore >= 0.85 && !heroPlacement.occlusion.isOccluded : true;

    // Compute Fingerprint
    const fpInput = `${brief.id}||${sceneGraph.id}||${placements.map((p) => `${p.nodeId}:${p.position.x},${p.position.y},${p.position.zDepth}`).join(';')}`;
    const fingerprint = crypto.createHash('sha256').update(fpInput).digest('hex');
    const layoutId = `sl_${fingerprint.slice(0, 12)}`;

    const layout: SpatialLayout = {
      id: layoutId,
      briefId: brief.id,
      graphId: sceneGraph.id,
      primaryDomain: sceneGraph.primaryDomain,
      secondaryDomain: sceneGraph.secondaryDomain,
      isMixedDomain: sceneGraph.isMixedDomain,

      placements,

      heroPlacement,
      environmentPlacement,
      objectPlacements,
      personPlacements,

      foregroundCount,
      midgroundCount,
      backgroundCount,

      allObjectsReachable,
      isHeroProminent,

      directPlacementCount,
      inferredPlacementCount,

      generatedAt: timestamp,
      fingerprint,
    };

    // Validation
    const defects: SpatialValidationDefect[] = [
      ...OcclusionValidator.validateOcclusion(placements),
      ...PhysicalConsistencyValidator.validatePhysicalConsistency(placements),
    ];

    let deductions = 0;
    for (const d of defects) {
      deductions += d.severity === 'critical' ? 25 : 15;
    }

    if (placements.length === 0) {
      deductions += 50;
      defects.push({
        code: 'EMPTY_SPATIAL_LAYOUT',
        severity: 'critical',
        message: 'Spatial layout contains zero entity placements.',
      });
    }

    // Imperfect spatial layout penalty for inferred content / complex mixed-domain compositions
    if ((inferredPlacementCount > 0 || sceneGraph.isMixedDomain) && defects.length === 0) {
      deductions += 10;
      defects.push({
        code: 'IMPERFECT_SPATIAL_LAYOUT_INFERRED_CONTENT',
        severity: 'warning',
        message: `Spatial layout contains ${inferredPlacementCount} inferred placements / complex mixed-domain elements. Score normalized to 90/100.`,
      });
    }

    const validationScore = Math.max(0, Math.min(100, Math.round(100 - deductions)));
    const hasCritical = defects.some((d) => d.severity === 'critical');
    const isValid = validationScore >= 80 && !hasCritical;

    const serializedJson = SpatialSerializer.serializeJson(layout);
    const humanReadableSummary = SpatialSerializer.serializeHumanReadable(layout);

    const result: SpatialReasoningResult = {
      briefId: brief.id,
      layout,
      serializedJson,
      humanReadableSummary,
      validationScore,
      isValid,
      defects,
      generatedAt: timestamp,
    };

    SpatialReasoningResultSchema.parse(result);

    return result;
  }
}
