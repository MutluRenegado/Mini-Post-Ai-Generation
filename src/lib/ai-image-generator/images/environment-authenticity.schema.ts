import { z } from 'zod';

export const IndoorOutdoorClassificationSchema = z.enum(['indoor', 'outdoor', 'semi_open', 'transition_hub']);

export const EnvironmentEvidenceSchema = z.object({
  sourceLayer: z.enum(['finalized_article', 'semantic_subject', 'visual_story', 'scene_graph', 'spatial_layout', 'occupation_plan']),
  sourceId: z.string(),
  evidenceExcerpt: z.string(),
  derivation: z.enum(['direct', 'inferred', 'structural', 'unresolved']),
  confidence: z.number().min(0).max(1),
  isRequired: z.boolean(),
});

export const LocationContextSchema = z.object({
  workplaceType: z.string(),
  facilityName: z.string(),
  settingDescription: z.string(),
  indoorOutdoor: IndoorOutdoorClassificationSchema,
  evidence: EnvironmentEvidenceSchema,
});

export const ArchitectureContextSchema = z.object({
  buildingStyle: z.string(),
  materials: z.array(z.string()),
  spatialCeilingClearance: z.string(),
  partitionType: z.string(),
  evidence: EnvironmentEvidenceSchema,
});

export const InfrastructureElementSchema = z.object({
  elementId: z.string(),
  label: z.string(),
  category: z.enum(['digital_network', 'diagnostic_suite', 'industrial_machinery', 'power_grid', 'structural']),
  mountingType: z.string(),
  status: z.enum(['active', 'standby', 'monitoring']),
  evidence: EnvironmentEvidenceSchema,
});

export const EnvironmentalConditionSchema = z.object({
  lightingAtmosphere: z.string(),
  temperatureFeel: z.string(),
  cleanlinessLevel: z.enum(['cleanroom', 'sterile_clinical', 'modern_office', 'industrial_plant', 'outdoor_natural']),
  acousticAmbience: z.string(),
  evidence: EnvironmentEvidenceSchema,
});

export const TimePeriodContextSchema = z.object({
  era: z.enum(['modern_contemporary', 'near_future_tech']),
  timeOfDay: z.enum(['daylight', 'night', 'twilight', 'controlled_interior']),
  evidence: EnvironmentEvidenceSchema,
});

export const SeasonContextSchema = z.object({
  seasonName: z.enum(['spring', 'summer', 'autumn', 'winter', 'year_round_controlled']),
  isWeatherDependent: z.boolean(),
  evidence: EnvironmentEvidenceSchema,
});

export const WeatherContextSchema = z.object({
  condition: z.enum(['clear_sunny', 'overcast', 'controlled_indoor', 'field_conditions']),
  visibility: z.enum(['high', 'moderate', 'controlled']),
  evidence: EnvironmentEvidenceSchema,
});

export const RegionalContextSchema = z.object({
  regionName: z.string(),
  organizationalSetting: z.string(),
  evidence: EnvironmentEvidenceSchema,
});

export const EnvironmentObjectCompatibilitySchema = z.object({
  objectNodeId: z.string(),
  objectLabel: z.string(),
  isCompatible: z.boolean(),
  reason: z.string(),
});

export const OccupationEnvironmentCompatibilitySchema = z.object({
  occupationId: z.string(),
  occupationName: z.string(),
  isCompatible: z.boolean(),
  reason: z.string(),
});

export const ActionEnvironmentCompatibilitySchema = z.object({
  actionId: z.string(),
  actionLabel: z.string(),
  isCompatible: z.boolean(),
  reason: z.string(),
});

export const EnvironmentTransitionEdgeSchema = z.object({
  edgeId: z.string(),
  sourceEnvironmentId: z.string(),
  destinationEnvironmentId: z.string(),
  relationshipType: z.enum(['adjacent_zone', 'connected_control_hub', 'secure_partition', 'field_to_facility']),
  evidence: EnvironmentEvidenceSchema,
  confidence: z.number().min(0).max(1),
  derivation: z.enum(['direct', 'inferred']),
  accessibility: z.enum(['open_doorway', 'glass_partition', 'secure_pass', 'adjacent_field']),
  physicalPlausibility: z.boolean(),
});

export const ComponentConfidenceMapSchema = z.object({
  environmentConfidence: z.number().min(0).max(1),
  locationConfidence: z.number().min(0).max(1),
  architectureConfidence: z.number().min(0).max(1),
  infrastructureConfidence: z.number().min(0).max(1),
  workspaceConfidence: z.number().min(0).max(1),
  weatherConfidence: z.number().min(0).max(1),
  seasonConfidence: z.number().min(0).max(1),
  timePeriodConfidence: z.number().min(0).max(1),
  regionalConfidence: z.number().min(0).max(1),
  contextualObjectsConfidence: z.number().min(0).max(1),
});

export const EnvironmentValidationDefectSchema = z.object({
  code: z.enum([
    'OCCUPATION_ENVIRONMENT_MISMATCH',
    'ACTION_ENVIRONMENT_MISMATCH',
    'OBJECT_ENVIRONMENT_MISMATCH',
    'INCOMPATIBLE_INFRASTRUCTURE',
    'CONFLICTING_INDOOR_OUTDOOR',
    'CONFLICTING_ENVIRONMENTS',
    'INCORRECT_TIME_PERIOD',
    'UNSUPPORTED_SEASON',
    'UNSUPPORTED_WEATHER',
    'UNSUPPORTED_REGIONAL_DETAIL',
    'MIXED_DOMAIN_ENVIRONMENT_COLLAPSE',
    'SECONDARY_DOMAIN_ENVIRONMENT_DISCONNECTED',
    'EXCESSIVE_INFERRED_CONTEXT',
    'MISSING_PROVENANCE',
    'INVALID_CONFIDENCE',
    'UNSUPPORTED_CONTEXTUAL_OBJECT',
    'PHYSICALLY_IMPOSSIBLE_ENVIRONMENT',
    'CONTRADICTORY_ENVIRONMENTAL_CONDITIONS',
  ]),
  severity: z.enum(['critical', 'warning']),
  message: z.string(),
  nodeId: z.string().optional(),
});

export const EnvironmentProfileSchema = z.object({
  environmentId: z.string(),
  canonicalName: z.string(),
  aliases: z.array(z.string()),
  domain: z.string(),
  parentEnvironmentId: z.string().optional(),
  indoorOutdoor: IndoorOutdoorClassificationSchema,
  buildingStyle: z.string(),
  compatibleOccupations: z.array(z.string()),
  compatibleActions: z.array(z.string()),
  compatibleInfrastructure: z.array(z.string()),
  compatibleObjects: z.array(z.string()),
  incompatibleObjects: z.array(z.string()),
  incompatibleOccupations: z.array(z.string()),
  incompatibleActions: z.array(z.string()),
  typicalHazards: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  evidence: EnvironmentEvidenceSchema,
});

export const EnvironmentAuthenticityPlanSchema = z.object({
  id: z.string(),
  briefId: z.string(),
  spatialLayoutId: z.string(),
  primaryDomain: z.string(),
  secondaryDomain: z.string().optional(),
  isMixedDomain: z.boolean(),

  profile: EnvironmentProfileSchema,
  location: LocationContextSchema,
  architecture: ArchitectureContextSchema,
  infrastructure: z.array(InfrastructureElementSchema),
  conditions: EnvironmentalConditionSchema,
  timePeriod: TimePeriodContextSchema,
  season: SeasonContextSchema,
  weather: WeatherContextSchema,
  regional: RegionalContextSchema,

  transitions: z.array(EnvironmentTransitionEdgeSchema),
  objectCompatibilities: z.array(EnvironmentObjectCompatibilitySchema),
  occupationCompatibilities: z.array(OccupationEnvironmentCompatibilitySchema),
  actionCompatibilities: z.array(ActionEnvironmentCompatibilitySchema),
  confidenceMap: ComponentConfidenceMapSchema,

  directEvidenceRatio: z.number().min(0).max(1),
  inferredEvidenceRatio: z.number().min(0).max(1),

  generatedAt: z.string(),
  fingerprint: z.string(),
});

export const EnvironmentAuthenticityResultSchema = z.object({
  briefId: z.string(),
  plan: EnvironmentAuthenticityPlanSchema,
  serializedJson: z.string(),
  humanReadableSummary: z.string(),
  validationScore: z.number().min(0).max(100),
  isValid: z.boolean(),
  defects: z.array(EnvironmentValidationDefectSchema),
  generatedAt: z.string(),
});
