/**
 * Level 28: Spatial Reasoning and Scene Placement Intelligence Types
 */

export type DepthLayer = 'foreground' | 'midground' | 'background';

export type SpatialZone = 'left_third' | 'center_third' | 'right_third';

export type VerticalZone = 'top_third' | 'middle_third' | 'bottom_third';

export interface SpatialPosition {
  /** Normalized X coordinate [0.0 - 1.0] from left to right */
  x: number;
  /** Normalized Y coordinate [0.0 - 1.0] from top to bottom */
  y: number;
  /** Relative depth distance z [0.0 = closest foreground, 1.0 = furthest background] */
  zDepth: number;
  /** Relative scale multiplier [e.g., 1.15 for close-up hero, 0.50 for background] */
  scale: number;
  /** Horizontal spatial third zone */
  zone: SpatialZone;
  /** Vertical spatial third zone */
  verticalZone: VerticalZone;
}

export interface SpatialContainment {
  /** ID of the environment container node */
  containerNodeId: string;
  /** Description of environment boundaries (e.g. "Inside radiology suite") */
  boundaryDescription: string;
  /** Is entity strictly within environment bounds */
  isWithinBounds: boolean;
}

export interface SpatialReachability {
  /** ID of the person/user who owns or operates this object */
  ownerNodeId?: string;
  /** Distance in meters or normalized units to owner */
  distanceToOwner: number;
  /** Is object physically reachable by human user */
  isReachable: boolean;
  /** Interaction type (e.g. "handheld", "desk-mounted", "wall-mounted") */
  mountingType: string;
}

export interface SpatialOcclusion {
  /** Is entity partially or fully occluded */
  isOccluded: boolean;
  /** Percentage of entity hidden by front objects [0 - 100] */
  occlusionPercentage: number;
  /** ID of entity causing occlusion if any */
  occludedByNodeId?: string;
}

export interface PlacementProvenance {
  sourceNodeId: string;
  sourceLayer: 'finalized_article' | 'semantic_subject' | 'visual_story' | 'scene_graph';
  evidenceExcerpt: string;
  derivation: 'direct' | 'inferred' | 'structural';
  confidence: number;
  isRequired: boolean;
  placementReason: string;
  reasonForDepth: string;
  reasonForZone: string;
  reasonForScale: string;
  reasonForProximity: string;
}

export interface EntityPlacement {
  nodeId: string;
  label: string;
  nodeType: 'person' | 'occupation' | 'action' | 'object' | 'environment' | 'location' | 'visual_evidence';
  domain: string;
  depthLayer: DepthLayer;
  position: SpatialPosition;
  containment: SpatialContainment;
  reachability?: SpatialReachability;
  occlusion: SpatialOcclusion;
  /** Visibility index score [0.0 = completely hidden, 1.0 = fully visible] */
  visibilityScore: number;
  /** Direct, inferred, or structural provenance classification */
  provenance: 'direct' | 'inferred' | 'structural';
  /** Deep evidence & placement reasoning metadata */
  placementProvenance: PlacementProvenance;
}

export interface SpatialLayout {
  id: string;
  briefId: string;
  graphId: string;
  primaryDomain: string;
  secondaryDomain?: string;
  isMixedDomain: boolean;

  placements: EntityPlacement[];
  
  heroPlacement?: EntityPlacement;
  environmentPlacement?: EntityPlacement;
  objectPlacements: EntityPlacement[];
  personPlacements: EntityPlacement[];

  /** Count of entities in foreground */
  foregroundCount: number;
  /** Count of entities in midground */
  midgroundCount: number;
  /** Count of entities in background */
  backgroundCount: number;

  /** Are all required objects physically reachable by their operators */
  allObjectsReachable: boolean;
  /** Is hero subject unoccluded and prominent */
  isHeroProminent: boolean;

  /** Count of direct placements */
  directPlacementCount: number;
  /** Count of inferred placements */
  inferredPlacementCount: number;

  generatedAt: string;
  fingerprint: string;
}

export interface SpatialValidationDefect {
  code:
    | 'HERO_SUBJECT_OCCLUDED'
    | 'HERO_PLACED_IN_BACKGROUND'
    | 'UNREACHABLE_REQUIRED_OBJECT'
    | 'OBJECT_ASSIGNED_TO_WRONG_PERSON'
    | 'OUT_OF_BOUNDS_PLACEMENT'
    | 'FLOATING_UNSUPPORTED_OBJECT'
    | 'BACKGROUND_PERSON_OPERATING_FOREGROUND_TOOL'
    | 'UNSUPPORTED_INFERRED_OBJECT_IN_FOREGROUND'
    | 'EXCESSIVE_INFERRED_PLACEMENT_RATIO'
    | 'DISCONNECTED_SECONDARY_DOMAIN_SUBJECT'
    | 'CONFLICTING_DEPTH_ASSIGNMENTS'
    | 'DUPLICATE_SPATIAL_OCCUPANCY'
    | 'INVALID_SCALE_RELATIONSHIP'
    | 'EMPTY_SPATIAL_LAYOUT'
    | 'CONFLICTING_FOREGROUND_PLACEMENTS'
    | 'ENVIRONMENT_PLACED_IN_FOREGROUND'
    | 'IMPERFECT_SPATIAL_LAYOUT_INFERRED_CONTENT';
  severity: 'critical' | 'warning';
  message: string;
  nodeId?: string;
}

export interface SpatialReasoningResult {
  briefId: string;
  layout: SpatialLayout;
  serializedJson: string;
  humanReadableSummary: string;
  validationScore: number;
  isValid: boolean;
  defects: SpatialValidationDefect[];
  generatedAt: string;
}
