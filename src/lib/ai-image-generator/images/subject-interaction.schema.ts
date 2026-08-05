import { z } from 'zod';

export const SubjectRelationshipSchema = z.object({
  primarySubject: z.string(),
  secondarySubject: z.string(),
  relationshipType: z.enum(['peer_collaborator', 'subject_object', 'mentor_mentee', 'operator_machine']),
  spatialDistanceMeters: z.number(),
});

export const SubjectInteractionDecisionSchema = z.object({
  relationships: z.array(SubjectRelationshipSchema),
  interactionIntent: z.enum([
    'collaborative_discussion',
    'demonstrating_technology',
    'operating_equipment',
    'presenting_data',
    'inspecting_product',
    'focused_solitary_work',
    'observing_process',
  ]),
  gazeDirection: z.enum([
    'direct_camera_contact',
    'focused_on_task_object',
    'looking_at_collaborator',
    'looking_off_camera_thoughtful',
  ]),
  objectHandlingErgonomics: z.string(),
  contextualPositioning: z.string(),
  narrativeCoherenceScore: z.number(),
  collisionAvoidanceVerified: z.boolean(),
  contradictionWarnings: z.array(z.string()).optional(),
  deterministicFingerprint: z.string(),
});
