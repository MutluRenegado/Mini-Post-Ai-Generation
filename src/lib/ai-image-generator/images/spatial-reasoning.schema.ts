import { z } from 'zod';

export const DepthLayerSchema = z.enum(['foreground', 'midground', 'background']);

export const SpatialZoneSchema = z.enum(['left_third', 'center_third', 'right_third']);

export const VerticalZoneSchema = z.enum(['top_third', 'middle_third', 'bottom_third']);

export const SpatialPositionSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  zDepth: z.number().min(0).max(1),
  scale: z.number().positive(),
  zone: SpatialZoneSchema,
  verticalZone: VerticalZoneSchema,
});

export const SpatialContainmentSchema = z.object({
  containerNodeId: z.string(),
  boundaryDescription: z.string(),
  isWithinBounds: z.boolean(),
});

export const SpatialReachabilitySchema = z.object({
  ownerNodeId: z.string().optional(),
  distanceToOwner: z.number().min(0),
  isReachable: z.boolean(),
  mountingType: z.string(),
});

export const SpatialOcclusionSchema = z.object({
  isOccluded: z.boolean(),
  occlusionPercentage: z.number().min(0).max(100),
  occludedByNodeId: z.string().optional(),
});

export const PlacementProvenanceSchema = z.object({
  sourceNodeId: z.string(),
  sourceLayer: z.enum(['finalized_article', 'semantic_subject', 'visual_story', 'scene_graph']),
  evidenceExcerpt: z.string(),
  derivation: z.enum(['direct', 'inferred', 'structural']),
  confidence: z.number().min(0).max(1),
  isRequired: z.boolean(),
  placementReason: z.string(),
  reasonForDepth: z.string(),
  reasonForZone: z.string(),
  reasonForScale: z.string(),
  reasonForProximity: z.string(),
});

export const EntityPlacementSchema = z.object({
  nodeId: z.string(),
  label: z.string(),
  nodeType: z.enum(['person', 'occupation', 'action', 'object', 'environment', 'location', 'visual_evidence']),
  domain: z.string(),
  depthLayer: DepthLayerSchema,
  position: SpatialPositionSchema,
  containment: SpatialContainmentSchema,
  reachability: SpatialReachabilitySchema.optional(),
  occlusion: SpatialOcclusionSchema,
  visibilityScore: z.number().min(0).max(1),
  provenance: z.enum(['direct', 'inferred', 'structural']),
  placementProvenance: PlacementProvenanceSchema,
});

export const SpatialLayoutSchema = z.object({
  id: z.string(),
  briefId: z.string(),
  graphId: z.string(),
  primaryDomain: z.string(),
  secondaryDomain: z.string().optional(),
  isMixedDomain: z.boolean(),

  placements: z.array(EntityPlacementSchema),

  heroPlacement: EntityPlacementSchema.optional(),
  environmentPlacement: EntityPlacementSchema.optional(),
  objectPlacements: z.array(EntityPlacementSchema),
  personPlacements: z.array(EntityPlacementSchema),

  foregroundCount: z.number().int().min(0),
  midgroundCount: z.number().int().min(0),
  backgroundCount: z.number().int().min(0),

  allObjectsReachable: z.boolean(),
  isHeroProminent: z.boolean(),

  directPlacementCount: z.number().int().min(0),
  inferredPlacementCount: z.number().int().min(0),

  generatedAt: z.string(),
  fingerprint: z.string(),
});

export const SpatialValidationDefectSchema = z.object({
  code: z.enum([
    'HERO_SUBJECT_OCCLUDED',
    'HERO_PLACED_IN_BACKGROUND',
    'UNREACHABLE_REQUIRED_OBJECT',
    'OBJECT_ASSIGNED_TO_WRONG_PERSON',
    'OUT_OF_BOUNDS_PLACEMENT',
    'FLOATING_UNSUPPORTED_OBJECT',
    'BACKGROUND_PERSON_OPERATING_FOREGROUND_TOOL',
    'UNSUPPORTED_INFERRED_OBJECT_IN_FOREGROUND',
    'EXCESSIVE_INFERRED_PLACEMENT_RATIO',
    'DISCONNECTED_SECONDARY_DOMAIN_SUBJECT',
    'CONFLICTING_DEPTH_ASSIGNMENTS',
    'DUPLICATE_SPATIAL_OCCUPANCY',
    'INVALID_SCALE_RELATIONSHIP',
    'EMPTY_SPATIAL_LAYOUT',
    'CONFLICTING_FOREGROUND_PLACEMENTS',
    'ENVIRONMENT_PLACED_IN_FOREGROUND',
    'IMPERFECT_SPATIAL_LAYOUT_INFERRED_CONTENT',
  ]),
  severity: z.enum(['critical', 'warning']),
  message: z.string(),
  nodeId: z.string().optional(),
});

export const SpatialReasoningResultSchema = z.object({
  briefId: z.string(),
  layout: SpatialLayoutSchema,
  serializedJson: z.string(),
  humanReadableSummary: z.string(),
  validationScore: z.number().min(0).max(100),
  isValid: z.boolean(),
  defects: z.array(SpatialValidationDefectSchema),
  generatedAt: z.string(),
});
