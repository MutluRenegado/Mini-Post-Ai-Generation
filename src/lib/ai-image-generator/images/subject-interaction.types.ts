export type InteractionType =
  | 'collaborative_discussion'
  | 'demonstrating_technology'
  | 'operating_equipment'
  | 'presenting_data'
  | 'inspecting_product'
  | 'focused_solitary_work'
  | 'observing_process';

export type GazeDirection =
  | 'direct_camera_contact'
  | 'focused_on_task_object'
  | 'looking_at_collaborator'
  | 'looking_off_camera_thoughtful';

export interface SubjectRelationship {
  primarySubject: string;
  secondarySubject: string;
  relationshipType: 'peer_collaborator' | 'subject_object' | 'mentor_mentee' | 'operator_machine';
  spatialDistanceMeters: number;
}

export interface SubjectInteractionDecision {
  relationships: SubjectRelationship[];
  interactionIntent: InteractionType;
  gazeDirection: GazeDirection;
  objectHandlingErgonomics: string;
  contextualPositioning: string;
  narrativeCoherenceScore: number;
  collisionAvoidanceVerified: boolean;
  contradictionWarnings?: string[];
  deterministicFingerprint: string;
}
