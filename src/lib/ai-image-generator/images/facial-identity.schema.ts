import { z } from 'zod';

export const IdentityContinuitySpecSchema = z.object({
  subjectId: z.string().optional(),
  ageBracket: z.enum(['25-35', '35-45', '45-55', '55+']),
  attireStyle: z.string(),
  ethnicityStyle: z.string(),
  hairStyle: z.string(),
});

export const FacialIdentityDecisionSchema = z.object({
  expression: z.enum([
    'confident_professional_smile',
    'focused_concentration',
    'warm_approachable_look',
    'neutral_thoughtful_executive',
  ]),
  gazeTarget: z.enum(['viewer_direct', 'task_focused', 'collaborator_focused']),
  facialOrientationAngle: z.string(),
  identityContinuity: IdentityContinuitySpecSchema,
  expressionToEmotionMatchScore: z.number(),
  multiSubjectIdentitySeparation: z.string(),
  referenceImageConstraint: z.string().optional(),
  privacyContentPolicyCheckPassed: z.boolean(),
  limitationReason: z.string().optional(),
  deterministicFingerprint: z.string(),
});
