/**
 * Level 30: Environment and Context Authenticity Intelligence Types
 */

export type IndoorOutdoorClassification = 'indoor' | 'outdoor' | 'semi_open' | 'transition_hub';

export interface EnvironmentEvidence {
  sourceLayer: 'finalized_article' | 'semantic_subject' | 'visual_story' | 'scene_graph' | 'spatial_layout' | 'occupation_plan';
  sourceId: string;
  evidenceExcerpt: string;
  derivation: 'direct' | 'inferred' | 'structural' | 'unresolved';
  confidence: number;
  isRequired: boolean;
}

export interface LocationContext {
  workplaceType: string;
  facilityName: string;
  settingDescription: string;
  indoorOutdoor: IndoorOutdoorClassification;
  evidence: EnvironmentEvidence;
}

export interface ArchitectureContext {
  buildingStyle: string;
  materials: string[];
  spatialCeilingClearance: string;
  partitionType: string;
  evidence: EnvironmentEvidence;
}

export interface InfrastructureElement {
  elementId: string;
  label: string;
  category: 'digital_network' | 'diagnostic_suite' | 'industrial_machinery' | 'power_grid' | 'structural';
  mountingType: string;
  status: 'active' | 'standby' | 'monitoring';
  evidence: EnvironmentEvidence;
}

export interface EnvironmentalCondition {
  lightingAtmosphere: string;
  temperatureFeel: string;
  cleanlinessLevel: 'cleanroom' | 'sterile_clinical' | 'modern_office' | 'industrial_plant' | 'outdoor_natural';
  acousticAmbience: string;
  evidence: EnvironmentEvidence;
}

export interface TimePeriodContext {
  era: 'modern_contemporary' | 'near_future_tech';
  timeOfDay: 'daylight' | 'night' | 'twilight' | 'controlled_interior';
  evidence: EnvironmentEvidence;
}

export interface SeasonContext {
  seasonName: 'spring' | 'summer' | 'autumn' | 'winter' | 'year_round_controlled';
  isWeatherDependent: boolean;
  evidence: EnvironmentEvidence;
}

export interface WeatherContext {
  condition: 'clear_sunny' | 'overcast' | 'controlled_indoor' | 'field_conditions';
  visibility: 'high' | 'moderate' | 'controlled';
  evidence: EnvironmentEvidence;
}

export interface RegionalContext {
  regionName: string;
  organizationalSetting: string;
  evidence: EnvironmentEvidence;
}

export interface EnvironmentObjectCompatibility {
  objectNodeId: string;
  objectLabel: string;
  isCompatible: boolean;
  reason: string;
}

export interface OccupationEnvironmentCompatibility {
  occupationId: string;
  occupationName: string;
  isCompatible: boolean;
  reason: string;
}

export interface ActionEnvironmentCompatibility {
  actionId: string;
  actionLabel: string;
  isCompatible: boolean;
  reason: string;
}

export interface EnvironmentTransitionEdge {
  edgeId: string;
  sourceEnvironmentId: string;
  destinationEnvironmentId: string;
  relationshipType: 'adjacent_zone' | 'connected_control_hub' | 'secure_partition' | 'field_to_facility';
  evidence: EnvironmentEvidence;
  confidence: number;
  derivation: 'direct' | 'inferred';
  accessibility: 'open_doorway' | 'glass_partition' | 'secure_pass' | 'adjacent_field';
  physicalPlausibility: boolean;
}

export interface ComponentConfidenceMap {
  environmentConfidence: number;
  locationConfidence: number;
  architectureConfidence: number;
  infrastructureConfidence: number;
  workspaceConfidence: number;
  weatherConfidence: number;
  seasonConfidence: number;
  timePeriodConfidence: number;
  regionalConfidence: number;
  contextualObjectsConfidence: number;
}

export interface EnvironmentValidationDefect {
  code:
    | 'OCCUPATION_ENVIRONMENT_MISMATCH'
    | 'ACTION_ENVIRONMENT_MISMATCH'
    | 'OBJECT_ENVIRONMENT_MISMATCH'
    | 'INCOMPATIBLE_INFRASTRUCTURE'
    | 'CONFLICTING_INDOOR_OUTDOOR'
    | 'CONFLICTING_ENVIRONMENTS'
    | 'INCORRECT_TIME_PERIOD'
    | 'UNSUPPORTED_SEASON'
    | 'UNSUPPORTED_WEATHER'
    | 'UNSUPPORTED_REGIONAL_DETAIL'
    | 'MIXED_DOMAIN_ENVIRONMENT_COLLAPSE'
    | 'SECONDARY_DOMAIN_ENVIRONMENT_DISCONNECTED'
    | 'EXCESSIVE_INFERRED_CONTEXT'
    | 'MISSING_PROVENANCE'
    | 'INVALID_CONFIDENCE'
    | 'UNSUPPORTED_CONTEXTUAL_OBJECT'
    | 'PHYSICALLY_IMPOSSIBLE_ENVIRONMENT'
    | 'CONTRADICTORY_ENVIRONMENTAL_CONDITIONS';
  severity: 'critical' | 'warning';
  message: string;
  nodeId?: string;
}

export interface EnvironmentProfile {
  environmentId: string;
  canonicalName: string;
  aliases: string[];
  domain: string;
  parentEnvironmentId?: string;
  indoorOutdoor: IndoorOutdoorClassification;
  buildingStyle: string;
  compatibleOccupations: string[];
  compatibleActions: string[];
  compatibleInfrastructure: string[];
  compatibleObjects: string[];
  incompatibleObjects: string[];
  incompatibleOccupations: string[];
  incompatibleActions: string[];
  typicalHazards: string[];
  confidence: number;
  evidence: EnvironmentEvidence;
}

export interface EnvironmentAuthenticityPlan {
  id: string;
  briefId: string;
  spatialLayoutId: string;
  primaryDomain: string;
  secondaryDomain?: string;
  isMixedDomain: boolean;

  profile: EnvironmentProfile;
  location: LocationContext;
  architecture: ArchitectureContext;
  infrastructure: InfrastructureElement[];
  conditions: EnvironmentalCondition;
  timePeriod: TimePeriodContext;
  season: SeasonContext;
  weather: WeatherContext;
  regional: RegionalContext;

  transitions: EnvironmentTransitionEdge[];
  objectCompatibilities: EnvironmentObjectCompatibility[];
  occupationCompatibilities: OccupationEnvironmentCompatibility[];
  actionCompatibilities: ActionEnvironmentCompatibility[];
  confidenceMap: ComponentConfidenceMap;

  directEvidenceRatio: number;
  inferredEvidenceRatio: number;

  generatedAt: string;
  fingerprint: string;
}

export interface EnvironmentAuthenticityResult {
  briefId: string;
  plan: EnvironmentAuthenticityPlan;
  serializedJson: string;
  humanReadableSummary: string;
  validationScore: number;
  isValid: boolean;
  defects: EnvironmentValidationDefect[];
  generatedAt: string;
}
