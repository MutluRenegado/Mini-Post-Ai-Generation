/**
 * Level 29: Occupation and Human Interaction Intelligence Types
 */

export type HandSide = 'left_hand' | 'right_hand' | 'both_hands' | 'none';

export type BodyPosture =
  | 'standing_focused'
  | 'seated_at_workstation'
  | 'leaning_forward_inspecting'
  | 'gesturing_collaboratively'
  | 'operating_machinery_upright'
  | 'reviewing_documents';

export type GestureType =
  | 'pointing_at_display'
  | 'holding_diagnostic_tool'
  | 'typing_on_terminal'
  | 'handshake_collaboration'
  | 'explaining_with_open_palms'
  | 'adjusting_equipment';

export type GazeTargetType = 'screen_display' | 'collaborator_face' | 'diagnostic_tool' | 'document' | 'workspace_ahead';

export type RoleHierarchyType = 'lead_specialist' | 'peer_collaborator' | 'technical_analyst' | 'field_technician';

export type OccupationResolutionStatus =
  | 'knowledge_base_match'
  | 'article_role_preserved'
  | 'unresolved'
  | 'rejected';

export interface UnresolvedOccupationDetail {
  originalArticlePhrase: string;
  sourceExcerpt: string;
  confidence: number;
  domainCandidates: string[];
  missingKnowledgeFields: string[];
  safeOptionalDefaults: Record<string, string>;
  prohibitedAssumptions: string[];
  validationStatus: 'valid_preserved' | 'unresolved_flagged' | 'rejected';
}

export interface HazardContext {
  hazardName: string;
  occupation: string;
  action: string;
  environment: string;
  safetyRule: string;
  provenance: string;
  confidence: number;
  isRequired: boolean;
}

export interface OccupationEvidence {
  sourceNodeId: string;
  sourceLayer: 'finalized_article' | 'semantic_subject' | 'visual_story' | 'scene_graph' | 'spatial_layout';
  evidenceExcerpt: string;
  derivation: 'direct' | 'inferred' | 'structural';
  confidence: number;
  isRequired: boolean;
}

export interface ProfessionalAppearance {
  clothingType: string;
  colorPalette: string[];
  formalityLevel: 'formal_business' | 'smart_casual' | 'scrubs_labcoat' | 'industrial_workwear' | 'safety_gear';
  grooming: string;
}

export interface SafetyRequirement {
  equipmentName: string;
  isRequiredByProtocol: boolean;
  standardCode?: string;
  isWornInScene: boolean;
  hazardContext?: HazardContext;
}

export interface ProfessionalTool {
  toolId: string;
  label: string;
  category: 'digital_screen' | 'handheld_device' | 'diagnostic_instrument' | 'heavy_machinery' | 'document';
  isDirectEvidence: boolean;
  confidence: number;
  mountingType: string;
}

export interface ProfessionalAction {
  actionId: string;
  label: string;
  actionType: 'operating' | 'monitoring' | 'analyzing' | 'inspecting' | 'discussing' | 'demonstrating';
  isRealizedInPose: boolean;
  confidence: number;
}

export interface OccupationProfile {
  occupationId: string;
  canonicalName: string;
  aliases: string[];
  domain: string;
  typicalEnvironment: string;
  resolutionStatus: OccupationResolutionStatus;
  unresolvedDetail?: UnresolvedOccupationDetail;
  appearance: ProfessionalAppearance;
  commonTools: ProfessionalTool[];
  safetyRequirements: SafetyRequirement[];
  validActions: ProfessionalAction[];
  prohibitedTools: string[];
  unrealisticActions: string[];
  evidence: OccupationEvidence;
  confidence: number;
}

export interface HumanPose {
  personNodeId: string;
  occupationName: string;
  posture: BodyPosture;
  armPlacement: string;
  headOrientation: string;
}

export interface GesturePlan {
  personNodeId: string;
  gesture: GestureType;
  primaryHand: HandSide;
  description: string;
}

export interface GazePlan {
  personNodeId: string;
  targetType: GazeTargetType;
  targetNodeId?: string;
  targetLabel: string;
  eyeContactState: 'direct_eye_contact' | 'focused_on_target' | 'observing_workspace';
}

export interface HandObjectInteraction {
  personNodeId: string;
  objectNodeId: string;
  objectLabel: string;
  handSide: HandSide;
  gripType: 'holding' | 'touching_screen' | 'operating_controls' | 'pointing_at' | 'resting_on_desk';
  isReachable: boolean;
  distanceMeters: number;
}

export interface HumanRelationship {
  sourcePersonNodeId: string;
  targetPersonNodeId: string;
  relationshipType: 'collaborates_with' | 'supervises' | 'advises' | 'assists' | 'cross_domain_connects';
  description: string;
  domainBridge: boolean;
}

export interface RoleHierarchy {
  leadPersonNodeId: string;
  supportingPersonNodeIds: string[];
  hierarchyType: RoleHierarchyType;
}

export interface InteractionValidationDefect {
  code:
    | 'UNSUPPORTED_OCCUPATION'
    | 'UNRELATED_TOOL'
    | 'INCORRECT_CLOTHING'
    | 'MISSING_REQUIRED_PPE'
    | 'UNREALISTIC_PROFESSIONAL_ACTION'
    | 'OCCUPATION_ENVIRONMENT_MISMATCH'
    | 'ACTION_OBJECT_MISMATCH'
    | 'UNREACHABLE_OBJECT_INTERACTION'
    | 'CONFLICTING_HAND_ASSIGNMENTS'
    | 'CONTRADICTORY_GAZE_DIRECTION'
    | 'DISCONNECTED_SUPPORTING_PROFESSIONAL'
    | 'ROLE_HIERARCHY_CONFLICT'
    | 'MIXED_DOMAIN_ROLE_COLLAPSE'
    | 'UNSUPPORTED_INFERRED_DETAIL'
    | 'EXCESSIVE_INFERRED_CONTENT_RATIO'
    | 'MISSING_PROVENANCE'
    | 'INVALID_CONFIDENCE'
    | 'DUPLICATE_INTERACTION'
    | 'CONTRADICTORY_INTERACTION'
    | 'UNRESOLVED_OCCUPATION_DEFECT'
    | 'IMPERFECT_INTERACTION_PLAN_INFERRED_CONTENT';
  severity: 'critical' | 'warning';
  message: string;
  nodeId?: string;
}

export interface OccupationInteractionPlan {
  id: string;
  briefId: string;
  spatialLayoutId: string;
  primaryDomain: string;
  secondaryDomain?: string;
  isMixedDomain: boolean;

  occupations: OccupationProfile[];
  poses: HumanPose[];
  gestures: GesturePlan[];
  gazes: GazePlan[];
  handObjectInteractions: HandObjectInteraction[];
  relationships: HumanRelationship[];
  roleHierarchy: RoleHierarchy;

  directEvidenceRatio: number;
  inferredEvidenceRatio: number;

  generatedAt: string;
  fingerprint: string;
}

export interface OccupationInteractionResult {
  briefId: string;
  plan: OccupationInteractionPlan;
  serializedJson: string;
  humanReadableSummary: string;
  validationScore: number;
  isValid: boolean;
  defects: InteractionValidationDefect[];
  generatedAt: string;
}
