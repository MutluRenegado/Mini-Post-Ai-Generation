import { z } from 'zod';

export const HandSideSchema = z.enum(['left_hand', 'right_hand', 'both_hands', 'none']);

export const BodyPostureSchema = z.enum([
  'standing_focused',
  'seated_at_workstation',
  'leaning_forward_inspecting',
  'gesturing_collaboratively',
  'operating_machinery_upright',
  'reviewing_documents',
]);

export const GestureTypeSchema = z.enum([
  'pointing_at_display',
  'holding_diagnostic_tool',
  'typing_on_terminal',
  'handshake_collaboration',
  'explaining_with_open_palms',
  'adjusting_equipment',
]);

export const GazeTargetTypeSchema = z.enum([
  'screen_display',
  'collaborator_face',
  'diagnostic_tool',
  'document',
  'workspace_ahead',
]);

export const RoleHierarchyTypeSchema = z.enum([
  'lead_specialist',
  'peer_collaborator',
  'technical_analyst',
  'field_technician',
]);

export const OccupationResolutionStatusSchema = z.enum([
  'knowledge_base_match',
  'article_role_preserved',
  'unresolved',
  'rejected',
]);

export const UnresolvedOccupationDetailSchema = z.object({
  originalArticlePhrase: z.string(),
  sourceExcerpt: z.string(),
  confidence: z.number().min(0).max(1),
  domainCandidates: z.array(z.string()),
  missingKnowledgeFields: z.array(z.string()),
  safeOptionalDefaults: z.record(z.string(), z.string()),
  prohibitedAssumptions: z.array(z.string()),
  validationStatus: z.enum(['valid_preserved', 'unresolved_flagged', 'rejected']),
});

export const HazardContextSchema = z.object({
  hazardName: z.string(),
  occupation: z.string(),
  action: z.string(),
  environment: z.string(),
  safetyRule: z.string(),
  provenance: z.string(),
  confidence: z.number().min(0).max(1),
  isRequired: z.boolean(),
});

export const OccupationEvidenceSchema = z.object({
  sourceNodeId: z.string(),
  sourceLayer: z.enum(['finalized_article', 'semantic_subject', 'visual_story', 'scene_graph', 'spatial_layout']),
  evidenceExcerpt: z.string(),
  derivation: z.enum(['direct', 'inferred', 'structural']),
  confidence: z.number().min(0).max(1),
  isRequired: z.boolean(),
});

export const ProfessionalAppearanceSchema = z.object({
  clothingType: z.string(),
  colorPalette: z.array(z.string()),
  formalityLevel: z.enum(['formal_business', 'smart_casual', 'scrubs_labcoat', 'industrial_workwear', 'safety_gear']),
  grooming: z.string(),
});

export const SafetyRequirementSchema = z.object({
  equipmentName: z.string(),
  isRequiredByProtocol: z.boolean(),
  standardCode: z.string().optional(),
  isWornInScene: z.boolean(),
  hazardContext: HazardContextSchema.optional(),
});

export const ProfessionalToolSchema = z.object({
  toolId: z.string(),
  label: z.string(),
  category: z.enum(['digital_screen', 'handheld_device', 'diagnostic_instrument', 'heavy_machinery', 'document']),
  isDirectEvidence: z.boolean(),
  confidence: z.number().min(0).max(1),
  mountingType: z.string(),
});

export const ProfessionalActionSchema = z.object({
  actionId: z.string(),
  label: z.string(),
  actionType: z.enum(['operating', 'monitoring', 'analyzing', 'inspecting', 'discussing', 'demonstrating']),
  isRealizedInPose: z.boolean(),
  confidence: z.number().min(0).max(1),
});

export const OccupationProfileSchema = z.object({
  occupationId: z.string(),
  canonicalName: z.string(),
  aliases: z.array(z.string()),
  domain: z.string(),
  typicalEnvironment: z.string(),
  resolutionStatus: OccupationResolutionStatusSchema,
  unresolvedDetail: UnresolvedOccupationDetailSchema.optional(),
  appearance: ProfessionalAppearanceSchema,
  commonTools: z.array(ProfessionalToolSchema),
  safetyRequirements: z.array(SafetyRequirementSchema),
  validActions: z.array(ProfessionalActionSchema),
  prohibitedTools: z.array(z.string()),
  unrealisticActions: z.array(z.string()),
  evidence: OccupationEvidenceSchema,
  confidence: z.number().min(0).max(1),
});

export const HumanPoseSchema = z.object({
  personNodeId: z.string(),
  occupationName: z.string(),
  posture: BodyPostureSchema,
  armPlacement: z.string(),
  headOrientation: z.string(),
});

export const GesturePlanSchema = z.object({
  personNodeId: z.string(),
  gesture: GestureTypeSchema,
  primaryHand: HandSideSchema,
  description: z.string(),
});

export const GazePlanSchema = z.object({
  personNodeId: z.string(),
  targetType: GazeTargetTypeSchema,
  targetNodeId: z.string().optional(),
  targetLabel: z.string(),
  eyeContactState: z.enum(['direct_eye_contact', 'focused_on_target', 'observing_workspace']),
});

export const HandObjectInteractionSchema = z.object({
  personNodeId: z.string(),
  objectNodeId: z.string(),
  objectLabel: z.string(),
  handSide: HandSideSchema,
  gripType: z.enum(['holding', 'touching_screen', 'operating_controls', 'pointing_at', 'resting_on_desk']),
  isReachable: z.boolean(),
  distanceMeters: z.number().min(0),
});

export const HumanRelationshipSchema = z.object({
  sourcePersonNodeId: z.string(),
  targetPersonNodeId: z.string(),
  relationshipType: z.enum(['collaborates_with', 'supervises', 'advises', 'assists', 'cross_domain_connects']),
  description: z.string(),
  domainBridge: z.boolean(),
});

export const RoleHierarchySchema = z.object({
  leadPersonNodeId: z.string(),
  supportingPersonNodeIds: z.array(z.string()),
  hierarchyType: RoleHierarchyTypeSchema,
});

export const InteractionValidationDefectSchema = z.object({
  code: z.enum([
    'UNSUPPORTED_OCCUPATION',
    'UNRELATED_TOOL',
    'INCORRECT_CLOTHING',
    'MISSING_REQUIRED_PPE',
    'UNREALISTIC_PROFESSIONAL_ACTION',
    'OCCUPATION_ENVIRONMENT_MISMATCH',
    'ACTION_OBJECT_MISMATCH',
    'UNREACHABLE_OBJECT_INTERACTION',
    'CONFLICTING_HAND_ASSIGNMENTS',
    'CONTRADICTORY_GAZE_DIRECTION',
    'DISCONNECTED_SUPPORTING_PROFESSIONAL',
    'ROLE_HIERARCHY_CONFLICT',
    'MIXED_DOMAIN_ROLE_COLLAPSE',
    'UNSUPPORTED_INFERRED_DETAIL',
    'EXCESSIVE_INFERRED_CONTENT_RATIO',
    'MISSING_PROVENANCE',
    'INVALID_CONFIDENCE',
    'DUPLICATE_INTERACTION',
    'CONTRADICTORY_INTERACTION',
    'UNRESOLVED_OCCUPATION_DEFECT',
    'IMPERFECT_INTERACTION_PLAN_INFERRED_CONTENT',
  ]),
  severity: z.enum(['critical', 'warning']),
  message: z.string(),
  nodeId: z.string().optional(),
});

export const OccupationInteractionPlanSchema = z.object({
  id: z.string(),
  briefId: z.string(),
  spatialLayoutId: z.string(),
  primaryDomain: z.string(),
  secondaryDomain: z.string().optional(),
  isMixedDomain: z.boolean(),

  occupations: z.array(OccupationProfileSchema),
  poses: z.array(HumanPoseSchema),
  gestures: z.array(GesturePlanSchema),
  gazes: z.array(GazePlanSchema),
  handObjectInteractions: z.array(HandObjectInteractionSchema),
  relationships: z.array(HumanRelationshipSchema),
  roleHierarchy: RoleHierarchySchema,

  directEvidenceRatio: z.number().min(0).max(1),
  inferredEvidenceRatio: z.number().min(0).max(1),

  generatedAt: z.string(),
  fingerprint: z.string(),
});

export const OccupationInteractionResultSchema = z.object({
  briefId: z.string(),
  plan: OccupationInteractionPlanSchema,
  serializedJson: z.string(),
  humanReadableSummary: z.string(),
  validationScore: z.number().min(0).max(100),
  isValid: z.boolean(),
  defects: z.array(InteractionValidationDefectSchema),
  generatedAt: z.string(),
});
